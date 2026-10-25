const { test } = require('node:test');
const assert = require('node:assert/strict');
const { Emulator, CORE_NAME } = require('../vendor/tsnes');

// Original test program: read both joypads into CPU RAM, without a game ROM.
function rom(mapper = 0, nes2 = false) {
    const b = Buffer.alloc(16 + 32768 + 8192);
    b.set([78,69,83,26,2,1,(mapper & 15) << 4,(mapper & 240) | (nes2 ? 8 : 0)]);
    const program = [0x78,0xd8,0xa2,0xff,0x9a,0xa9,1,0x8d,0x16,0x40,0xa9,0,0x8d,0x16,0x40];
    for (let i=0;i<8;i++) program.push(0xad,0x16,0x40,0x29,1,0x85,i,0xad,0x17,0x40,0x29,1,0x85,16+i);
    program.push(0x4c,5,0x80);
    b.set(program,16);
    for (const vector of [0x7ffa,0x7ffc,0x7ffe]) b.set([0,0x80],16+vector);
    return b;
}

test('FCEUmm initializes asynchronously, preserves video/audio and reads both controllers', async () => {
    assert.equal(CORE_NAME,'FCEUmm');
    const e = new Emulator();
    try {
        await e.load(rom());
        e.buttonDown(1,'r'); e.buttonDown(1,'a'); e.buttonDown(2,'start'); e.buttonDown(2,'u');
        const callbacks=[]; e.onsample = samples => callbacks.push(samples.length);
        for(let i=0;i<60;i++) assert.equal(e.frame(),true);
        const o=e.pull();
        assert.equal(o.video.length,256*240);
        assert.ok(o.audio.length>43000 && o.audio.length<45000);
        assert.ok(o.audio.every(v=>Number.isFinite(v)&&Math.abs(v)<=1));
        assert.equal(callbacks.reduce((a,b)=>a+b,0),o.audio.length,'no duplicated audio during buffer underrun frames');
        const ram=e.core._retro_get_memory_data(2);
        assert.deepEqual(Array.from(e.core.HEAPU8.subarray(ram,ram+8)),[1,0,0,0,0,0,0,1]);
        assert.deepEqual(Array.from(e.core.HEAPU8.subarray(ram+16,ram+24)),[0,0,0,1,1,0,0,0]);
        e.buttonUp(1,'r'); e.buttonUp(1,'a'); e.frame(); e.pull();
        assert.equal(e.core.HEAPU8[ram],0); assert.equal(e.core.HEAPU8[ram+7],0);
        e.buttonDown(1,'A'); e.reset();
        await e.load(rom()); assert.equal(e.frame(),true);
    } finally {e.dispose();}
    assert.equal(e.frame(),false);
});

test('required mapper families and NES 2.0 submapper headers load', async () => {
    for (const mapper of [1,19,23,25,85,90,192,198]) {
        const e=new Emulator();
        try {const b=rom(mapper,mapper===25);if(mapper===25){b[8]=0x20;b[10]=7;}await e.load(b);assert.equal(e.frame(),true,'mapper '+mapper);}
        finally {e.dispose();}
    }
});

test('malformed/truncated content rejects; overlapping asynchronous loads keep latest ROM',async()=>{
    const e=new Emulator();
    await assert.rejects(e.load(Buffer.alloc(16)),/valid NES/);
    await assert.rejects(e.load(rom().subarray(0,32)),/Truncated/);
    await Promise.all([e.load(rom()),e.load(rom())]);
    assert.equal(e.frame(),true);e.dispose();
});

test('VRC4 trainer code stays executable after a translated ROM clears WRAM enable', async()=>{
    const b=rom(25,true);b[8]=0x20;b[10]=7;
    const trainer=Buffer.alloc(512);
    trainer.set([0xa9,0x42,0x85,0x20,0x4c,4,0x70]);
    const game=Buffer.concat([b.subarray(0,16),trainer,b.subarray(16)]);
    game[6]|=4;
    game.set([0x78,0xa9,0,0x8d,4,0x90,0x4c,0,0x70],528);
    const e=new Emulator();
    try {await e.load(game);e.frame();assert.equal(e.core.HEAPU8[e.core._retro_get_memory_data(2)+0x20],0x42);}
    finally {e.dispose();}
    // Ordinary cartridges keep the hardware's protection behavior.
    b.set([0xa9,0x42,0x8d,0,0x70,0xa9,0,0x8d,4,0x90,0xad,0,0x70,0x85,0x20,0x4c,15,0x80],16);
    try {await e.load(b);e.frame();assert.equal(e.core.HEAPU8[e.core._retro_get_memory_data(2)+0x20],0x70);}
    finally {e.dispose();}
});
