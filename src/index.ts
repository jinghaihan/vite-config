import type { UserConfig } from 'vite'
import type { OptionsConfig } from './types'
import { isPackageExists } from 'local-pkg'
import { defineConfig as defineViteConfig, mergeConfig } from 'vite'
import { getCommonConfig } from './config'
import { VUE_PACKAGES } from './constants'
import { loadAppPlugins } from './plugins'

export * from './types'

export function defineConfig(options: OptionsConfig) {
  const resolved = {
    unocss: isPackageExists('unocss'),
    vue: VUE_PACKAGES.some(pkg => isPackageExists(pkg)),
    ...options,
  }

  return defineViteConfig(async (config) => {
    const { dynamicBase, vite = {} } = resolved
    const { command } = config
    const isBuild = command === 'build'

    const plugins = await loadAppPlugins({
      ...resolved,
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
      await getCommonConfig(resolved),
      appConfig,
    )
    return mergeConfig(mergedCommonConfig, vite)
  })
}
