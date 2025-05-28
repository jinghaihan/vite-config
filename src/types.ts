import type { PluginOptions as VueI18nPluginOptions } from '@intlify/unplugin-vue-i18n'
import type { VitePluginFederationOptions as FederationPluginOptions } from '@originjs/vite-plugin-federation'
import type { PluginVisualizerOptions as VisualizerPluginOptions } from 'rollup-plugin-visualizer'
import type { Options as VueImportsPluginOptions } from 'unplugin-auto-import/types'
import type { Options as VueComponentsPluginOptions } from 'unplugin-vue-components'
import type { Options as VuePagesPluginOptions } from 'unplugin-vue-router'
import type { AliasOptions, PluginOption, UserConfig } from 'vite'
import type { PluginOptions as DtsPluginOptions } from 'vite-plugin-dts'
import type { VitePluginVueDevToolsOptions as VueDevtoolsPluginOptions } from 'vite-plugin-vue-devtools'
import type { AppLoadingPluginOptions } from './plugins/app-loading'
import type { ImportMapPluginOptions } from './plugins/import-map'
import type { LicensePluginOptions } from './plugins/license'
import type { MetadataPluginOptions } from './plugins/metadata'

export type ProjectType = 'app' | 'lib'

export interface CommonPluginOptions {
  /**
   * https://github.com/btd/rollup-plugin-visualizer
   * By default template path is: ./node_modules/.cache/visualizer/stats.html
   *
   * @default false
   */
  visualizer?: boolean | VisualizerPluginOptions
  /**
   * Inject license info to output files
   * Load license file from `package.json`, if it is a monorepo project, the root `package.json` will also be merged
   *
   * @default true
   */
  license?: boolean | LicensePluginOptions
  /**
   * https://github.com/originjs/vite-plugin-federation
   * Module federation
   */
  federation?: FederationPluginOptions
}

export interface AppPluginOptions {
  /**
   * https://github.com/chenxch/vite-plugin-dynamic-base
   * If you want to build once and deploy to multiple environments, you can enable this plugin to set publicPath at runtime
   * You can set like this: `dynamicBase: 'window.__dynamic_base__'`
   */
  dynamicBase?: string
  /**
   * Inject app loading to `index.html`
   * You can customize the root element and loading template
   * Use `[app-loading-title]` as a placeholder to dynamically set the document title during loading`
   *
   * @default auto-detect based on `projectType === 'app'`
   */
  appLoading?: boolean | AppLoadingPluginOptions
  /**
   * Injects metadata using `define`, accessible via `__VITE_APP_METADATA__`.
   * Includes information such as author, build time, version, and more.
   *
   * @default auto-detect based on `projectType === 'app'`
   */
  metadata?: boolean | MetadataPluginOptions
  /**
   * Generates an import map for the project.
   * Based on https://github.com/jspm/vite-plugin-jspm, with extended CDN provider support and options for include/exclude.
   *
   * @default false
   */
  importMap?: boolean | ImportMapPluginOptions
}

export interface LibPluginOptions {
  /**
   * https://github.com/qmhc/vite-plugin-dts
   * Generates declaration files from .ts or .vue source files
   *
   * @default auto-detect based on `projectType === 'lib'`
   */
  dts?: boolean | DtsPluginOptions
}

export interface OptionsVue {
  /**
   * https://github.com/vuejs/devtools
   * Enable Vue Devtools
   *
   * @default false
   */
  devtools?: boolean | VueDevtoolsPluginOptions
  /**
   * https://github.com/intlify/bundle-tools
   * Enable Vue I18n
   *
   * @default false
   */
  i18n?: boolean | VueI18nPluginOptions
  /**
   * https://github.com/unplugin/unplugin-auto-import
   * Auto-imports commonly used APIs such as `vue`, `vue-router`, `pinia`, `@vueuse/core`, etc
   * Also supports auto-importing UI components from libraries like `ant-design-vue`, `element-plus`, etc
   * Files from `src/composables` and `src/utils` will also be auto-imported.
   *
   * @default auto-detect based on `projectType === 'app'`
   */
  imports?: boolean | VueImportsPluginOptions
  /**
   * https://github.com/unplugin/unplugin-vue-components
   * Enabled by default when the project type is `app`
   * The `directoryAsNamespace` option is enabled by default.
   *
   * @default auto-detect based on `projectType === 'app'`
   */
  components?: boolean | VueComponentsPluginOptions
  /**
   * https://github.com/posva/unplugin-vue-router
   * Enabled by default when the project type is `app`
   * Folder(s) to scan for files and generate routes. Defaults to scanning the pages directory.
   *
   * @default auto-detect based on `projectType === 'app'`
   */
  pages?: boolean | VuePagesPluginOptions
}

export interface OptionsConfig extends CommonPluginOptions, AppPluginOptions, LibPluginOptions {
  /**
   * Whether to build for production
   *
   * @default auto-detect based on `command === 'build'`
   */
  isBuild?: boolean
  /**
   * Type of the project
   *
   * @default auto-detect based on the `index.html` file
   */
  type?: ProjectType
  /**
   * Aliases used to replace values in `import` or `require` statements
   * Paths are automatically resolved if needed
   *
   * @default { "@": "./src" }
   */
  alias?: AliasOptions
  /**
   * Enable Vue support
   * The goal is to provide an automatic registration mechanism similar to Nuxt in app development.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue
  vite?: UserConfig
}

export interface ConditionPlugin {
  condition?: boolean
  plugins: () => PluginOption[] | PromiseLike<PluginOption[]>
}

export type ResolvedOptions<T> = T extends boolean
  ? never
  : NonNullable<T>
