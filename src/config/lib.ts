import type { UserConfig } from 'vite'
import type { OptionsConfig } from '../types'
import process from 'node:process'
import { readPackageJSON } from 'pkg-types'
import { defineConfig, mergeConfig } from 'vite'
import { loadLibPlugins } from '../plugins/lib'
import { getCommonConfig } from './common'

export function defineLibConfig(options: OptionsConfig) {
  return defineConfig(async (config) => {
    const root = process.cwd()

    const { vite = {} } = options
    const { command } = config
    const isBuild = command === 'build'

    const plugins = await loadLibPlugins({
      ...options,
      isBuild,
    })

    const { dependencies = {}, peerDependencies = {} } = await readPackageJSON(root)
    const externalPackages = [
      ...Object.keys(dependencies),
      ...Object.keys(peerDependencies),
    ]

    const libConfig: UserConfig = {
      plugins,
      build: {
        lib: {
          entry: 'src/index.ts',
          fileName: () => 'index.mjs',
          formats: ['es'],
        },
        rollupOptions: {
          external: (id) => {
            return externalPackages.some(
              pkg => id === pkg || id.startsWith(`${pkg}/`),
            )
          },
        },
      },
    }

    const mergedCommonConfig = mergeConfig(
      await getCommonConfig(options),
      libConfig,
    )
    return mergeConfig(mergedCommonConfig, vite)
  })
}
