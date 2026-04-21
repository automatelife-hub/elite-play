import { test } from 'node:test';
import assert from 'node:assert';
import { createPageUrl } from './index.ts';

test('createPageUrl handles normal strings', () => {
    assert.strictEqual(createPageUrl('Home'), '/home');
    assert.strictEqual(createPageUrl('About'), '/about');
});

test('createPageUrl handles spaces', () => {
    assert.strictEqual(createPageUrl('About Us'), '/about-us');
});

test('createPageUrl handles multiple spaces', () => {
    assert.strictEqual(createPageUrl('About  Us'), '/about-us');
});

test('createPageUrl handles leading and trailing spaces', () => {
    assert.strictEqual(createPageUrl('  Home  '), '/home');
});

test('createPageUrl handles empty strings', () => {
    assert.strictEqual(createPageUrl(''), '/');
});

test('createPageUrl handles special characters', () => {
    assert.strictEqual(createPageUrl('Contact & Support'), '/contact-support');
});

test('createPageUrl handles special characters at ends', () => {
    assert.strictEqual(createPageUrl('! Home !'), '/home');
});

test('createPageUrl handles uppercase characters', () => {
    assert.strictEqual(createPageUrl('HELP'), '/help');
});
