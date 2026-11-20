// Inkweight web prototype build. No dependencies: plain Node 22.
//
//   node build/build.mjs
//
// Reads app/page.html (markup), app/style.css, the ES modules under app/ and
// the unchanged core under core/, inlines ../Shared/ink_tuning.json and writes
//   dist/inkweight.html           complete standalone page
//   dist/inkweight.artifact.html  the same page as a fragment (no doctype,
//                                 html, head or body tags)
//
// The bundler is deliberately tiny. It understands exactly the module syntax
// used by the core and the app:
//   import { a, b as c } from './x.js';     import * as ns from './x.js';
//   export function f() {}   export async function f() {}
//   export const X = ...;    export * from './x.js';
// Anything else that starts with import or export stops the build.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENTRY = resolve(ROOT, 'app/main.js');
const TUNING = resolve(ROOT, '../Shared/ink_tuning.json');

const modules = new Map(); // absolute path -> transformed code
const order = [];

function idOf(abs) { return relative(ROOT, abs).split('\\').join('/'); }

function addModule(abs) {
  if (modules.has(abs)) return;
  modules.set(abs, null);
  let src = readFileSync(abs, 'utf8');
  const exported = [];
  const deps = [];
  const dep = (spec) => {
    if (!spec.startsWith('.')) throw new Error('only relative imports are allowed: ' + spec + ' in ' + idOf(abs));
    const target = resolve(dirname(abs), spec);
    deps.push(target);
    return idOf(target);
  };
  // import * as ns from '...'
  src = src.replace(/^import\s*\*\s*as\s+([A-Za-z_$][\w$]*)\s+from\s+['"]([^'"]+)['"];?/gm,
    (m, ns, spec) => 'const ' + ns + ' = __req(' + JSON.stringify(dep(spec)) + ');');
  // import { a, b as c } from '...'
  src = src.replace(/^import\s*\{([^}]*)\}\s*from\s+['"]([^'"]+)['"];?/gm,
    (m, names, spec) => {
      const list = names.split(',').map((s) => s.trim()).filter(Boolean)
        .map((s) => s.replace(/^([\w$]+)\s+as\s+([\w$]+)$/, '$1: $2'));
      return 'const { ' + list.join(', ') + ' } = __req(' + JSON.stringify(dep(spec)) + ');';
    });
  // export * from '...'
  src = src.replace(/^export\s*\*\s*from\s+['"]([^'"]+)['"];?/gm,
    (m, spec) => 'Object.assign(__exp, __req(' + JSON.stringify(dep(spec)) + '));');
  // export function / export async function
  src = src.replace(/^export\s+(async\s+function|function)\s+([A-Za-z_$][\w$]*)/gm,
    (m, kw, name) => { exported.push(name); return kw + ' ' + name; });
  // export const
  src = src.replace(/^export\s+const\s+([A-Za-z_$][\w$]*)/gm,
    (m, name) => { exported.push(name); return 'const ' + name; });
  const left = src.match(/^(import|export)\b.*$/m);
  if (left) throw new Error('unsupported module syntax in ' + idOf(abs) + ': ' + left[0]);
  if (src.includes('</script')) throw new Error('script end tag inside ' + idOf(abs));
  const tail = exported.map((n) => '__exp.' + n + ' = ' + n + ';').join('\n');
  for (const d of deps) addModule(d);
  modules.set(abs, src + '\n' + tail + '\n');
  order.push(abs);
}

addModule(ENTRY);

const tuning = JSON.parse(readFileSync(TUNING, 'utf8'));
let js = '(function () {\n\'use strict\';\n';
js += 'var __INK_TUNING__ = ' + JSON.stringify(tuning) + ';\n';
js += 'var __mods = {}, __cache = {};\n';
js += 'function __req(id) { var e = __cache[id]; if (e) return e; e = __cache[id] = {}; __mods[id](e); return e; }\n';
for (const abs of order) {
  js += '\n// ---- ' + idOf(abs) + '\n__mods[' + JSON.stringify(idOf(abs)) + '] = function (__exp) {\n' + modules.get(abs) + '};\n';
}
js += '\n__req(' + JSON.stringify(idOf(ENTRY)) + ');\n})();\n';

const css = readFileSync(resolve(ROOT, 'app/style.css'), 'utf8');
const markup = readFileSync(resolve(ROOT, 'app/page.html'), 'utf8');
for (const tag of ['<!doctype', '<html', '<head', '<body']) {
  if (markup.toLowerCase().includes(tag)) throw new Error('app/page.html must not contain ' + tag);
}

const fragment = '<title>Inkweight</title>\n'
  + '<meta name="claude:viewport-fit-sides" content="cover">\n'
  + '<style>\n' + css + '</style>\n'
  + markup + '\n<script>\n' + js + '</script>\n';

const standalone = '<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
  + '<title>Inkweight</title>\n'
  + '<style>\n' + css + '</style>\n</head>\n<body>\n'
  + markup + '\n<script>\n' + js + '</script>\n</body>\n</html>\n';

// page-rule checks on the fragment
const problems = [];
if (!fragment.startsWith('<title>Inkweight</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<style>')) problems.push('fragment head order');
for (const tag of ['<!doctype', '<html', '<head', '<body']) if (fragment.toLowerCase().includes(tag)) problems.push('fragment contains ' + tag);
for (const re of [/\bsrc\s*=\s*["']?https?:/i, /url\(\s*["']?https?:/i, /@import/i, /\bfetch\s*\(/, /XMLHttpRequest/, /\b100vh\b/, /\balert\s*\(/, /\bconfirm\s*\(/, /\bprompt\s*\(/]) {
  if (re.test(fragment)) problems.push('forbidden pattern ' + re);
}
// literal colours are only allowed inside the :root token block
const cssNoRoot = css.replace(/:root\s*\{[^}]*\}/g, '');
const lit = cssNoRoot.match(/#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(/g);
if (lit) problems.push('literal colours outside :root: ' + lit.slice(0, 5).join(' '));
if (problems.length) throw new Error('page rules: ' + problems.join('; '));

mkdirSync(resolve(ROOT, 'dist'), { recursive: true });
writeFileSync(resolve(ROOT, 'dist/inkweight.html'), standalone);
writeFileSync(resolve(ROOT, 'dist/inkweight.artifact.html'), fragment);
console.log('BUILD OK modules=' + order.length
  + ' inkweight.html=' + Buffer.byteLength(standalone) + 'B'
  + ' inkweight.artifact.html=' + Buffer.byteLength(fragment) + 'B');
