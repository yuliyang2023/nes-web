const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { Emulator } = require('../vendor/tsnes');

function fixture(mapper = 23) {
    const data = new Uint8Array(16 + 4 * 16384 + 8 * 8192);
    data.set([0x4e, 0x45, 0x53, 0x1a, 4, 8, (mapper & 15) << 4, mapper & 240]);
    for (let bank = 0; bank < 8; bank++) data.fill(bank, 16 + bank * 8192, 16 + (bank + 1) * 8192);
    for (let bank = 0; bank < 64; bank++) data.fill(bank, 16 + 65536 + bank * 1024, 16 + 65536 + (bank + 1) * 1024);
    const emulator = new Emulator();
    emulator.load(data.buffer);
    return emulator;
}

test('PRG banks, fixed vectors, swap mode, and RAM', () => {
    const { cpu } = fixture().system;
    const m = cpu.mapper;
    const banks = () => [0x8000, 0xa000, 0xc000, 0xe000].map(a => cpu.mem[a]);
    assert.deepEqual(banks(), [0, 1, 6, 7]);
    m.write(0x8000, 3);
    m.write(0xa000, 4);
    assert.deepEqual(banks(), [3, 4, 6, 7]);
    m.write(0x9002, 2);
    assert.deepEqual(banks(), [6, 4, 3, 7]);
    m.write(0x9008, 0);
    assert.deepEqual(banks(), [3, 4, 6, 7]);
    m.write(0x6000, 123);
    assert.equal(m.load(0x6000), 123);
});

test('both address wirings select all eight CHR banks and preserve nibbles', () => {
    for (const shift of [0, 2]) {
        const { cpu, ppu } = fixture().system;
        for (let bank = 0; bank < 8; bank++) {
            const page = 0xb000 + (bank >> 1) * 0x1000;
            const reg = (bank & 1) * 2;
            const value = 32 + bank;
            cpu.mapper.write(page + (reg << shift), value & 15);
            cpu.mapper.write(page + ((reg + 1) << shift), value >> 4);
            assert.equal(cpu.mapper.chrBanks[bank], value);
            assert.equal(ppu.vramMem[bank * 1024], value);
            assert.equal(ppu.vramMem[bank * 1024 + 1023], value);
        }
        for (let mode = 0; mode < 4; mode++) {
            cpu.mapper.write(0x9000, mode);
            assert.equal(ppu.currentMirroring, [0, 1, 3, 4][mode]);
        }
    }
});

test('VRC4 cycle IRQ reloads, acknowledges, and re-enables as configured', () => {
    const m = fixture().system.cpu.mapper;
    m.write(0xf000, 14);
    m.write(0xf001, 15);
    m.write(0xf002, 7);
    m.clockCpuCycles(1);
    assert.equal(m.irqPending, false);
    m.clockCpuCycles(1);
    assert.equal(m.irqPending, true);
    assert.equal(m.irqCounter, 254);
    m.write(0xf003, 0);
    assert.equal(m.irqPending, false);
    m.clockCpuCycles(2);
    assert.equal(m.irqPending, true);
    m.write(0xf002, 6);
    m.write(0xf003, 0);
    m.clockCpuCycles(100);
    assert.equal(m.irqPending, false);
});

test('scanline IRQ uses CPU prescaler even without PPU rendering', () => {
    const m = fixture().system.cpu.mapper;
    m.write(0xf000, 15);
    m.write(0xf004, 15);
    m.write(0xf008, 2);
    m.clockCpuCycles(113);
    assert.equal(m.irqPending, false);
    m.clockCpuCycles(1);
    assert.equal(m.irqPending, true);
    m.write(0xf00c, 0);
    assert.equal(m.irqPending, false);
});

test('IRQ hook clocks DMA stalls and leaves existing mapper loading intact', () => {
    const e = fixture();
    // Keep the CPU in a known idle loop: fixture PRG bytes are bank markers.
    e.system.cpu.emulate = () => 2;
    e.system.cpu.cyclesToHalt = 24;
    let elapsed = 0;
    const m = e.system.cpu.mapper;
    const clock = m.clockCpuCycles.bind(m);
    m.clockCpuCycles = cycles => { elapsed += cycles; clock(cycles); };
    assert.equal(e.frame(), true);
    assert.ok(elapsed > 24);
    for (const mapper of [0, 1, 2, 3, 4, 66]) assert.ok(fixture(mapper).system);
    assert.throws(() => fixture(99), /unsupported mapper: 99/);
});

if (process.env.NES_TEST_ROM) {
    test('deployed mapper 23 ROM runs 1200 frames, including Start input', () => {
        const data = fs.readFileSync(process.env.NES_TEST_ROM);
        const emulator = new Emulator();
        const errors = [];
        emulator.onerror = error => errors.push(error);
        emulator.load(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength));
        const screens = new Set();
        for (let frame = 0; frame < 1200; frame++) {
            if (frame === 300 || frame === 600) emulator.buttonDown(1, 'start');
            if (frame === 310 || frame === 610) emulator.buttonUp(1, 'start');
            assert.equal(emulator.frame(), true, `frame ${frame}: ${errors}`);
            const out = emulator.pull();
            if (frame % 60 === 0) screens.add(out.video.join(','));
        }
        assert.deepEqual(errors, []);
        assert.ok(screens.size > 2, 'video should change during execution');
    });
}
