import { promises } from 'node:fs'
import { basename, join } from 'node:path'
import glob from 'fast-glob'
import { defineBuildConfig } from 'unbuild'
import { optionalDependencies } from './package.json'

const assets = ['html']
export default defineBuildConfig({
  entries: ['src/index'],
  declaration: 'node16',
  clean: true,
  externals: Object.keys(optionalDependencies),
  failOnWarn: false,
  hooks: {
    'mkdist:done': async () => {
      const patterns = assets.map(ext => `src/**/*.${ext}`)
      const files = await glob(patterns)
      for (const file of files) {
        const dest = join('dist', basename(file))
        await promises.copyFile(file, dest)
      }
      console.log(`✔ Copied ${files.length} assets (${assets.join(', ')}) to dist/`)
    },
  },
})
