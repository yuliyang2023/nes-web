// The create_fceumm factory is inserted immediately before this adapter.
const BUTTONS = { b: 0, select: 2, start: 3, u: 4, d: 5, l: 6, r: 7, a: 8 };
const OUTPUT_RATE = 44100;
let binaryPromise;
function wasmBytes() {
    if (!binaryPromise) {
        if (nodeRequire) binaryPromise = Promise.resolve(nodeRequire('fs').readFileSync(moduleDirectory + '/fceumm_libretro.wasm'));
        else binaryPromise = fetch(new URL('cdn/tsnes/dist/fceumm_libretro.wasm', document.baseURI).href)
            .then(response => { if (!response.ok) throw new Error('Unable to download emulator core: HTTP ' + response.status); return response.arrayBuffer(); })
            .then(bytes => new Uint8Array(bytes));
        binaryPromise = binaryPromise.catch(error => { binaryPromise = null; throw error; });
    }
    return binaryPromise;
}
function validateRom(data) {
    const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    if (bytes.length < 16 || bytes[0] !== 78 || bytes[1] !== 69 || bytes[2] !== 83 || bytes[3] !== 26) throw new Error('Not a valid NES ROM.');
    const nes2 = (bytes[7] & 12) === 8;
    const size = (low, high, unit) => high === 15 ? Math.pow(2, low >> 2) * ((low & 3) * 2 + 1) : (low + high * 256) * unit;
    const prg = size(bytes[4], nes2 ? bytes[9] & 15 : 0, 16384);
    const chr = size(bytes[5], nes2 ? bytes[9] >> 4 : 0, 8192);
    if (!prg || bytes.length < 16 + (bytes[6] & 4 ? 512 : 0) + prg + chr) throw new Error('Truncated NES ROM.');
    return bytes;
}
// This translated homebrew depends on the old core's MMC3 behavior. Match its
// complete contents, never its filename or a broad mapper family.
function needsLegacy(bytes) {
    if (bytes.length !== 57360) return false;
    let crc = 0xffffffff;
    for (const value of bytes) {
        crc ^= value;
        for (let i = 0; i < 8; i++) crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
    }
    return ((crc ^ 0xffffffff) >>> 0) === 3536066032;
}
class Emulator {
    constructor() {
        this.onsample = null;
        this.onerror = null;
        this.core = null;
        this.generation = 0;
        this.ready = false;
        this.inputs = [0, 0];
        this.turbo = [new Set(), new Set()];
        this.video = new Array(256 * 240).fill(0);
        this.audio = [];
        this.fps = 60;
    }
    async load(data) {
        const bytes = validateRom(data);
        this.dispose();
        if (needsLegacy(bytes)) {
            this.legacy = new LegacyCore.Emulator();
            this.legacy.onsample = sample => { if (this.onsample) this.onsample([sample]); };
            this.legacy.onerror = error => { this.ready = false; if (this.onerror) this.onerror(error); };
            this.legacy.load(bytes.slice().buffer);
            this.engine = 'tsnes (translated Super Snake compatibility)';
            this.fps = 60;
            this.ready = true;
            return;
        }
        this.engine = 'FCEUmm';
        const generation = this.generation;
        this.rom = new Uint8Array(bytes);
        const mod = await create_fceumm({ wasmBinary: await wasmBytes(), locateFile: () => 'fceumm_libretro.wasm',
            print: () => {}, printErr: () => {} });
        if (generation !== this.generation) return;
        this.core = mod;
        this.inputs = [0, 0];
        this.turbo = [new Set(), new Set()];
        this.frameNumber = 0;
        this.audio = [];
        this.phase = 0;
        this.nativeSamples = 0;
        this.previousSample = 0;
        this.nativeRate = 48000;
        this.pixelFormat = 0;
        this.callbacks = [];
        this.strings = new Map();
        const string = value => {
            if (!this.strings.has(value)) {
                const bytes = new TextEncoder().encode(value + '\0');
                const pointer = mod._malloc(bytes.length);
                mod.HEAPU8.set(bytes, pointer);
                this.strings.set(value, pointer);
            }
            return this.strings.get(value);
        };
        const callback = (fn, signature) => { const pointer = mod.addFunction(fn, signature); this.callbacks.push(pointer); return pointer; };
        const variables = new Map();
        const overrides = { fceumm_region: 'Auto', fceumm_overscan_h_left: '0', fceumm_overscan_h_right: '0',
            fceumm_overscan_v_top: '0', fceumm_overscan_v_bottom: '0', fceumm_sndquality: 'High' };
        const logger = callback(() => {}, 'viii');
        mod._retro_set_environment(callback((command, pointer) => {
            const cmd = command & ~0x10000;
            switch (cmd) {
                case 2: case 3: mod.setValue(pointer, 1, 'i8'); return 1;
                case 9: case 19: case 30: case 31: mod.setValue(pointer, string('/'), 'i32'); return 1;
                case 10: {
                    const format = mod.getValue(pointer, 'i32');
                    if (format < 0 || format > 2) return 0;
                    this.pixelFormat = format; return 1;
                }
                case 15: {
                    const key = mod.UTF8ToString(mod.getValue(pointer, 'i32'));
                    const value = overrides[key] || variables.get(key);
                    mod.setValue(pointer + 4, value ? string(value) : 0, 'i32');
                    return value ? 1 : 0;
                }
                case 16:
                    for (let ptr = pointer; mod.getValue(ptr, 'i32'); ptr += 8) {
                        const key = mod.UTF8ToString(mod.getValue(ptr, 'i32'));
                        const definition = mod.UTF8ToString(mod.getValue(ptr + 4, 'i32'));
                        variables.set(key, definition.slice(definition.indexOf(';') + 1).trim().split('|')[0]);
                    }
                    return 1;
                case 17: mod.setValue(pointer, 0, 'i8'); return 1;
                case 27: mod.setValue(pointer, logger, 'i32'); return 1;
                case 39: case 52: mod.setValue(pointer, 0, 'i32'); return 1;
                case 47: mod.setValue(pointer, 3, 'i32'); return 1;
                case 51: return 1;
                case 6: case 8: case 11: case 18: case 35: case 37: return 1;
                default: return 0;
            }
        }, 'iii'));
        mod._retro_set_video_refresh(callback((pointer, width, height, pitch) => {
            if (!pointer || pointer === -1) return;
            if (!width || !height || width > 2048 || height > 2048) throw new Error('Invalid core framebuffer.');
            // Normal NES output is 256x240. Retain the application's fixed video format.
            for (let y = 0; y < 240; y++) {
                const sy = Math.min(height - 1, Math.floor(y * height / 240));
                for (let x = 0; x < 256; x++) {
                    const sx = Math.min(width - 1, Math.floor(x * width / 256));
                    let r, g, b;
                    if (this.pixelFormat === 1) {
                        const pixel = mod.HEAPU32[(pointer + sy * pitch + sx * 4) >> 2];
                        r = (pixel >> 16) & 255; g = (pixel >> 8) & 255; b = pixel & 255;
                    } else {
                        const pixel = mod.HEAPU16[(pointer + sy * pitch + sx * 2) >> 1];
                        const greenBits = this.pixelFormat === 2 ? 63 : 31;
                        r = Math.round(((pixel >> (this.pixelFormat === 2 ? 11 : 10)) & 31) * 255 / 31);
                        g = Math.round(((pixel >> 5) & greenBits) * 255 / greenBits);
                        b = Math.round((pixel & 31) * 255 / 31);
                    }
                    this.video[y * 256 + x] = r | (g << 8) | (b << 16);
                }
            }
        }, 'viiii'));
        const sample = (left, right) => {
            const value = (left + right) / 65536;
            const index = this.nativeSamples++;
            while (this.phase <= index) {
                const fraction = Math.max(0, Math.min(1, this.phase - index + 1));
                this.audio.push(this.previousSample + (value - this.previousSample) * fraction);
                this.phase += this.nativeRate / OUTPUT_RATE;
            }
            this.previousSample = value;
        };
        mod._retro_set_audio_sample(callback(sample, 'vii'));
        mod._retro_set_audio_sample_batch(callback((pointer, frames) => {
            for (let i = 0; i < frames; i++) sample(mod.HEAP16[(pointer >> 1) + i * 2], mod.HEAP16[(pointer >> 1) + i * 2 + 1]);
            return frames;
        }, 'iii'));
        mod._retro_set_input_poll(callback(() => {}, 'v'));
        mod._retro_set_input_state(callback((port, device, index, id) => {
            if (device !== 1 || port > 1) return 0;
            let bits = this.inputs[port] || 0;
            if ((this.frameNumber % 4) < 2) for (const button of this.turbo[port]) bits |= 1 << button;
            return id === 256 ? bits : (bits >> id) & 1;
        }, 'iiiii'));
        mod._retro_init();
        this.initialized = true;
        mod._retro_set_controller_port_device(0, 1);
        mod._retro_set_controller_port_device(1, 1);
        // FCEUmm also opens the content path; provide a MEMFS file as well as bytes.
        mod.FS.writeFile('/game.nes', bytes);
        const dataPointer = mod._malloc(bytes.length);
        mod.HEAPU8.set(bytes, dataPointer);
        this.dataPointer = dataPointer;
        const info = mod._malloc(16);
        mod.setValue(info, string('/game.nes'), 'i32');
        mod.setValue(info + 4, dataPointer, 'i32');
        mod.setValue(info + 8, bytes.length, 'i32');
        mod.setValue(info + 12, 0, 'i32');
        const loaded = mod._retro_load_game(info);
        mod._free(info);
        if (!loaded) { this.dispose(); throw new Error('FCEUmm could not load this NES ROM.'); }
        this.ready = true;
        const av = mod._malloc(40);
        mod._retro_get_system_av_info(av);
        const sampleRate = mod.getValue(av + 32, 'double');
        const fps = mod.getValue(av + 24, 'double');
        if (sampleRate > 0) this.nativeRate = sampleRate;
        if (fps > 0) this.fps = fps;
        mod._free(av);
    }
    reset() {
        if (this.legacy) { this.legacy.reset(); return; }
        if (this.ready) { this.core._retro_reset(); this.inputs = [0, 0]; this.turbo = [new Set(), new Set()]; this.audio = []; }
    }
    buttonDown(player, button) {
        if (this.legacy) { this.legacy.buttonDown(player, button); return; }
        if (player !== 1 && player !== 2) return;
        if (button === 'A' || button === 'B') this.turbo[player - 1].add(button === 'A' ? 8 : 0);
        else if (BUTTONS[button] !== undefined) this.inputs[player - 1] |= 1 << BUTTONS[button];
    }
    buttonUp(player, button) {
        if (this.legacy) { this.legacy.buttonUp(player, button); return; }
        if (player !== 1 && player !== 2) return;
        if (button === 'A' || button === 'B') this.turbo[player - 1].delete(button === 'A' ? 8 : 0);
        else if (BUTTONS[button] !== undefined) this.inputs[player - 1] &= ~(1 << BUTTONS[button]);
    }
    frame() {
        if (!this.ready) return false;
        if (this.legacy) return this.legacy.frame();
        try {
            const audioStart = this.audio.length;
            this.core._retro_run(); this.frameNumber++;
            if (this.onsample && this.audio.length > audioStart) this.onsample(this.audio.slice(audioStart));
            return true;
        } catch (error) { this.ready = false; if (this.onerror) this.onerror(error); return false; }
    }
    pull() { if (this.legacy) return this.legacy.pull(); const audio = this.audio; this.audio = []; return { video: this.video, audio }; }
    dispose() {
        this.generation++;
        this.legacy = null;
        if (this.core) {
            if (this.ready) this.core._retro_unload_game();
            if (this.initialized) this.core._retro_deinit();
            for (const ptr of this.callbacks || []) this.core.removeFunction(ptr);
        }
        this.ready = false; this.initialized = false; this.core = null; this.audio = [];
    }
}

