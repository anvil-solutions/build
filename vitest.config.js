import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/modules/**']
    },
    restoreMocks: true,
    unstubGlobals: true
  }
});
