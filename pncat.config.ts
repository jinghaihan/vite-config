import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: 'vue',
      match: [/vue/, 'unplugin-auto-import'],
      priority: 0,
    },
    {
      name: 'common',
      match: [/vite-plugin/, /rollup-plugin/],
      priority: 0,
    },
    {
      name: 'node',
      match: ['@antfu/install-pkg'],
    },
  ]),
  depFields: {
    optionalDependencies: true,
  },
  postRun: 'eslint --fix "**/package.json" "**/pnpm-workspace.yaml"',
})
