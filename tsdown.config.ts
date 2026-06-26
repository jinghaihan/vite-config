import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

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
    neverBundle: Object.keys(pkg.peerDependencies).map(pkg => new RegExp(`^${escapeRegex(pkg)}(?:/.+)?$`)),
  },
  copy: [
    { from: 'src/**/*.html' },
  ],
})
