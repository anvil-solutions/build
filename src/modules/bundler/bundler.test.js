import { describe, expect, it } from 'vitest';
import { BUILD_OPTIONS } from '../shared/test-utils.js';
import { Bundler } from './bundler.js';

describe('bundling', () => {
  it('should get entry points', async () => {
    const bundler = new Bundler(BUILD_OPTIONS);
    const entryPoints = await bundler.getEntryPoints(['./README.md']);

    expect(entryPoints.length).toBe(0);
  });

  it('should bundle', async () => {
    const bundler = new Bundler(BUILD_OPTIONS);
    await bundler.bundle([]);
  });
});
