// Build the legacy Angular/SystemJS app on Node 24 without Gulp or node-sass.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');
const root = path.resolve(__dirname, '..');
const toolRequire = createRequire(path.join(root, 'build-tools/package.json'));
const ts = toolRequire('typescript');
const sass = toolRequire('sass');
const { minify } = toolRequire('terser');
const clientSource = path.join(root, 'src/client');
const clientOut = path.join(root, 'dist/client');
const serverOut = path.join(root, 'dist/server');

function files(directory, extension) {
    return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
        .flatMap(item => item.isDirectory() ? files(path.join(directory, item.name), extension) :
            item.name.endsWith(extension) ? [path.join(directory, item.name)] : []);
}
function write(file, content) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
}
function compile(file, moduleName) {
    let source = fs.readFileSync(file, 'utf8');
    if (moduleName) {
        source = source.replace(/templateUrl:\s*'([^']+)'/g, (_, name) =>
            'template: ' + JSON.stringify(fs.readFileSync(path.join(path.dirname(file), name), 'utf8')));
        source = source.replace(/styleUrls:\s*\[([^\]]+)\]/g, (_, names) => 'styles: ' +
            JSON.stringify(Array.from(names.matchAll(/'([^']+)'/g), match =>
                fs.readFileSync(path.join(path.dirname(file), match[1]), 'utf8'))));
    }
    const result = ts.transpileModule(source, {
        fileName: file, moduleName,
        compilerOptions: { target: ts.ScriptTarget.ES2015,
            module: moduleName ? ts.ModuleKind.System : ts.ModuleKind.CommonJS,
            experimentalDecorators: true, emitDecoratorMetadata: !!moduleName },
        reportDiagnostics: true
    });
    if (result.diagnostics.length) throw new Error('TypeScript syntax error: ' + file);
    if (!moduleName) return result.outputText;
    return result.outputText.replace(/(System\.register\("[^"\n]+",\s*)(\[[^\]]*\])/, (_, prefix, dependencies) =>
        prefix + JSON.stringify(JSON.parse(dependencies).map(name => name.startsWith('.') ?
            path.posix.normalize(path.posix.join(path.posix.dirname(moduleName), name)) : name)));
}
async function download(url, destination) {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
            if (!response.ok) throw new Error('HTTP ' + response.status + ': ' + url);
            write(destination, Buffer.from(await response.arrayBuffer()));
            return;
        } catch (error) {
            if (attempt === 2) throw error;
        }
    }
}
function icons() {
    const directory = path.join(clientSource, 'assets/icons');
    return fs.readdirSync(directory).filter(name => name.endsWith('.svg')).sort().map(name => {
        let svg = fs.readFileSync(path.join(directory, name), 'utf8');
        const symbols = new Set();
        svg = svg.replace(/href="(symbol\/[^"#]+\.svg)#([^"#]+)"/g, (_, file, id) => {
            const symbol = fs.readFileSync(path.join(directory, file), 'utf8').match(/<symbol[\s\S]*<\/symbol>/);
            if (!symbol) throw new Error('Missing SVG symbol: ' + file);
            symbols.add(symbol[0]);
            return 'href="#' + id + '"';
        });
        svg = svg.replace('</svg>', [...symbols].join('') + '</svg>');
        const selected = name.match(/^(.+)\((.+)\)\.svg$/);
        const selector = selected ? selected[2] + ' i.icon-' + selected[1] : 'i.icon-' + name.slice(0, -4);
        return selector + "{background-image:url('data:image/svg+xml;charset=utf-8," +
            encodeURIComponent(svg).replace(/'/g, '%27') + "')}";
    }).join('\n');
}

