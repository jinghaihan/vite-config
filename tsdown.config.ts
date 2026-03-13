import { defineConfig } from 'tsdown'
import { optionalDependencies, peerDependencies } from './package.json' assert { type: 'json' }

const reg = /[|\\{}()[\]^$+*?.]/g

function escapeRegex(value: string) {
  return value.replace(reg, '\\$&')
}

export default defineConfig({
  entry: ['src/index'],
  dts: true,
  exports: true,
  clean: true,
  deps: {
    neverBundle: Object.keys({
      ...peerDependencies,
      ...optionalDependencies,
    }).map(pkg => new RegExp(`^${escapeRegex(pkg)}(?:/.+)?$`)),
  },
  copy: [
    { from: 'src/**/*.html' },
  ],
})
