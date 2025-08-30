import { fileURLToPath } from 'node:url'

export const PACKAGE_ROOT = fileURLToPath(new URL('.', import.meta.url))

export const VUE_PACKAGES = ['vue', 'nuxt', 'vitepress'] as const
