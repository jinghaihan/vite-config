import { promises } from 'node:fs'
import { basename, join } from 'node:path'
import { glob } from 'tinyglobby'
import { defineBuildConfig } from 'unbuild'
import { optionalDependencies } from './package.json'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: 'node16',
  clean: true,
  externals: Object.keys(optionalDependencies),
  failOnWarn: false,
  hooks: {
    'mkdist:done': async () => {
      const patterns = ['html'].map(ext => `src/**/*.${ext}`)
      const files = await glob(patterns)
      for (const file of files) {
        await promises.copyFile(file, join('dist', basename(file)))
      }
      console.log(`✔ Copied ${files.length} assets to dist/`)
    },
  },
})
