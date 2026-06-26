import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: 'common-plugin',
      match: [/plugin/, /bundle/],
      priority: 0,
    },
    {
      name: 'vue-plugin',
      match: [/vue/],
      priority: 0,
    },
    {
      name: 'inlined',
      match: ['deepmerge', 'empathic', 'local-pkg', 'pathe', 'pkg-types'],
      priority: 0,
    },
  ]),
  depFields: {
    optionalDependencies: true,
  },
  postRun: 'eslint --fix "**/package.json" "**/pnpm-workspace.yaml"',
})
