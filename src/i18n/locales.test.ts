import { expect, it } from 'vitest';
import en from './locales/en/common.json';
import nl from './locales/nl/common.json';

function keys(value: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, item]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof item === 'object' && item !== null ? keys(item as Record<string, unknown>, path) : [path];
  }).sort();
}
it('provides the same translation keys in Dutch and English', () => {
  expect(keys(en)).toEqual(keys(nl));
});
