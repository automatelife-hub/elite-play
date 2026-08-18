import { test } from 'node:test';
import assert from 'node:assert';
import { createPageUrl } from './index.ts';

test('createPageUrl basic functionality', () => {
    assert.strictEqual(createPageUrl('Home'), '/home');
    assert.strictEqual(createPageUrl('Home Page'), '/home-page');
    assert.strictEqual(createPageUrl('AboutUs'), '/aboutus');
});

test('createPageUrl handles multiple spaces and special characters', () => {
    assert.strictEqual(createPageUrl('Poker & Casino'), '/poker-casino');
    assert.strictEqual(createPageUrl('Page   Multiple   Spaces'), '/page-multiple-spaces');
    assert.strictEqual(createPageUrl('!@#$ Name'), '/name');
    assert.strictEqual(createPageUrl('Trailing space '), '/trailing-space');
});

test('createPageUrl handles non-alphanumeric sequences', () => {
    assert.strictEqual(createPageUrl('test---slug'), '/test-slug');
    assert.strictEqual(createPageUrl('hello.world'), '/hello-world');
});
