const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

test('reload replaces the catalog, removes deleted games, ignores directories, and preserves last good scan', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nes-library-'));
    const roms = path.join(root, 'roms');
    fs.mkdirSync(roms);
    const exports = {};
    const source = ts.transpileModule(fs.readFileSync(path.resolve(__dirname, '../src/server/app/game/game.service.ts'), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2015 }
    }).outputText;
    vm.runInNewContext(source, { exports, require, __dirname, process: {
        env: { NES_ROM_DIR: roms, NES_SCREEN_DIR: root }
    } });
    const service = new exports.default({ info: () => {} });
    const games = () => JSON.parse(JSON.stringify(service.games));
    try {
        fs.writeFileSync(path.join(roms, 'A game.nes'), 'rom');
        fs.mkdirSync(path.join(roms, 'not-a-game.nes'));
        fs.writeFileSync(path.join(roms, 'singleplayer.txt'), 'A game\n');
        await Promise.all([service.scan(), service.scan()]);
        assert.deepEqual(games(), [{ name: 'A game', multiplayer: false }]);
        await service.scan();
        assert.equal(service.games.length, 1);
        fs.unlinkSync(path.join(roms, 'A game.nes'));
        await service.scan();
        assert.deepEqual(games(), []);
        fs.writeFileSync(path.join(roms, 'New.nes'), 'rom');
        await service.scan();
        fs.renameSync(roms, path.join(root, 'moved'));
        await assert.rejects(service.scan(), /ENOENT/);
        assert.deepEqual(games(), [{ name: 'New', multiplayer: true }]);
        fs.renameSync(path.join(root, 'moved'), roms);
        await service.scan();
        assert.equal(service.games.length, 1);
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
