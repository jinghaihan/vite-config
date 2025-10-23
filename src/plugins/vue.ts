import type { Options as VueImportsPluginOptions } from 'unplugin-auto-import/types'
import type { PluginOption } from 'vite'
import type { OptionsConfig, ProjectType } from '../types'
import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import { isPackageExists } from 'local-pkg'
import { ensurePackages } from '../ensure'
import { extractOptions, loadPlugins } from '../utils'

export async function loadVuePlugins(projectType: ProjectType, options: OptionsConfig): Promise<PluginOption[]> {
  const { isBuild } = options
  const isApp = projectType === 'app'
  const {
    devtools = false,
    i18n = false,
    imports = isApp,
    components = isApp,
    pages = isApp,
  } = extractOptions(options, 'vue')

  await ensurePackages([
    devtools ? 'vite-plugin-vue-devtools' : undefined,
    i18n ? '@intlify/unplugin-vue-i18n' : undefined,
  ])

  return loadPlugins([
    {
      condition: true,
      plugins: () => [
        Vue(),
        VueJsx(),
      ],
    },
    {
      condition: !isBuild && !!devtools,
      plugins: async () => {
        const module = await import('vite-plugin-vue-devtools')
        return [
          module.default(
            typeof devtools === 'boolean'
              ? undefined
              : devtools,
          ),
        ]
      },
    },
    {
      condition: !!i18n,
      plugins: async () => {
        const module = await import('@intlify/unplugin-vue-i18n/vite')
        return [
          module.default(
            typeof i18n === 'boolean'
              ? {
                  compositionOnly: true,
                  fullInstall: true,
                  runtimeOnly: true,
                }
              : i18n,
          ),
        ]
      },
    },
    {
      condition: isApp && !!imports,
      plugins: async () => {
        const module = await import('unplugin-auto-import/vite')

        return [
          module.default(
            typeof imports === 'boolean'
              ? {
                  dts: 'src/typings/auto-imports.d.ts',
                  imports: await resolveAutoImports(),
                  resolvers: await resolveUIComponentResolvers(),
                  dirs: [
                    'src/composables',
                    'src/utils',
                  ],
                  vueTemplate: true,
                }
              : imports,
          ),
        ]
      },
    },
    {
      condition: isApp && !!components,
      plugins: async () => {
        const module = await import('unplugin-vue-components/vite')
        return [
          module.default(
            typeof components === 'boolean'
              ? {
                  dts: 'src/typings/components.d.ts',
                  directoryAsNamespace: true,
                }
              : components,
          ),
        ]
      },
    },
    {
      condition: isApp && !!pages,
      plugins: async () => {
        const module = await import('unplugin-vue-router/vite')
        return [
          module.default(
            typeof pages === 'boolean'
              ? {
                  dts: 'src/typings/typed-router.d.ts',
                }
              : pages,
          ),
        ]
      },
    },
  ])
}

async function resolveAutoImports(): Promise<VueImportsPluginOptions['imports']> {
  const imports: VueImportsPluginOptions['imports'] = ['vue']

  if (isPackageExists('vue-router'))
    imports.push('vue-router')

  if (isPackageExists('pinia'))
    imports.push('pinia')

  if (isPackageExists('@vueuse/core'))
    imports.push('@vueuse/core')

  if (isPackageExists('vue-i18n'))
    imports.push('vue-i18n')

  return imports
}

async function resolveUIComponentResolvers(): Promise<VueImportsPluginOptions['resolvers']> {
  const resolvers: VueImportsPluginOptions['resolvers'] = []

  if (isPackageExists('ant-design-vue')) {
    const { AntDesignVueResolver } = await import('unplugin-vue-components/resolvers')
    resolvers.push(
      AntDesignVueResolver({
        importStyle: 'css-in-js',
        prefix: '',
      }),
    )
  }

  if (isPackageExists('element-plus')) {
    const { ElementPlusResolver } = await import('unplugin-vue-components/resolvers')
    resolvers.push(...ElementPlusResolver())
  }

  if (isPackageExists('naive-ui')) {
    const { NaiveUiResolver } = await import('unplugin-vue-components/resolvers')
    resolvers.push(NaiveUiResolver())
  }

  if (isPackageExists('vant')) {
    const { VantResolver } = await import('unplugin-vue-components/resolvers')
    resolvers.push(VantResolver())
  }

  return resolvers
}
