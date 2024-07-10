import { describe, expect, it, vi } from 'vitest';
import { readFile, unlink } from 'node:fs/promises';
import { BUILD_OPTIONS } from '../shared/test-utils.js';
import { Cleaner } from './cleaner.js';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(() => Promise.resolve(Buffer.from(''))),
  unlink: vi.fn(() => Promise.resolve())
}));

describe('cleaning', () => {
  it('should clean up', async () => {
    const cleaner = new Cleaner(BUILD_OPTIONS);
    await cleaner.cleanUp(['./README.md', './src/index.js']);

    expect(readFile).toHaveBeenCalled();
    expect(unlink).toHaveBeenCalled();
  });
});
