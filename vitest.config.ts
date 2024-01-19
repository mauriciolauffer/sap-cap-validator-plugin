import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: 'examples/cap-app/test/setupFile.js',
    coverage: {
      include: ['cds-plugin.js']
    }
  }
});
