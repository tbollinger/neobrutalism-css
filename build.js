/*
 * Dependency-free build: bundle src CSS into dist, copy + minify the JS.
 * Run with: node build.js
 *
 * Kept intentionally tiny — no PostCSS/esbuild. The "minify" is a conservative
 * whitespace/comment strip, safe for this hand-written source.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const DIST = path.join(__dirname, 'dist');
const DOCS_ASSETS = path.join(__dirname, 'docs', 'assets');

// CSS @import order (mirrors src/index.css, minus the @import lines themselves).
const CSS_FILES = [
    'tokens.css',
    'base.css',
    'card.css',
    'button.css',
    'chip.css',
    'form.css',
    'modal.css',
    'dropdown.css',
];

function read(file) {
    return fs.readFileSync(path.join(SRC, file), 'utf8');
}

function minifyCss(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '') // strip comments
        .replace(/\s+/g, ' ') // collapse whitespace
        .replace(/\s*([{}:;,>])\s*/g, '$1') // tighten around punctuation
        .replace(/;}/g, '}') // drop last semicolon in a block
        .trim();
}

function minifyJs(js) {
    // Conservative: strip block comments + leading-whitespace line comments,
    // then collapse blank lines. NOT a real minifier — keeps it safe & readable.
    return js
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .split('\n')
        .map((line) => line.replace(/^\s*\/\/.*$/, '').trimEnd())
        .filter((line, i, arr) => !(line === '' && arr[i - 1] === ''))
        .join('\n')
        .replace(/\n{2,}/g, '\n')
        .trim();
}

function build() {
    if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

    const banner = '/*! neobrutalism-css — github.com/tbollinger/neobrutalism-css */\n';

    // Bundle CSS.
    const bundled = CSS_FILES.map(read).join('\n');
    fs.writeFileSync(path.join(DIST, 'neobrutalism.css'), banner + bundled);
    fs.writeFileSync(
        path.join(DIST, 'neobrutalism.min.css'),
        banner + minifyCss(bundled)
    );

    // JS helper.
    const js = read('neobrutalism.js');
    fs.writeFileSync(path.join(DIST, 'neobrutalism.js'), js);
    fs.writeFileSync(
        path.join(DIST, 'neobrutalism.min.js'),
        banner + minifyJs(js)
    );

    const sizes = fs.readdirSync(DIST).map((f) => {
        const bytes = fs.statSync(path.join(DIST, f)).size;
        return '  ' + f.padEnd(26) + (bytes / 1024).toFixed(2) + ' KB';
    });
    console.log('[OK] built dist/\n' + sizes.join('\n'));

    // Mirror the minified build into the GitHub Pages showcase. Pages serves
    // /docs as the web root, so it can't reach ../dist — keep a copy here.
    if (!fs.existsSync(DOCS_ASSETS)) fs.mkdirSync(DOCS_ASSETS, { recursive: true });
    for (const f of ['neobrutalism.min.css', 'neobrutalism.min.js']) {
        fs.copyFileSync(path.join(DIST, f), path.join(DOCS_ASSETS, f));
    }
    console.log('[OK] copied min assets -> docs/assets/');
}

build();
