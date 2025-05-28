import type { PluginOption } from 'vite'
import { EOL } from 'node:os'
import dayjs from 'dayjs'
import { extractAuthorInfo, loadMergedPackageJson } from '../utils'

export interface LicensePluginOptions {
  name?: string
  author?: string
  version?: string
  description?: string
  homepage?: string
  license?: string
  contact?: string
  copyright?: {
    holder?: string
    year?: string | number
  }
}

export async function LicensePlugin(options?: LicensePluginOptions): Promise<PluginOption> {
  const licenseText = await generateLicenseText(options || {})

  return {
    name: 'vite-plugin-license',
    enforce: 'post',
    apply: 'build',
    generateBundle: {
      handler: (_options, bundle) => {
        for (const [, fileContent] of Object.entries(bundle)) {
          if (fileContent.type === 'chunk' && fileContent.isEntry) {
            const chunkContent = fileContent
            const content = chunkContent.code
            const updatedContent = `${licenseText}${EOL}${content}`
            fileContent.code = updatedContent
          }
        }
      },
    },
  }
}

async function generateLicenseText(options: LicensePluginOptions): Promise<string> {
  const pkgJson = await loadMergedPackageJson()
  const { name: authorName, email: authorEmail, url: authorUrl } = extractAuthorInfo(pkgJson)

  const {
    name = pkgJson.name,
    author = authorName,
    version = pkgJson.version,
    description = pkgJson.description,
    homepage = pkgJson.homepage ?? authorUrl,
    license,
    contact = authorEmail,
    copyright = {
      holder: authorName,
      year: new Date().getFullYear(),
    },
  } = options ?? {}

  const date = dayjs().format('YYYY-MM-DD')
  const lines: string[] = []

  lines.push('/*!')
  if (name)
    lines.push(` * ${name}`)
  if (version)
    lines.push(` * Version: ${version}`)
  if (author)
    lines.push(` * Author: ${author}`)
  if (license)
    lines.push(` * License: ${license}`)
  if (description)
    lines.push(` * Description: ${description}`)
  if (homepage)
    lines.push(` * Homepage: ${homepage}`)
  if (contact)
    lines.push(` * Contact: ${contact}`)
  if (copyright?.holder)
    lines.push(` * Copyright (C) ${copyright.year} ${copyright.holder}`)
  if (date)
    lines.push(` * Date: ${date}`)
  lines.push(' */')

  return lines.join('\n')
}
