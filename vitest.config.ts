import { resolve } from 'node:path'
import swc from 'unplugin-swc'
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    root: './',
    exclude: [
      ...configDefaults.exclude,
      '**/*.e2e.test.ts',
      '**/dist/**',
      '**/coverage/**',
    ],
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
    },
  },
})
