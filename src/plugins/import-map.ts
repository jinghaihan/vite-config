import type { GeneratorOptions } from '@jspm/generator'
import type { Plugin } from 'vite'
import { ensurePackages } from '../ensure'

export interface ImportMapPluginOptions extends GeneratorOptions {
  downloadDeps?: boolean
  debug?: boolean
  defaultProvider?: 'jspm.io' | 'jsdelivr' | 'unpkg' | 'esm.sh'
  include?: string[]
  exclude?: string[]
}

const shimsSubpath = `dist/es-module-shims.js`

const providerShimsMap: Record<string, string> = {
  'jspm.io': `https://ga.jspm.io/npm:es-module-shims@{version}/${shimsSubpath}`,
  'jsdelivr': `https://cdn.jsdelivr.net/npm/es-module-shims@{version}/${shimsSubpath}`,
  'unpkg': `https://unpkg.com/es-module-shims@{version}/${shimsSubpath}`,
  'esm.sh': `https://esm.sh/es-module-shims@{version}/${shimsSubpath}`,
}

export async function ImportMapPlugin(options: ImportMapPluginOptions = {}): Promise<Plugin[]> {
  await ensurePackages(['vite-plugin-jspm'])
  const module = await import('vite-plugin-jspm')

  const {
    defaultProvider = 'jspm.io',
    include = [],
    exclude = [],
  } = options

  const [scan, mapping, post] = await module.default({
    ...options,
    pollyfillProvider: (version: string) => providerShimsMap[defaultProvider]?.replace('{version}', version),
  })

  const _resolveId: Plugin['resolveId'] = scan.resolveId
  scan.resolveId = function (id, importer, ctx) {
    if ((include.length && !include.includes(id)) || (exclude.length && exclude.includes(id))) {
      return null
    }
    return typeof _resolveId === 'function'
      ? _resolveId.call(this, id, importer, ctx)
      : null
  }

  const _load: Plugin['load'] = mapping.load
  mapping.load = function (id) {
    if (include.length && !include.includes(id)) {
      return null
    }
    return typeof _load === 'function'
      ? _load.call(this, id)
      : null
  }

  return [scan, mapping, post]
}
