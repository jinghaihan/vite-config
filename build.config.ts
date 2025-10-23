import { copyFileSync } from 'node:fs'
import { basename, join } from 'pathe'
import { glob } from 'tinyglobby'
import { defineBuildConfig } from 'unbuild'
import pkg from './package.json'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: 'node16',
  clean: true,
  rollup: {
    inlineDependencies: true,
    json: {
      compact: true,
      namedExports: false,
      preferConst: true,
    },
    commonjs: {
      requireReturnsDefault: 'auto',
    },
    dts: {
      respectExternal: false,
    },
  },
  externals: Object.keys(pkg.optionalDependencies),
  hooks: {
    'mkdist:done': async () => {
      for (const file of await glob(['src/**/*.html']))
        copyFileSync(file, join('dist', basename(file)))
    },
  },
})
