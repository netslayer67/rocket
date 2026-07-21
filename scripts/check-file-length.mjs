import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const roots = ['apps', 'scripts'];
const extensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.css']);
const ignored = new Set(['node_modules', '.next', 'dist', 'coverage']);
const violations = [];

if (process.argv[1]?.endsWith('check-file-length.mjs')) await main();

async function main() {
  for (const root of roots) await visit(root);
  if (violations.length) {
    console.error(`Source files may not exceed 200 lines:\n${violations.join('\n')}`);
    process.exitCode = 1;
  }
}

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && !ignored.has(entry.name)) await visit(join(directory, entry.name));
    if (entry.isFile() && extensions.has(extension(entry.name))) await check(join(directory, entry.name));
  }
}

async function check(file) {
  const source = await readFile(file, 'utf8');
  const lines = lineCount(source);
  if (lines > 200) violations.push(`${file}: ${lines}`);
}

export function lineCount(source) {
  return source ? source.replace(/\r?\n$/, '').split(/\r?\n/).length : 0;
}

function extension(file) {
  return file.slice(file.lastIndexOf('.'));
}
