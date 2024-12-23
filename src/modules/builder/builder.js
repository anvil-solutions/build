/**
 * @import {Dirent} from 'node:fs'
 * @import {FullBuildOptions} from '../shared/types'
 */

import { copyFile, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import path from 'node:path';

export class Builder {
  /** @type {FullBuildOptions} */
  #options;

  /**
   * @param {FullBuildOptions} options
   */
  constructor(options) {
    this.#options = options;
  }

  /**
   * @returns {Promise<void>}
   */
  async emptyOutDirectory() {
    await rm(this.#options.outDirectory, { force: true, recursive: true });
  }

  /**
   * @param {Dirent} directoryEntry
   * @returns {boolean}
   */
  #shouldIgnore(directoryEntry) {
    for (
      const entry of this.#options.ignoreList
    ) if (
      path.join(directoryEntry.parentPath, directoryEntry.name).includes(entry)
    ) return true;
    return false;
  }

  /**
   * @param {string} file
   * @returns {boolean}
   */
  #shouldKeep(file) {
    return this.#options.keepList.some(
      entry => file.includes(entry)
    );
  }

  /**
   * @param {string} file
   * @returns {boolean}
   */
  #isThirdParty(file) {
    return this.#options.thirdPartyModules.some(
      entry => file.includes(entry)
    );
  }

  /**
   * @returns {Promise<[string[], string[]]>}
   */
  async getDirectoriesAndFiles() {
    const readData = await Promise.all(
      this.#options.directories.map(
        directory => readdir(
          directory,
          { recursive: true, withFileTypes: true }
        )
      )
    );

    const directoryEntries = readData.flat();
    const directories = directoryEntries
      .filter(entry => entry.isDirectory() && !this.#shouldIgnore(entry))
      .map(entry => path.join(entry.parentPath, entry.name));
    const files = directoryEntries
      .filter(entry => entry.isFile() && !this.#shouldIgnore(entry))
      .map(entry => path.join(entry.parentPath, entry.name));

    return [[...this.#options.directories, ...directories], files];
  }

  /**
   * @param {string[]} directories
   * @returns {Promise<void>}
   */
  async createDirectoryStructure(directories) {
    await Promise.all(
      directories.map(
        directory => mkdir(
          path.join(this.#options.outDirectory, directory), { recursive: true }
        )
      )
    );
  }

  /**
   * @param {string[]} files
   * @returns {Promise<void>}
   */
  async copyFiles(files) {
    /** @type {Promise<unknown>[]} */
    const promises = [];

    for (const file of files) if (
      ![
        '.css',
        '.cjs',
        '.cts',
        '.js',
        '.jsx',
        '.mjs',
        '.mts',
        '.ts',
        '.tsx'
      ].some(
        extension => file.endsWith(extension)
      ) || this.#isThirdParty(file) && this.#shouldKeep(file)
    ) promises.push(
      copyFile(file, path.join(this.#options.outDirectory, file))
    );
    else if (this.#shouldKeep(file)) promises.push(
      build({
        ...this.#options.commonEsbuildOptions,
        entryPoints: [file],
        outfile: path.join(this.#options.outDirectory, file)
      })
    );

    promises.push(
      writeFile(
        path.join(this.#options.outDirectory, 'VERSION'), this.#options.version
      )
    );

    await Promise.all(promises);
  }
}
