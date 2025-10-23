import type { PluginOption } from 'vite'
import { EOL } from 'node:os'
import { currentTime, extractAuthor, mergePackageJSON } from '../utils'

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
      order: 'post',
      handler: (_options, bundle) => {
        for (const [, content] of Object.entries(bundle)) {
          if (content.type === 'chunk' && content.isEntry)
            content.code = `${licenseText}${EOL}${content.code}`
        }
      },
    },
  }
}

async function generateLicenseText(options: LicensePluginOptions): Promise<string> {
  const data = await mergePackageJSON()
  const { name: authorName, email: authorEmail, url: authorUrl } = extractAuthor(data)

  const {
    name = data.name,
    author = authorName,
    version = data.version,
    description = data.description,
    homepage = data.homepage ?? authorUrl,
    license,
    contact = authorEmail,
    copyright = {
      holder: authorName,
      year: new Date().getFullYear(),
    },
  } = options ?? {}

  const date = currentTime('YYYY-MM-DD')
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
