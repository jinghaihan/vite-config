import type { UserConfig } from 'vite'
import type { OptionsConfig } from '../types'
import process from 'node:process'
import { isAbsolute, resolve } from 'pathe'

export async function getCommonConfig(options: OptionsConfig): Promise<UserConfig> {
  const { alias = {} } = options

  const resolvedAlias = Object
    .entries(alias)
    .reduce((acc, [key, value]) => {
      acc[key] = isAbsolute(value) ? value : resolve(process.cwd(), value)
      return acc
    }, {} as Record<string, string>)

  return {
    resolve: {
      alias: {
        '@': resolve(process.cwd(), './src'),
        ...resolvedAlias,
      },
    },
    build: {
      chunkSizeWarningLimit: 2000,
      reportCompressedSize: false,
      sourcemap: false,
    },
  }
}
