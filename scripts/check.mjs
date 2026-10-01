// Pre-push check: node scripts/check.mjs
// No dependencies. Catches the mistakes that would break the live game.
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = file => readFileSync(join(root, file), 'utf8');
const problems = [];

// 1. app.js parses.
try { execFileSync(process.execPath, ['--check', join(root, 'app.js')], { stdio: 'pipe' }); }
catch (error) { problems.push(`app.js has a syntax error:\n${error.stderr}`); }

// 2. No leftover merge conflict markers.
for (const file of ['index.html', 'app.js', 'styles.css']) {
  if (/^(<{7}|={7}|>{7})( |$)/m.test(read(file))) problems.push(`${file} contains merge conflict markers`);
}

// 3. Every local file index.html loads exists, and every id app.js looks up is in the page.
const html = read('index.html'), js = read('app.js');
for (const [, ref] of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (!/^(https?:|data:|\.\/?$)/.test(ref) && !existsSync(join(root, ref))) problems.push(`index.html references missing file: ${ref}`);
}
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
for (const [, id] of js.matchAll(/\$\('([^']+)'\)/g)) {
  if (!ids.has(id)) problems.push(`app.js uses $('${id}') but index.html has no element with that id`);
}

// 4. The question bank is well formed.
const bankSource = js.match(/const bank = (\[[\s\S]*?\n\]);/);
let bank;
try { bank = Function(`return ${bankSource[1]}`)(); }
catch { problems.push('could not read `const bank = [...]` in app.js'); }
if (bank) {
  const seen = new Set();
  bank.forEach((item, i) => {
    const where = `question ${i + 1} (“${String(item.q).slice(0, 40)}…”)`;
    if (![0, 1, 2].includes(item.level)) problems.push(`${where}: level must be 0, 1 or 2`);
    if (!item.category || !item.q || !item.f) problems.push(`${where}: needs category, q and f`);
    if (!Array.isArray(item.a) || item.a.length !== 4 || new Set(item.a).size !== 4) problems.push(`${where}: needs exactly 4 different answers`);
    if (!Number.isInteger(item.c) || item.c < 0 || item.c > 3) problems.push(`${where}: c must be the index (0–3) of the right answer`);
    if (seen.has(item.q)) problems.push(`${where}: duplicate question`);
    seen.add(item.q);
  });
  for (const level of [0, 1, 2]) {
    const count = bank.filter(item => item.level === level).length;
    if (count < 4) problems.push(`level ${level} has ${count} questions; a game needs at least 4`);
  }
}

if (problems.length) {
  console.error(`check failed:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('check passed');
