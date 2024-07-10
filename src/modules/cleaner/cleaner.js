import { readFile, unlink } from 'node:fs/promises';
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
   * @param {string[]} files
   * @returns {Promise<FileInfo[]>}
   */
  async #getFiles(files) {
    return await Promise.all(
      files
        .filter(
          file => !this.#options.thirdPartyModules.some(
            ignore => file.includes(ignore)
          )
        )
        .map(async file => {
          const realPath = path.join(this.#options.outDirectory, file);
          const buffer = await readFile(realPath);
          return {
            content: buffer.toString(),
            path: realPath
          };
        })
    );
  }

  /**
   * @param {string[]} files
   * @returns {Promise<void>}
   */
  async cleanUp(files) {
    const promises = [];
    const allFiles = await this.#getFiles(files);

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