async function main() {
    const runtime = path.join(root, 'build-tools/runtime');
    const manifest = require(path.join(root, 'package.json'));
    const runtimeManifest = require(path.join(runtime, 'package.json'));
    if (JSON.stringify(manifest.dependencies) !== JSON.stringify(runtimeManifest.dependencies)) {
        throw new Error('Sync build-tools/runtime/package.json with package.json dependencies');
    }
    if (!fs.existsSync(path.join(runtime, 'node_modules'))) throw new Error('Install build-tools/runtime dependencies first');
    // Remove only generated client/server trees, preserving existing FPK outputs.
    for (const directory of [clientOut, serverOut]) fs.rmSync(directory, { force: true, recursive: true });
    let bundle = files(clientSource, '.ts').filter(file => !file.endsWith('.d.ts')).map(file => {
        const name = path.relative(clientSource, file).replace(/\\/g, '/').slice(0, -3);
        return compile(file, name);
    }).join('\n');
    const minimized = await minify(bundle, { ecma: 2015 });
    write(path.join(clientOut, 'assets/app.js'), minimized.code);
    const styles = fs.readdirSync(path.join(clientSource, 'assets/scss')).filter(name => name.endsWith('.scss')).sort()
        .map(name => sass.compile(path.join(clientSource, 'assets/scss', name), { style: 'compressed', logger: sass.Logger.silent }).css);
    write(path.join(clientOut, 'assets/app.css'), styles.join('\n') + '\n' + icons());
    const library = JSON.parse(fs.readFileSync(path.join(clientSource, 'library.json'), 'utf8'));
    const map = {};
    const downloads = [...library.link, ...library.system];
    // Limit concurrent requests to avoid CDN rate limits on clean runners.
    for (let offset = 0; offset < downloads.length; offset += 4) {
        await Promise.all(downloads.slice(offset, offset + 4).map(file =>
            download(library.base + file, path.join(clientOut, 'cdn', file))));
    }
    // Use the same HTML parser as the browser's Angular JIT compiler.
    const angularCompiler = require(path.join(clientOut, 'cdn/@angular/compiler@5.0.0/bundles/compiler.umd.min.js'));
    for (const template of files(clientSource, '.html')) {
        const errors = new angularCompiler.HtmlParser().parse(fs.readFileSync(template, 'utf8'), template).errors;
        if (errors.length) throw new Error(errors.map(error => error.toString()).join('\n'));
    }
    for (const file of library.system) map[file.slice(0, file.indexOf('@', 1))] = 'cdn/' + file;
    for (const file of library.node_modules.system) {
        if (!file.startsWith('tsnes/')) throw new Error('Unsupported local browser dependency: ' + file);
        fs.mkdirSync(path.dirname(path.join(clientOut, 'cdn', file)), { recursive: true });
        fs.copyFileSync(path.join(root, 'vendor', file), path.join(clientOut, 'cdn', file));
        map.tsnes = 'cdn/' + file;
    }
    let html = fs.readFileSync(path.join(clientSource, 'index.html'), 'utf8');
    html = html.replace('<html lang="en">', '<html lang="en" manifest="app.manifest">');
    html = html.replace('<!-- icons -->', '<link rel="icon" type="image/png" href="assets/favicon.png">');
    html = html.replace('<!-- styles -->', library.link.filter(file => file.endsWith('.css'))
        .concat('assets/app.css').map(file => '<link rel="stylesheet" href="' + (file.startsWith('assets/') ? file : 'cdn/' + file) + '">').join('\n'));
    html = html.replace('<!-- scripts -->', library.link.filter(file => file.endsWith('.js'))
        .map(file => '<script src="cdn/' + file + '"></script>').join('\n') +
        '\n<script src="assets/app.js"></script>\n<script>System.config(' + JSON.stringify({ paths: { 'cdn/': 'cdn/' }, map }) + ');</script>');
    write(path.join(clientOut, 'index.html'), html);
    fs.copyFileSync(path.join(root, 'packaging/fnos/ICON.PNG'), path.join(clientOut, 'assets/favicon.png'));
    const cacheFiles = files(clientOut, '').map(file => path.relative(clientOut, file).replace(/\\/g, '/')).sort();
    const hash = crypto.createHash('sha256');
    for (const file of cacheFiles) hash.update(file).update(fs.readFileSync(path.join(clientOut, file)));
    write(path.join(clientOut, 'app.manifest'), 'CACHE MANIFEST\n# build: ' + hash.digest('hex') + '\n\nCACHE:\n' + cacheFiles.join('\n') + '\n\nNETWORK:\n*\n');
    for (const file of files(path.join(root, 'src/server'), '.ts')) {
        const relative = path.relative(path.join(root, 'src/server'), file).replace(/\.ts$/, '.js');
        write(path.join(serverOut, relative), compile(file));
    }
    for (const name of ['client', 'database']) write(path.join(serverOut, 'config', name + '.json'), '{}\n');
    fs.cpSync(path.join(runtime, 'node_modules'), path.join(serverOut, 'node_modules'), { recursive: true });
    fs.copyFileSync(path.join(runtime, 'package.json'), path.join(serverOut, 'package.json'));
    console.log('Built dist/client and dist/server from source');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
