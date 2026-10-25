// Exercise the source-built HTTP and WebSocket service before packaging it.
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const os = require('node:os');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const root = path.resolve(__dirname, '../dist');
const WS = require(path.join(root, 'server/node_modules/ws'));

async function main() {
    const listener = net.createServer();
    listener.listen(0, '127.0.0.1');
    await once(listener, 'listening');
    const port = listener.address().port;
    await new Promise(resolve => listener.close(resolve));
    const name = 'ci-smoke-' + crypto.randomUUID();
    const external = fs.mkdtempSync(path.join(os.tmpdir(), 'nes-external-library-'));
    const romFile = path.join(external, 'roms', name + '.nes');
    const coverFile = path.join(external, 'screen', name + '.png');
    fs.mkdirSync(path.dirname(romFile), { recursive: true });
    fs.mkdirSync(path.dirname(coverFile), { recursive: true });
    const rom = Buffer.alloc(16 + 16384 + 8192);
    rom.set([0x4e, 0x45, 0x53, 0x1a, 1, 1]);
    fs.writeFileSync(romFile, rom);
    fs.copyFileSync(path.resolve(__dirname, '../packaging/fnos/ICON.PNG'), coverFile);
    let log = '';
    const server = spawn(process.execPath, [path.join(root, 'server/index.js'), '--port', String(port)],
        { stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env,
            NES_ROM_DIR: path.dirname(romFile), NES_SCREEN_DIR: path.dirname(coverFile) } });
    server.stdout.on('data', chunk => { log += chunk; });
    server.stderr.on('data', chunk => { log += chunk; });
    const base = 'http://127.0.0.1:' + port;
    try {
        let ready = false;
        for (let attempt = 0; attempt < 100; attempt++) {
            if (server.exitCode !== null) throw new Error('Server exited: ' + log);
            try {
                const response = await fetch(base + '/api/games/', { signal: AbortSignal.timeout(1000) });
                if (response.ok) { ready = true; break; }
            } catch (_) { /* Retry while the child is starting. */ }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        assert.ok(ready, 'Server did not become ready: ' + log);
        const games = await (await fetch(base + '/api/games/')).json();
        assert.ok(games.some(game => game.name === name));
        const added = path.join(path.dirname(romFile), name + '-added.nes');
        fs.writeFileSync(added, rom);
        try {
            const reloaded = await (await fetch(base + '/api/games/reload', { method: 'POST' })).json();
            assert.ok(reloaded.some(game => game.name === name + '-added'));
            const again = await (await fetch(base + '/api/games/reload', { method: 'POST' })).json();
            assert.equal(again.filter(game => game.name === name + '-added').length, 1);
        } finally { fs.unlinkSync(added); }
        const removed = await (await fetch(base + '/api/games/reload', { method: 'POST' })).json();
        assert.ok(!removed.some(game => game.name === name + '-added'));
        assert.equal((await fetch(base + '/api/games/reload', {
            method: 'POST', headers: { Origin: 'https://other.example' }
        })).status, 403);
        for (const route of ['/', '/settings', '/settings/controller', '/settings/language', '/' + name]) {
            const response = await fetch(base + route);
            assert.equal(response.status, 200, route);
            assert.match(await response.text(), /System\.import\('main'\)/);
        }
        for (const route of ['/assets/app.js', '/assets/app.css', '/app.manifest',
            '/cdn/tsnes/dist/nes.js', '/roms/' + name + '.nes', '/screen/' + name + '.png']) {
            assert.equal((await fetch(base + route)).status, 200, route);
        }
        await new Promise((resolve, reject) => {
            const socket = new WS('ws://127.0.0.1:' + port + '/.socket/');
            const timeout = setTimeout(() => { socket.terminate(); reject(new Error('WebSocket timeout')); }, 5000);
            socket.on('open', () => socket.close());
            socket.on('close', () => { clearTimeout(timeout); resolve(); });
            socket.on('error', error => { clearTimeout(timeout); reject(error); });
        });
        if (process.argv.includes('--browser')) await require('./smoke-browser')(base, name);
        console.log('Source build smoke test passed: routes, ROMs, covers, core, WebSocket');
    } finally {
        server.kill('SIGTERM');
        if (server.exitCode === null) await once(server, 'exit');
        for (const file of [romFile, coverFile]) fs.unlinkSync(file);
        for (const directory of [path.dirname(romFile), path.dirname(coverFile), external]) {
            try { fs.rmdirSync(directory); } catch (_) { /* Keep any pre-existing data. */ }
        }
    }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
