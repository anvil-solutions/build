import { BUILD_OPTIONS, exists } from '../shared/test-utilities.js';
import { describe, expect, it } from 'vitest';
import { Builder } from './builder.js';
import path from 'node:path';

describe('building', () => {
  it('should empty the out directory', async () => {
    const builder = new Builder(BUILD_OPTIONS);
    await builder.emptyOutDirectory();

    expect(await exists(BUILD_OPTIONS.outDirectory)).toBe(false);
  });

  it('should get directories and files', async () => {
    const builder = new Builder(BUILD_OPTIONS);
    const [directories, files] = await builder.getDirectoriesAndFiles();

    expect(directories).toContain('src');
    expect(files).toContain('src/index.js');
  });

  it('should create the directory structure', async () => {
    const builder = new Builder(BUILD_OPTIONS);
    await builder.createDirectoryStructure(['test']);

    expect(
      await exists(path.join(BUILD_OPTIONS.outDirectory, 'test'))
    ).toBe(true);
  });

  it('should copy files', async () => {
    const builder = new Builder(BUILD_OPTIONS);
    await builder.copyFiles(['./README.md', './src/index.js']);

    expect(
      await exists(path.join(BUILD_OPTIONS.outDirectory, 'README.md'))
    ).toBe(true);
    expect(
      await exists(path.join(BUILD_OPTIONS.outDirectory, 'src/index.js'))
    ).toBe(true);
  });
});
