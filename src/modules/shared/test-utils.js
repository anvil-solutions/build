/**
 * @import {FullBuildOptions} from '../shared/types'
 */

import { DEFAULT_BUILD_OPTIONS } from '../../index.js';
import { stat } from 'node:fs/promises';

/** @type {FullBuildOptions} */
export const BUILD_OPTIONS = {
  ...DEFAULT_BUILD_OPTIONS,
  builder: {
    keepList: ['index.js']
  },
  directories: ['src'],
  ignoreList: ['.test.js'],
  outDirectory: 'out',
  rootDirectory: 'src'
};

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
export async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}
