import { fileURLToPath } from 'node:url'

export const PACKAGE_ROOT = fileURLToPath(new URL('.', import.meta.url))

export const VUE_PACKAGES = ['vue', 'nuxt', 'vitepress'] as const

export const LOCK_FILES = [
  'npm-shrinkwrap.json',
  'package-lock.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'yarn.lock',
  'deno.lock',
  'bun.lock',
  'bun.lockb',
]
