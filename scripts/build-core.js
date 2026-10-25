// Assemble a self-contained AMD/CommonJS facade; WASM always lives beside it.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const crypto = require('node:crypto');
const manifestFile = path.join(root, 'vendor/fceumm/core-manifest.json');
const binaries = ['vendor/fceumm/fceumm_libretro.js', 'vendor/tsnes/dist/fceumm_libretro.wasm'];
const hashes = Object.fromEntries(binaries.map(file => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]));
if (process.argv.includes('--update-hashes')) fs.writeFileSync(manifestFile, JSON.stringify({ version: '0.13.2+nes-web.1', sha256: hashes }, null, 2) + '\n');
const expected = JSON.parse(fs.readFileSync(manifestFile, 'utf8')).sha256;
for (const file of binaries) if (expected[file] !== hashes[file]) throw Error('Core checksum mismatch: ' + file);
let glue = fs.readFileSync(path.join(root, 'vendor/fceumm/fceumm_libretro.js'), 'utf8');
if (!glue.includes('var ENVIRONMENT_IS_NODE=true;') || !glue.includes('export default create_fceumm;')) throw Error('Unexpected pinned core glue format');
// Use MEMFS in both hosts. The caller supplies wasmBinary; no Node filesystem
// bridge is needed by the core, and the browser must never import Node modules.
// No WASM code or emulation behavior is changed here.
glue = glue.replace('var ENVIRONMENT_IS_NODE=true;', 'var ENVIRONMENT_IS_NODE=false;')
    .replaceAll('import.meta.url', '"memory://fceumm_libretro.js"')
    .replace('export default create_fceumm;', '');
const prefix = `(function(factory) {\nif (typeof module === 'object' && module.exports) factory(require, exports, __dirname);\nelse if (typeof define === 'function' && define.amd) define(['require', 'exports'], function(require, exports) { factory(null, exports, null); });\n})(function(nodeRequire, exports, moduleDirectory) {\n'use strict';\n`;
const legacy = fs.readFileSync(path.join(root, 'vendor/tsnes/legacy/nes.js'), 'utf8');
const legacyFactory = 'const LegacyCore = (function() { const module = { exports: {} }; const exports = module.exports; const require = null;\n' + legacy + '\nreturn module.exports; })();\n';
const adapter = fs.readFileSync(path.join(root, 'vendor/tsnes/src/runtime.js'), 'utf8');
fs.writeFileSync(path.join(root, 'vendor/tsnes/dist/nes.js'), prefix + glue + '\n' + legacyFactory + adapter + '\n});\n');
console.log('Built FCEUmm compatibility facade');
