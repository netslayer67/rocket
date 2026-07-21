import assert from 'node:assert/strict';
import { lineCount } from './check-file-length.mjs';

assert.equal(lineCount('one\ntwo\n'), 2);
assert.equal(lineCount(''), 0);
assert.equal(lineCount(Array(201).fill('line').join('\n')), 201);
