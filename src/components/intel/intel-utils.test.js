import test from 'node:test';
import assert from 'node:assert';
import { getTrendColor } from './intel-utils.js';

test('getTrendColor should return green for positive trends', () => {
  assert.strictEqual(getTrendColor('+12%'), 'text-mission-secure-green');
  assert.strictEqual(getTrendColor('+0.5%'), 'text-mission-secure-green');
  assert.strictEqual(getTrendColor('+'), 'text-mission-secure-green');
});

test('getTrendColor should return red for negative trends', () => {
  assert.strictEqual(getTrendColor('-5%'), 'text-mission-alert-red');
  assert.strictEqual(getTrendColor('-0.1%'), 'text-mission-alert-red');
  assert.strictEqual(getTrendColor('-'), 'text-mission-alert-red');
});

test('getTrendColor should return cyan for neutral or missing trends', () => {
  assert.strictEqual(getTrendColor('0%'), 'text-intel-cyan');
  assert.strictEqual(getTrendColor('stable'), 'text-intel-cyan');
  assert.strictEqual(getTrendColor(''), 'text-intel-cyan');
  assert.strictEqual(getTrendColor(null), 'text-intel-cyan');
  assert.strictEqual(getTrendColor(undefined), 'text-intel-cyan');
});
