import { describe, expect, it, vi } from 'vitest';
import { readFile, readdir, unlink } from 'node:fs/promises';
import { BUILD_OPTIONS } from '../shared/test-utilities.js';
import { Cleaner } from './cleaner.js';

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(() => Promise.resolve(Buffer.from(''))),
  readdir: vi.fn(() => Promise.resolve([
    {
      isDirectory: () => false,
      isFile: () => true,
      name: '.js',
      parentPath: ''
    }
  ])),
  unlink: vi.fn(() => Promise.resolve())
}));

describe('cleaning', () => {
  it('should clean up', async () => {
    const cleaner = new Cleaner(BUILD_OPTIONS);
    await cleaner.cleanUp();

    expect(readdir).toHaveBeenCalled();
    expect(readFile).toHaveBeenCalled();
    expect(unlink).toHaveBeenCalled();
  });
});
