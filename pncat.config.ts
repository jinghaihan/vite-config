import { defineConfig, mergeCatalogRules } from 'pncat'

export default defineConfig({
  catalogRules: mergeCatalogRules([
    {
      name: 'plugin',
      match: [/plugin/, /bundle/],
      priority: 0,
    },
    {
      name: 'inlined',
      match: ['deepmerge'],
      priority: 0,
    },
  ]),
  depFields: {
    optionalDependencies: true,
  },
  postRun: 'eslint --fix "**/package.json" "**/pnpm-workspace.yaml"',
})
