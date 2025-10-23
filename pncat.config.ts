import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: 'vue',
      match: [/vue/],
      priority: 0,
    },
    {
      name: 'common',
      match: [/vite-plugin/, /unplugin/, /visualizer/],
      priority: 0,
    },
    {
      name: 'pkg',
      match: ['local-pkg', 'pkg-types', '@antfu/install-pkg'],
      priority: 0,
    },
  ]),
  depFields: {
    optionalDependencies: true,
  },
  postRun: 'eslint --fix "**/package.json" "**/pnpm-workspace.yaml"',
})
