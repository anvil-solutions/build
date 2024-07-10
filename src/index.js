import { Builder } from './modules/builder/builder.js';
import { Bundler } from './modules/bundler/bundler.js';
import { Cleaner } from './modules/cleaner/cleaner.js';

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
      js: `/* ${Date.now().toString()} */`
    },
    format: 'esm',
    minify: true
  },
  thirdPartyModules: [
    'libs/',
    'node_modules/'
  ]
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

  await new Cleaner(buildOptions).cleanUp(files);
}