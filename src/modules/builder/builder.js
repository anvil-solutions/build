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
   * @param {import('node:fs').Dirent} directoryEntry
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
   * @returns {Promise<[string[], string[]]>}
   */
  async getFoldersAndFiles() {
    const readData = await Promise.all(
      this.#options.directories.map(
        folder => readdir(
          folder,
          { recursive: true, withFileTypes: true }
        )
      )
    );

    const directoryEntries = readData.flat();
    const folders = directoryEntries
      .filter(entry => entry.isDirectory() && !this.#shouldIgnore(entry))
      .map(entry => path.join(entry.parentPath, entry.name));
    const files = directoryEntries
      .filter(entry => entry.isFile() && !this.#shouldIgnore(entry))
      .map(entry => path.join(entry.parentPath, entry.name));

    return [[...this.#options.directories, ...folders], files];
  }

  /**
   * @param {string[]} folders
   * @returns {Promise<void>}
   */
  async createFolderStructure(folders) {
    await Promise.all(
      folders.map(
        folder => mkdir(
          path.join(this.#options.outDirectory, folder), { recursive: true }
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
      !this.#options.thirdPartyModules.some(ignore => file.includes(ignore)) &&
      this.#options.builder.minifiableExtensions.some(
        extension => file.endsWith(extension)
      )
    ) promises.push(
      build({
        ...this.#options.commonEsbuildOptions,
        entryPoints: [file],
        outfile: path.join(this.#options.outDirectory, file)
      })
    );
    else promises.push(
      copyFile(file, path.join(this.#options.outDirectory, file))
    );

    promises.push(
      writeFile(
        path.join(this.#options.outDirectory, 'VERSION'), Date.now().toString()
      )
    );

    await Promise.all(promises);
  }
}
