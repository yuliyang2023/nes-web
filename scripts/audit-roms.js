const fs = require("fs"), path = require("path"), crypto = require("crypto"), zlib = require("zlib"), {spawn: spawn} = require("child_process");

// Runs each ROM in an isolated process. All source ROMs are read-only.
const root = process.env.NES_AUDIT_ROM_DIR, out = path.resolve(process.env.NES_AUDIT_OUT || "dist/rom-audit-fixed");

const base = process.env.NES_AUDIT_BASE || "http://127.0.0.1:8180";

const core = path.resolve(process.env.NES_AUDIT_CORE || path.join(__dirname, "../vendor/tsnes/dist/nes.js"));

const frames = Number(process.env.NES_AUDIT_FRAMES || 1800);

if (!root || !Number.isInteger(frames) || frames < 1800) throw Error("Set NES_AUDIT_ROM_DIR; NES_AUDIT_FRAMES must be at least 1800");

function png(file, pixels) {
    const crcTable = Array.from({
        length: 256
    }, (_, n) => {
        for (let k = 0; k < 8; k++) n = n & 1 ? 3988292384 ^ n >>> 1 : n >>> 1;
        return n >>> 0;
    });
    function chunk(type, data) {
        const t = Buffer.from(type), b = Buffer.concat([ t, data ]);
        let crc = 4294967295;
        for (const v of b) crc = crcTable[(crc ^ v) & 255] ^ crc >>> 8;
        const h = Buffer.alloc(4), c = Buffer.alloc(4);
        h.writeUInt32BE(data.length);
        c.writeUInt32BE((crc ^ 4294967295) >>> 0);
        return Buffer.concat([ h, b, c ]);
    }
    const rows = Buffer.alloc(240 * (256 * 3 + 1));
    for (let y = 0; y < 240; y++) for (let x = 0; x < 256; x++) {
        const p = pixels[y * 256 + x], i = y * 769 + 1 + x * 3;
        rows[i] = p & 255;
        rows[i + 1] = p >> 8 & 255;
        rows[i + 2] = p >> 16 & 255;
    }
    const ih = Buffer.alloc(13);
    ih.writeUInt32BE(256, 0);
    ih.writeUInt32BE(240, 4);
    ih[8] = 8;
    ih[9] = 2;
    fs.writeFileSync(file, Buffer.concat([ Buffer.from([ 137, 80, 78, 71, 13, 10, 26, 10 ]), chunk("IHDR", ih), chunk("IDAT", zlib.deflateSync(rows)), chunk("IEND", Buffer.alloc(0)) ]));
}

function writeReport(results) {
    const summary = {
        date: (new Date).toISOString(),
        root: root,
        base: base,
        coreSha256: crypto.createHash("sha256").update(fs.readFileSync(core)).digest("hex"),
        counts: results.reduce((a, r) => (a[r.status] = (a[r.status] || 0) + 1, a), {}),
        scope: "Automated startup and short execution with Start/direction/A/B. No full-game completion or physical USB/audio validation."
    };
    fs.writeFileSync(path.join(out, "summary.json"), JSON.stringify(summary, null, 2));
    const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    fs.writeFileSync(path.join(out, "report.html"), '<!doctype html><meta charset="utf-8"><title>NES ROM compatibility audit</title><style>body{font:16px sans-serif;background:#f5f7fb;color:#172033;margin:24px}article{background:white;padding:16px;margin:16px 0}img{width:256px;image-rendering:pixelated;margin:8px}code{word-break:break-all}</style><h1>NES ROM compatibility audit</h1><p>' + esc(summary.scope) + "</p><pre>" + esc(JSON.stringify(summary, null, 2)) + "</pre>" + results.map(r => "<article><h2>" + r.index + ". " + esc(r.name) + "</h2><p>" + esc(r.status) + " / mapper " + r.mapper + " / " + r.frames + " frames / " + esc(r.engine) + "</p><code>" + esc(r.sha256) + "</code><p>" + esc(r.error || r.errors.join(" / ")) + "</p>" + (r.snapshots || []).map(f => '<img src="' + esc(f) + '" title="' + esc(f) + '">').join("") + "</article>").join(""));
}

