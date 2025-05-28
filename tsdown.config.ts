import { promises } from 'node:fs'
import path from 'node:path'
import fg from 'fast-glob'
import { defineConfig } from 'tsdown'
import { optionalDependencies } from './package.json'

const assets = ['html']

export default defineConfig({
  entry: ['src/index.ts'],
  shims: true,
  format: ['esm'],
  external: Object.keys(optionalDependencies),
  onSuccess: async () => {
    const patterns = assets.map(ext => `src/**/*.${ext}`)
    const files = await fg(patterns)

    for (const file of files) {
      const dest = path.join('dist', path.basename(file))
      await promises.copyFile(file, dest)
    }

    console.log(`✔ Copied ${files.length} assets (${assets.join(', ')}) to dist/`)
  },
})
