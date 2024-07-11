import { readFile, readdir, unlink } from 'node:fs/promises';
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
        .filter(
          entry => entry.isFile() &&
          !this.#options.thirdPartyModules.some(
            ignore => path.join(entry.parentPath, entry.name).includes(ignore)
          )
        )
        .map(entry => path.join(entry.parentPath, entry.name))
        .filter(
          file => !this.#options.thirdPartyModules.some(
            ignore => file.includes(ignore)
          )
        )
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
   * @returns {Promise<void>}
   */
  async cleanUp() {
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
}
