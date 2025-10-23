# @octohash/vite-config

[![npm version][npm-version-src]][npm-version-href]
[![JSDocs][jsdocs-src]][jsdocs-href]
[![License][license-src]][license-href]

Opinionated but customizable, with built-in support for unplugin, i18n, and more.

```bash
pnpm add -d @octohash/vite-config
```

## Usage

Automatically detects the project type (app or library) and applies suitable plugins. Manual configuration is rarely needed.

```ts
import { defineConfig } from '@octohash/vite-config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Vue are autodetected, you can also explicitly enable them
  vue: true,
  // You can override and extend vite config here
  vite: {
    plugins: [
      tailwindcss(),
    ]
  }
})
```

## Customization

The following is the top-level configuration (OptionsConfig) used to customize the Vite setup. It covers project type detection, alias resolution, common plugins, and both app/library-specific options.

```ts
interface OptionsConfig {
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

  // Common Plugin
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

  // Application Plugin
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

  // Library Plugin
  /**
   * https://github.com/qmhc/vite-plugin-dts
   * Generates declaration files from .ts or .vue source files
   *
   * @default auto-detect based on `projectType === 'lib'`
   */
  dts?: boolean | DtsPluginOptions

  // Vue Plugin
  /**
   * Enable Vue support
   * The goal is to provide an automatic registration mechanism similar to Nuxt in app development.
   *
   * @default auto-detect based on the dependencies
   */
  vue?: boolean | OptionsVue

  // Override
  vite?: UserConfig
}
```

Vue-related options (vue) can also be customized in detail

```ts
interface OptionsVue {
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
   * Automatically imports commonly used APIs such as `vue`, `vue-router`, `pinia`, `@vueuse/core`, etc
   * Also supports auto-importing UI components from libraries like `ant-design-vue`, `element-plus`, etc
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
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@octohash/vite-config?style=flat&colorA=080f12&colorB=1fa669
[npm-version-href]: https://npmjs.com/package/@octohash/vite-config
[npm-downloads-src]: https://img.shields.io/npm/dm/@octohash/vite-config?style=flat&colorA=080f12&colorB=1fa669
[npm-downloads-href]: https://npmjs.com/package/@octohash/vite-config
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@octohash/vite-config?style=flat&colorA=080f12&colorB=1fa669&label=minzip
[bundle-href]: https://bundlephobia.com/result?p=@octohash/vite-config
[license-src]: https://img.shields.io/badge/license-MIT-blue.svg?style=flat&colorA=080f12&colorB=1fa669
[license-href]: https://github.com/jinghaihan/@octohash/vite-config/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsdocs-reference-080f12?style=flat&colorA=080f12&colorB=1fa669
[jsdocs-href]: https://www.jsdocs.io/package/@octohash/vite-config
