import type { PluginOption } from 'vite'
import dayjs from 'dayjs'
import { extractAuthorInfo, loadMergedPackageJson } from '../utils'

export interface MetadataPluginOptions {
  extendMetadata?: Record<string, unknown>
}

export async function MetadataPlugin(options?: MetadataPluginOptions): Promise<PluginOption> {
  const { extendMetadata = {} } = options ?? {}

  const pkgJson = await loadMergedPackageJson()
  const { name, description, homepage, license, version } = pkgJson
  const { name: authorName, email: authorEmail, url: authorUrl } = extractAuthorInfo(pkgJson)
  const buildTime = dayjs().format('YYYY-MM-DD HH:mm:ss')

  return {
    name: 'vite-plugin-metadata',
    enforce: 'post',
    config: () => {
      return {
        define: {
          __VITE_APP_METADATA__: JSON.stringify({
            authorName,
            authorEmail,
            authorUrl,
            buildTime,
            name,
            description,
            homepage,
            license,
            version,
            ...extendMetadata,
          }),
        },
      }
    },
  }
}
