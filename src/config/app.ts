import type { UserConfig } from 'vite'
import type { OptionsConfig } from '../types'
import { defineConfig, mergeConfig } from 'vite'
import { loadAppPlugins } from '../plugins/app'
import { getCommonConfig } from './common'

export function defineAppConfig(options: OptionsConfig) {
  return defineConfig(async (config) => {
    const { dynamicBase, vite = {} } = options
    const { command } = config
    const isBuild = command === 'build'

    const plugins = await loadAppPlugins({
      ...options,
      isBuild,
    })

    const appConfig: UserConfig = {
      base: dynamicBase ? '/__dynamic_base__/' : '/',
      plugins,
      build: {
        target: 'es2015',
        rollupOptions: {
          output: {
            assetFileNames: '[ext]/[name]-[hash].[ext]',
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'jse/index-[name]-[hash].js',
          },
        },
      },
      esbuild: {
        drop: isBuild
          ? [
              // 'console',
              'debugger',
            ]
          : [],
        legalComments: 'none',
      },
      server: {
        host: true,
      },
    }

    const mergedCommonConfig = mergeConfig(
      await getCommonConfig(options),
      appConfig,
    )
    return mergeConfig(mergedCommonConfig, vite)
  })
}
