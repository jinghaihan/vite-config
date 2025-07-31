import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  ignorePaths: [
    'playground',
  ],
  catalogRules: mergeCatalogRules([
    {
      name: 'vue',
      match: [/plugin-vue/, 'unplugin-auto-import'],
      priority: 0,
    },
    {
      name: 'common',
      match: [/vite-plugin/, /rollup-plugin/],
      priority: 0,
    },
    {
      name: 'utils',
      match: ['@antfu/install-pkg'],
    },
  ]),
})