async function worker(index, name) {
    const {Emulator: Emulator} = require(core);
    let emulator;
    let result = {
        index: index,
        name: name,
        frames: 0,
        errors: [],
        snapshots: []
    };
    const started = Date.now();
    try {
        const local = fs.readFileSync(path.join(root, name));
        result.bytes = local.length;
        result.sha256 = crypto.createHash("sha256").update(local).digest("hex");
        result.header = local.subarray(0, 16).toString("hex");
        result.mapper = local[6] >> 4 | local[7] & 240;
        result.headerValid = local.subarray(0, 4).equals(Buffer.from([ 78, 69, 83, 26 ]));
        result.expectedBytes = 16 + (local[6] & 4 ? 512 : 0) + local[4] * 16384 + local[5] * 8192;
        const response = await fetch(base + "/roms/" + encodeURIComponent(name), {
            signal: AbortSignal.timeout(15e3)
        });
        result.http = response.status;
        const body = Buffer.from(await response.arrayBuffer());
        result.httpMatches = local.equals(body);
        if (!response.ok || !result.httpMatches) throw Error("HTTP ROM download mismatch");
        emulator = new Emulator;
        emulator.onerror = error => result.errors.push(String(error));
        await emulator.load(body);
        result.engine = emulator.engine;
        result.loaded = true;
        result.audioSamples = 0;
        result.nonzeroAudioSamples = 0;
        result.maxColors = 0;
        result.lastRichFrame = 0;
        const hashes = new Set;
        let last;
        for (let frame = 0; frame < frames; frame++) {
            if ([ 240, 480, 720, 960, 1200 ].includes(frame)) emulator.buttonDown(1, "start");
            if ([ 252, 492, 732, 972, 1212 ].includes(frame)) emulator.buttonUp(1, "start");
            if (frame === 1300) {
                emulator.buttonDown(1, "r");
                emulator.buttonDown(1, "a");
            }
            if (frame === 1450) {
                emulator.buttonUp(1, "r");
                emulator.buttonUp(1, "a");
                emulator.buttonDown(1, "b");
            }
            if (frame === 1500) emulator.buttonUp(1, "b");
            if (!emulator.frame()) throw Error("Emulator stopped at frame " + frame);
            result.frames = frame + 1;
            last = emulator.pull();
            if (last.video.length !== 61440) throw Error("Invalid video size");
            if (!last.audio.every(n => Number.isFinite(n) && Math.abs(n) <= 1)) throw Error("Invalid PCM audio");
            result.audioSamples += last.audio.length;
            result.nonzeroAudioSamples += last.audio.filter(n => Math.abs(n) > 1e-4).length;
            if (frame % 60 === 0) {
                const colors = new Set(last.video).size;
                result.maxColors = Math.max(result.maxColors, colors);
                if (colors > 2) result.lastRichFrame = frame;
            }
            if (frame % 60 === 0) hashes.add(crypto.createHash("sha1").update(Buffer.from(new Uint32Array(last.video).buffer)).digest("hex"));
            if ([ 179, 599, 1799, frames - 1 ].includes(frame) || frames > 1800 && frame % 600 === 599) {
                const filename = String(index).padStart(2, "0") + "-" + (frame + 1) + ".png";
                png(path.join(out, filename), last.video);
                result.snapshots.push(filename);
            }
        }
        result.uniqueVideoSamples = hashes.size;
        result.finalColors = new Set(last.video).size;
        result.status = hashes.size > 2 && result.lastRichFrame > frames - 600 && result.audioSamples > frames * 650 && result.audioSamples < frames * 900 && !result.errors.length ? "runtime_pass" : "visual_review";
    } catch (e) {
        result.status = result.loaded ? "runtime_failed" : "load_failed";
        result.error = String(e);
    }
    if (emulator) emulator.dispose();
    result.wallSeconds = +((Date.now() - started) / 1e3).toFixed(2);
    console.log(JSON.stringify(result));
}

async function parent() {
    fs.mkdirSync(out, {
        recursive: true
    });
    const names = fs.readdirSync(root).filter(n => n.toLowerCase().endsWith(".nes")).sort();
    const list = await (await fetch(base + "/api/games/")).json();
    fs.writeFileSync(path.join(out, "catalog.json"), JSON.stringify(list, null, 2));
    let next = 0, done = 0;
    const results = [];
    async function run() {
        while (next < names.length) {
            const i = next++, name = names[i];
            const result = await new Promise(resolve => {
                const child = spawn(process.execPath, [ __filename, "--worker", String(i + 1), name ], {
                    stdio: [ "ignore", "pipe", "pipe" ]
                });
                let stdout = "", stderr = "", timed = false;
                child.stdout.on("data", d => stdout += d);
                child.stderr.on("data", d => stderr += d);
                const timer = setTimeout(() => {
                    timed = true;
                    child.kill("SIGKILL");
                }, 9e4);
                child.on("exit", code => {
                    clearTimeout(timer);
                    try {
                        resolve(JSON.parse(stdout.trim().split("\n").pop()));
                    } catch (e) {
                        resolve({
                            index: i + 1,
                            name: name,
                            status: timed ? "timeout" : "worker_failed",
                            error: stderr.slice(-1500),
                            code: code
                        });
                    }
                });
            });
            results.push(result);
            done++;
            fs.writeFileSync(path.join(out, "results.json"), JSON.stringify(results.sort((a, b) => a.index - b.index), null, 2));
            console.log(done + "/" + names.length + " mapper=" + result.mapper + " " + result.status + " " + result.frames + "f " + name);
        }
    }
    await Promise.all([ run(), run() ]);
    writeReport(results);
    console.log("SUMMARY " + JSON.stringify(results.reduce((s, r) => (s[r.status] = (s[r.status] || 0) + 1, 
    s), {})));
}

(process.argv[2] === "--report" ? Promise.resolve(writeReport(JSON.parse(fs.readFileSync(path.join(out,"results.json"),"utf8")))) : process.argv[2] === "--worker" ? worker(Number(process.argv[3]), process.argv[4]) : parent()).catch(e => {
    console.error(e);
    process.exit(1);
});
