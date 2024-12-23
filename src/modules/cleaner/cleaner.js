/**
 * @import {FileInfo} from '../shared/types'
 * @import {FullBuildOptions} from '../shared/types'
 */

import { readFile, readdir, rmdir, unlink } from 'node:fs/promises';
import path from 'node:path';

export class Cleaner {
  /** @type {FullBuildOptions} */
  #options;

  /**
   * @param {FullBuildOptions} options
   */
  constructor(options) {
    this.#options = options;
  }

  /**
   * @returns {Promise<FileInfo[]>}
   */
  async #getFiles() {
    const directoryEntries = await readdir(
      this.#options.outDirectory,
      { recursive: true, withFileTypes: true }
    );

    return await Promise.all(
      directoryEntries
        .filter(entry => entry.isFile())
        .map(entry => path.join(entry.parentPath, entry.name))
        .map(async file => {
          const buffer = await readFile(file);
          return {
            content: buffer.toString(),
            path: file
          };
        })
    );
  }

  /**
   * @returns {Promise<string[]>}
   */
  async #getDirectories() {
    const directoryEntries = await readdir(
      this.#options.outDirectory,
      { recursive: true, withFileTypes: true }
    );

    return await Promise.all(
      directoryEntries
        .filter(entry => entry.isDirectory())
        .map(entry => path.join(entry.parentPath, entry.name))
    );
  }

  /**
   * @param {string} directory
   * @returns {Promise<[string, boolean]>}
   */
  static async #deleteIfEmpty(directory) {
    const contents = await readdir(directory);
    const isEmpty = contents.length === 0;

    if (isEmpty) await rmdir(directory);
    return [directory, isEmpty];
  }

  /**
   * @returns {Promise<void>}
   */
  async #deleteUnusedFiles() {
    const promises = [];
    const allFiles = await this.#getFiles();

    let searchableFiles = allFiles.filter(
      file => this.#options.cleaner.searchableExtensions.some(
        fileType => file.path.toLowerCase().endsWith(fileType.toLowerCase())
      )
    );
    let deletableFiles = allFiles.filter(
      file => this.#options.cleaner.deletableExtensions.some(
        fileType => file.path.toLowerCase().endsWith(fileType.toLowerCase())
      )
    );

    /** @type {FileInfo[]} */
    let targets = [];
    do {
      targets = deletableFiles.filter(
        potentialTarget => searchableFiles.every(
          file => !file.content.includes(
            potentialTarget.path.slice(
              potentialTarget.path.lastIndexOf('/') + 1
            )
          )
        )
      );
      searchableFiles = searchableFiles.filter(
        file => !targets.some(target => target.path === file.path)
      );
      deletableFiles = deletableFiles.filter(
        file => !targets.some(target => target.path === file.path)
      );
      promises.push(...targets.map(target => unlink(target.path)));
    } while (targets.length > 0);

    await Promise.all(promises);
  }

  /**
   * @returns {Promise<void>}
   */
  async #deleteEmptyDirectories() {
    let directories = await this.#getDirectories();
    let deletedDirectories;
    do {
      // eslint-disable-next-line no-await-in-loop
      const updatedDirectories = await Promise.all(
        directories.map(directory => Cleaner.#deleteIfEmpty(directory))
      );

      deletedDirectories = updatedDirectories.some(
        ({ 1: wasDeleted }) => wasDeleted
      );
      directories = updatedDirectories
        .filter(({ 1: wasDeleted }) => !wasDeleted)
        .map(([directory]) => directory);
    } while (deletedDirectories);
  }

  /**
   * @returns {Promise<void>}
   */
  async cleanUp() {
    await this.#deleteUnusedFiles();
    await this.#deleteEmptyDirectories();
  }
}
