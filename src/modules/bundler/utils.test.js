import { describe, expect, it } from 'vitest';
import { isLocal, resolvePath } from './utils.js';

describe('local paths', () => {
  it('should return true on absolute local path', () => {
    expect(isLocal('/')).toBe(true);
  });

  it('should return true on relative local path', () => {
    expect(isLocal('./')).toBe(true);
    expect(isLocal('../')).toBe(true);
  });

  it('should return false on //', () => {
    expect(isLocal('//')).toBe(false);
  });

  it('should return false on http://', () => {
    expect(isLocal('http://')).toBe(false);
  });

  it('should return false on https://', () => {
    expect(isLocal('https://')).toBe(false);
  });

  it('should return false on nonsense', () => {
    expect(isLocal(0)).toBe(false);
  });
});

describe('path resolving', () => {
  const ROOT = 'root';

  it('should resolve absolute path', () => {
    expect(
      resolvePath(ROOT, `${ROOT}/test1/test2`, '/test3')
    ).toBe(`${ROOT}/test3`);
  });

  it('should resolve relative path', () => {
    expect(
      resolvePath(ROOT, `${ROOT}/test1/test2`, './test3')
    ).toBe(`${ROOT}/test1/test3`);
    expect(
      resolvePath(ROOT, `${ROOT}/test1/test2/`, './test3')
    ).toBe(`${ROOT}/test1/test2/test3`);
  });
});
