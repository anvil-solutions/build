/**
 * @import {BuildOptions} from './modules/shared/types'
 * @import {InternalBuildOptions} from './modules/shared/types'
 * @import {Logger} from 'pino'
 */

import { Builder } from './modules/builder/builder.js';
import { Bundler } from './modules/bundler/bundler.js';
import { Cleaner } from './modules/cleaner/cleaner.js';
import { pino } from 'pino';

const DEFAULT_LOGGER = pino({
  transport: {
    target: 'pino-pretty'
  }
});

const DEFAULT_VERSION = Math.floor(Date.now() / 1000).toString();

/** @type {InternalBuildOptions} */
export const DEFAULT_BUILD_OPTIONS = {
  bundler: {
    entryDocumentExtensions: [
      '.html',
      '.php'
    ],
    external: [
      '*.jpeg',
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
      '.map',
      '.png',
      '.svg',
      '.webp',
      '.woff2'
    ],
    searchableExtensions: [
      '.css',
      '.html',
      '.js',
      '.json',
      '.md',
      '.php'
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
  ignoreList: [],
  keepList: [],
  thirdPartyModules: [
    'node_modules/',
    'vendor/'
  ],
  version: DEFAULT_VERSION
};

/**
 * @param {BuildOptions} options
 * @param {Logger | null} logger
 * @returns {Promise<void>}
 */
export async function build(options, logger = DEFAULT_LOGGER) {
  const buildOptions = { ...DEFAULT_BUILD_OPTIONS, ...options };

  const builder = new Builder(buildOptions);
  logger?.info('Emptying the ouput directory.');
  await builder.emptyOutDirectory();
  logger?.info('Querying directories and files.');
  const [directories, files] = await builder.getDirectoriesAndFiles();
  logger?.info('Creating the directory structure.');
  await builder.createDirectoryStructure(directories);
  logger?.info('Copying files.');
  await builder.copyFiles(files);

  const bundler = new Bundler(buildOptions);
  logger?.info('Querying entry points.');
  const entryPoints = await bundler.getEntryPoints(files);
  logger?.info('Bundling.');
  await bundler.bundle(entryPoints);

  logger?.info('Cleaning up.');
  await new Cleaner(buildOptions).cleanUp();
}
