import type { PluginOption } from 'vite'
import type { OptionsConfig } from '../types'
import { loadPlugins } from '../utils'
import { AppLoadingPlugin } from './app-loading'
import { loadCommonPlugins } from './common'
import { MetadataPlugin } from './metadata'
import { loadVuePlugins } from './vue'

export async function loadAppPlugins(options: OptionsConfig): Promise<PluginOption[]> {
  const {
    dynamicBase,
    appLoading = true,
    metadata = true,
    vue,
  } = options

  const plugins: PluginOption[] = await loadCommonPlugins(options)

  plugins.push(await loadPlugins([
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
      plugins: async () => [
        await MetadataPlugin(
          typeof metadata === 'boolean'
            ? undefined
            : metadata,
        ),
      ],
    },
  ]))

  if (vue)
    plugins.push(await loadVuePlugins(options))

  return plugins
}
