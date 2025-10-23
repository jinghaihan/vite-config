import type { PluginOption } from 'vite'
import { currentTime, extractAuthor, mergePackageJSON } from '../utils'

export interface MetadataPluginOptions {
  extendMetadata?: Record<string, unknown>
}

export async function MetadataPlugin(options?: MetadataPluginOptions): Promise<PluginOption> {
  const { extendMetadata = {} } = options ?? {}

  const data = await mergePackageJSON()
  const { name, description, homepage, license, version } = data
  const { name: authorName, email: authorEmail, url: authorUrl } = extractAuthor(data)
  const buildTime = currentTime('YYYY-MM-DD HH:mm:ss')

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
