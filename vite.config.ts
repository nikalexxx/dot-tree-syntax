import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    charset: 'utf8',
    exclude: ['**/*.test.ts'],
  },
  build: {
    target: 'es2019',
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format}.js`,
    },
  },
});
