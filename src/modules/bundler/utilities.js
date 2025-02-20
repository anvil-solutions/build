import path from 'node:path';

/**
 * @param {unknown} filePath
 * @returns {boolean}
 */
export function isLocal(filePath) {
  if (typeof filePath !== 'string') return false;
  return !filePath.startsWith('//') &&
    !filePath.startsWith('http://') &&
    !filePath.startsWith('https://');
}

/**
 * @param {string} root
 * @param {string} from
 * @param {string} to
 * @returns {string}
 */
export function resolvePath(root, from, to) {
  if (to.startsWith('/')) return path.join(root, to);

  return path.join(from.endsWith('/') ? from : path.dirname(from), to);
}