class Speaker {
    constructor() { this.buffer = []; this.onbufferunderrun = null; this.read = 0; }
    contextReady() {
        if (this.context) return true;
        if (typeof window === 'undefined') return false;
        const Audio = window.AudioContext || window.webkitAudioContext;
        if (!Audio) return false;
        this.context = new Audio({ sampleRate: OUTPUT_RATE });
        this.context.resume().catch(() => {});
        return true;
    }
    push(sample) {
        if (!this.contextReady()) return;
        if (!this.processor) {
            this.processor = this.context.createScriptProcessor(1024, 0, 1);
            this.processor.onaudioprocess = event => {
                const output = event.outputBuffer.getChannelData(0);
                if (this.onbufferunderrun && this.buffer.length - this.read < output.length) this.onbufferunderrun(this.buffer.length - this.read, output.length);
                if (this.buffer.length - this.read > output.length * 3) this.read = this.buffer.length - output.length * 2;
                output.fill(0);
                const length = Math.min(output.length, this.buffer.length - this.read);
                for (let i = 0; i < length; i++) output[i] = this.buffer[this.read++];
                if (this.read > 8192) { this.buffer = this.buffer.slice(this.read); this.read = 0; }
            };
            this.processor.connect(this.context.destination);
        }
        const samples = typeof sample === 'number' ? [sample] : sample;
        for (const value of samples) this.buffer.push(value);
    }
    play(samples) {
        if (!this.contextReady()) return;
        const buffer = this.context.createBuffer(1, samples.length, OUTPUT_RATE);
        buffer.getChannelData(0).set(samples);
        const source = this.context.createBufferSource();
        source.buffer = buffer; source.connect(this.context.destination); source.start();
    }
    close() {
        if (this.processor) { this.processor.disconnect(); this.processor = null; }
        if (this.context) { this.context.close().catch(() => {}); this.context = null; }
        this.buffer = []; this.read = 0;
    }
}
exports.Emulator = Emulator;
exports.Speaker = Speaker;
exports.CORE_NAME = 'FCEUmm';
exports.CORE_VERSION = 'romdev-core-fceumm@0.13.2+nes-web.1';
