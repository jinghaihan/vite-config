import type { PluginOption } from 'vite'
import type { OptionsConfig } from '../types'
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
      plugins: async () => {
        const module = await import('vite-bundle-visualizer')
        return [
          module.default(
            typeof visualizer === 'boolean'
              ? {
                  output: './node_modules/.cache/visualizer/stats.html',
                  open: true,
                }
              : visualizer,
          ) as PluginOption,
        ]
      },
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
