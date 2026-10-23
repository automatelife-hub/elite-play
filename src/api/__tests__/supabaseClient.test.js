import { describe, expect, it } from 'vitest';
import { parseSort } from '../supabaseClient';

describe('parseSort', () => {
  it('returns null for empty / undefined input', () => {
    expect(parseSort('')).toBeNull();
    expect(parseSort(undefined)).toBeNull();
    expect(parseSort(null)).toBeNull();
  });

  it('parses ascending sort', () => {
    expect(parseSort('name')).toEqual({ column: 'name', ascending: true });
  });

  it('parses descending sort with leading "-"', () => {
    expect(parseSort('-rating')).toEqual({ column: 'rating', ascending: false });
  });

  it('only treats a leading "-" as the descending marker', () => {
    expect(parseSort('created-at')).toEqual({ column: 'created-at', ascending: true });
  });

  it('a bare "-" yields an empty column name (current behavior)', () => {
    expect(parseSort('-')).toEqual({ column: '', ascending: false });
  });
});
