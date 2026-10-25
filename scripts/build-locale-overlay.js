// Recompile selected modules against a working legacy SystemJS bundle.
// Usage: node scripts/build-locale-overlay.js existing-app.js output-app.js [module ...]
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) throw new Error('Provide input and output app.js paths');
const root = path.resolve(__dirname, '..');
let bundle = fs.readFileSync(input, 'utf8');
const modules = process.argv.length > 4 ? process.argv.slice(4) :
    ['app/translate/lang-zh', 'app/translate/translations', 'app/settings/language/language.component'];
const parsed = ts.createSourceFile('app.js', bundle, ts.ScriptTarget.Latest, true);
const registrations = {};
function visit(node) {
    if (ts.isCallExpression(node) && node.expression.getText(parsed) === 'System.register'
        && node.arguments.length && ts.isStringLiteral(node.arguments[0])) {
        const name = node.arguments[0].text;
        if (registrations[name]) throw new Error('Duplicate module: ' + name);
        registrations[name] = { start: node.getStart(parsed), end: node.end };
    }
    ts.forEachChild(node, visit);
}
visit(parsed);
const replacements = [];
const additions = [];
for (const name of modules) {
    let source = fs.readFileSync(path.join(root, 'src/client', name + '.ts'), 'utf8');
    source = source.replace(/templateUrl:\s*'([^']+)'/, (_, relative) =>
        'template: ' + JSON.stringify(fs.readFileSync(path.join(root, 'src/client', path.dirname(name), relative), 'utf8')));
    source = source.replace(/styleUrls:\s*\[([^\]]+)\]/, (_, files) => {
        const styles = files.match(/'([^']+)'/g).map(file => fs.readFileSync(
            path.join(root, 'src/client', path.dirname(name), file.slice(1, -1)), 'utf8'));
        return 'styles: ' + JSON.stringify(styles);
    });
    const compiled = ts.transpileModule(source, {
        moduleName: name,
        compilerOptions: { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.System,
            experimentalDecorators: true, emitDecoratorMetadata: true },
        reportDiagnostics: true
    });
    if (compiled.diagnostics.length) throw new Error(ts.formatDiagnostics(compiled.diagnostics, {
        getCanonicalFileName: x => x, getCurrentDirectory: () => root, getNewLine: () => '\n'
    }));
    // Bundled named modules use canonical names without file extensions.
    let code = compiled.outputText.replace(/"(\.\.?\/[^"\n]+)"/g,
        (_, dependency) => JSON.stringify(path.posix.normalize(path.posix.join(path.posix.dirname(name), dependency))));
    const registrationStart = code.indexOf('System.register(');
    if (registrationStart < 0) throw new Error('No registration emitted for ' + name);
    const helpers = code.slice(0, registrationStart);
    if (helpers) additions.push(helpers);
    code = code.slice(registrationStart).trim().replace(/;$/, '');
    if (registrations[name]) replacements.push({ ...registrations[name], code });
    else if (name === 'app/translate/lang-zh') additions.push(code + ';\n');
    else throw new Error('Expected existing module: ' + name);
}
for (const edit of replacements.sort((a, b) => b.start - a.start)) {
    bundle = bundle.slice(0, edit.start) + edit.code + bundle.slice(edit.end);
}
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
fs.writeFileSync(output, additions.join('\n') + bundle);
console.log('Compiled ' + modules.join(', ') + ' into ' + output);
