import { defineConfig } from 'tsdown'
import { optionalDependencies, peerDependencies } from './package.json' assert { type: 'json' }

export default defineConfig({
  entry: ['src/index'],
  dts: true,
  exports: true,
  clean: true,
  deps: {
    neverBundle: [
      ...Object.keys({
        ...peerDependencies,
        ...optionalDependencies,
      }),
      ...['@jspm/generator'],
    ],
  },
  copy: [
    { from: 'src/**/*.html' },
  ],
})
