import type { PluginOption } from 'vite'
import type { OptionsConfig } from '../types'
import { loadConditionPlugins } from '../utils'
import { AppLoadingPlugin } from './app-loading'
import { loadCommonPlugins } from './common'
import { ImportMapPlugin } from './import-map'
import { MetadataPlugin } from './metadata'
import { loadVuePlugins } from './vue'

export async function loadAppPlugins(options: OptionsConfig): Promise<PluginOption[]> {
  const {
    isBuild,
    dynamicBase,
    appLoading = true,
    metadata = true,
    importMap = false,
    vue,
  } = options

  const plugins: PluginOption[] = await loadCommonPlugins(options)

  plugins.push(await loadConditionPlugins([
    {
      condition: !!dynamicBase,
      plugins: async () => {
        const module = await import('vite-plugin-dynamic-base')
        return [
          module.dynamicBase({
            publicPath: dynamicBase,
            transformIndexHtml: true,
          }),
        ]
      },
    },
    {
      condition: !!appLoading,
      plugins: async () => [
        await AppLoadingPlugin(
          typeof appLoading === 'boolean'
            ? undefined
            : appLoading,
        ),
      ],
    },
    {
      condition: !!metadata,
      plugins: async () => {
        return [
          await MetadataPlugin(
            typeof metadata === 'boolean'
              ? undefined
              : metadata,
          ),
        ]
      },
    },
    {
      condition: isBuild && !!importMap,
      plugins: () => {
        return [
          ImportMapPlugin(
            typeof importMap === 'boolean'
              ? undefined
              : importMap,
          ),
        ]
      },
    },
  ]))

  if (vue)
    plugins.push(await loadVuePlugins('app', options))

  return plugins
}
