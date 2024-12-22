/**
 * @import {BuildOptions} from './modules/shared/types'
 * @import {InternalBuildOptions} from './modules/shared/types'
 */

import { Builder } from './modules/builder/builder.js';
import { Bundler } from './modules/bundler/bundler.js';
import { Cleaner } from './modules/cleaner/cleaner.js';

const DEFAULT_VERSION = Math.floor(Date.now() / 1000).toString();

/** @type {InternalBuildOptions} */
export const DEFAULT_BUILD_OPTIONS = {
  builder: {
    minifiableExtensions: [
      '.css',
      '.js'
    ]
  },
  bundler: {
    entryDocumentExtensions: [
      '.html',
      '.php'
    ],
    external: [
      '*.jpg',
      '*.png',
      '*.svg',
      '*.webp',
      '*.woff2'
    ]
  },
  cleaner: {
    deletableExtensions: [
      '.css',
      '.jpeg',
      '.jpg',
      '.js',
      '.json',
      '.png',
      '.svg',
      '.ts'
    ],
    searchableExtensions: [
      '.css',
      '.html',
      '.js',
      '.json',
      '.md',
      '.php',
      '.ts'
    ]
  },
  commonEsbuildOptions: {
    banner: {
      js: `/* ${DEFAULT_VERSION} */`
    },
    chunkNames: '[hash]',
    format: 'esm',
    minify: true
  },
  thirdPartyModules: [
    'node_modules/',
    'vendor/'
  ],
  version: DEFAULT_VERSION
};

/**
 * @param {BuildOptions} options
 * @returns {Promise<void>}
 */
export async function build(options) {
  const buildOptions = { ...DEFAULT_BUILD_OPTIONS, ...options };

  const builder = new Builder(buildOptions);
  await builder.emptyOutDirectory();
  const [folders, files] = await builder.getFoldersAndFiles();
  await builder.createFolderStructure(folders);
  await builder.copyFiles(files);

  const bundler = new Bundler(buildOptions);
  const entryPoints = await bundler.getEntryPoints(files);
  await bundler.bundle(entryPoints);

  await new Cleaner(buildOptions).cleanUp();
}
