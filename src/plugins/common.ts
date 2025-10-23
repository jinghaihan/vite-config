import type { PluginOption } from 'vite'
import type { OptionsConfig } from '../types'
import { visualizer as Visualizer } from 'rollup-plugin-visualizer'
import { ensurePackages } from '../ensure'
import { loadPlugins } from '../utils'
import { LicensePlugin } from './license'

export async function loadCommonPlugins(options: OptionsConfig): Promise<PluginOption[]> {
  const { isBuild, visualizer = false, license = true, federation } = options

  ensurePackages([
    federation ? '@originjs/vite-plugin-federation' : undefined,
  ])

  return await loadPlugins([
    {
      condition: isBuild && !!visualizer,
      plugins: () => [
        Visualizer(
          typeof visualizer === 'boolean'
            ? {
                filename: './node_modules/.cache/visualizer/stats.html',
                gzipSize: true,
                open: true,
              }
            : visualizer,
        ) as PluginOption,
      ],
    },
    {
      condition: isBuild && !!license,
      plugins: async () => [
        await LicensePlugin(
          typeof license === 'boolean'
            ? undefined
            : license,
        ),
      ],
    },
    {
      condition: !!federation,
      plugins: async () => {
        const module = await import('@originjs/vite-plugin-federation')
        return [
          module.default(federation!),
        ]
      },
    },
  ])
}
