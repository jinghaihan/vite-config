import type { PluginOption } from 'vite'
import type { OptionsConfig } from '../types'
import Dts from 'vite-plugin-dts'
import { loadConditionPlugins } from '../utils'
import { loadCommonPlugins } from './common'
import { loadVuePlugins } from './vue'

export async function loadLibPlugins(options: OptionsConfig): Promise<PluginOption[]> {
  const {
    isBuild,
    dts = true,
    vue,
  } = options

  const plugins: PluginOption[] = await loadCommonPlugins(options)

  plugins.push(await loadConditionPlugins([
    {
      condition: isBuild && !!dts,
      plugins: () => [
        Dts(
          typeof dts === 'boolean'
            ? {
                logLevel: 'error',
              }
            : dts,
        ),
      ],
    },
  ]))

  if (vue)
    plugins.push(await loadVuePlugins('lib', options))

  return plugins
}
