import { test } from 'node:test';
import assert from 'node:assert';
import { generateSecureRandomString } from './secure-random.js';

test('generateSecureRandomString generates string of correct length', () => {
  const length = 10;
  const result = generateSecureRandomString(length);
  assert.strictEqual(result.length, length);
});

test('generateSecureRandomString uses provided character set', () => {
  const length = 100;
  const chars = 'ABC';
  const result = generateSecureRandomString(length, chars);
  for (const char of result) {
    assert.ok(chars.includes(char), `Character ${char} not in ${chars}`);
  }
});

test('generateSecureRandomString produces different strings (basic randomness check)', () => {
  const s1 = generateSecureRandomString(16);
  const s2 = generateSecureRandomString(16);
  assert.notStrictEqual(s1, s2);
});
