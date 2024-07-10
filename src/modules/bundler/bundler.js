import { isLocal, resolvePath } from './utils.js';
import { Parser } from 'htmlparser2';
import { build } from 'esbuild';
import path from 'node:path';
import { readFile } from 'node:fs/promises';

export class Bundler {
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
  async #getFileContents(files) {
    return await Promise.all(
      files
        .filter(
          file => !this.#options.thirdPartyModules.some(
            ignore => file.includes(ignore)
          ) && this.#options.bundler.entryDocumentExtensions.some(
            type => file.endsWith(type)
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
   * @param {string[]} files
   * @returns {Promise<string[]>}
   */
  async getEntryPoints(files) {
    /** @type {string[]} */
    const entryPoints = [];
    const root = this.#options.rootDirectory;
    const fileContents = await this.#getFileContents(files);

    for (const file of fileContents) {
      const parser = new Parser({

        /**
         * @param {string} name
         * @param {{[x: string]: string}} attributes
         * @returns {void}
         */
        onopentag(name, attributes) {
          if (
            name === 'script' &&
            attributes.type === 'module' &&
            isLocal(attributes.src)
          ) entryPoints.push(resolvePath(root, file.path, attributes.src));

          if (
            name === 'link' &&
            attributes.rel === 'stylesheet' &&
            isLocal(attributes.href)
          ) entryPoints.push(resolvePath(root, file.path, attributes.href));
        }
      });
      parser.write(file.content);
      parser.end();
    }

    return entryPoints;
  }

  /**
   * @param {string[]} entryPoints
   * @returns {Promise<void>}
   */
  async bundle(entryPoints) {
    await build({
      ...this.#options.commonEsbuildOptions,
      bundle: true,
      entryPoints,
      external: this.#options.bundler.external,
      outdir: path.join(
        this.#options.outDirectory,
        this.#options.rootDirectory
      ),
      splitting: true
    });
  }
}
