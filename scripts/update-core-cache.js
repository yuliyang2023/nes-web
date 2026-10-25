const fs = require('fs');
const crypto = require('crypto');
const root = process.argv[2] || '/client';
const oldPath = 'cdn/tsnes@0.0.2/dist/nes.min.js';
const newPath = 'cdn/tsnes/dist/nes.js';
const hash = crypto.createHash('sha256').update(fs.readFileSync(root + '/' + newPath)).digest('hex');
for (const name of ['index.html', 'app.manifest']) {
    const path = root + '/' + name;
    let content = fs.readFileSync(path, 'utf8').split(oldPath).join(newPath);
    if (name === 'app.manifest') {
        content = content.replace(/^# nes-web (core|app|css) sha256:.*\n?/gm, '');
        content += '\n# nes-web core sha256: ' + hash + '\n';
        const appHash = crypto.createHash('sha256').update(fs.readFileSync(root + '/assets/app.js')).digest('hex');
        content += '# nes-web app sha256: ' + appHash + '\n';
        const cssHash = crypto.createHash('sha256').update(fs.readFileSync(root + '/assets/app.css')).digest('hex');
        content += '# nes-web css sha256: ' + cssHash + '\n';
    }
    fs.writeFileSync(path, content);
}
