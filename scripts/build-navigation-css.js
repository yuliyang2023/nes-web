// Repair legacy unescaped SVG data URLs and append shared navigation styles.
const fs = require('fs');
const path = require('path');
const input = process.argv[2];
const output = process.argv[3];
if (!input || !output) throw new Error('Provide input and output CSS paths');
let count = 0;
let css = fs.readFileSync(input, 'utf8').replace(
    /url\((['"])data:image\/svg\+xml;charset=utf-8,([\s\S]*?)\1\)/g,
    (original, quote, svg) => {
        if (svg.charAt(0) !== '<') return original;
        count++;
        return 'url(' + quote + 'data:image/svg+xml;charset=utf-8,' +
            encodeURIComponent(svg).replace(/'/g, '%27') + quote + ')';
    });
css += '\n' + fs.readFileSync(path.join(__dirname, '../src/client/assets/scss/navigation.scss'), 'utf8');
fs.mkdirSync(path.dirname(path.resolve(output)), { recursive: true });
fs.writeFileSync(output, css);
console.log('Encoded ' + count + ' SVG icons into ' + output);
