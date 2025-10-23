import type { PackageJson } from 'pkg-types'
import type { PluginOption } from 'vite'
import type { ConditionPlugin, OptionsConfig, ProjectType, ResolvedOptions } from './types'
import { existsSync } from 'node:fs'
import process from 'node:process'
import dayjs from 'dayjs'
import deepmerge from 'deepmerge'
import { findUp } from 'find-up'
import { join } from 'pathe'
import { readPackageJSON } from 'pkg-types'
import { LOCK_FILES } from './constants'

export function currentTime(format: string = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs().format(format)
}

export function getProjectType(): ProjectType {
  return existsSync(join(process.cwd(), 'index.html')) ? 'app' : 'lib'
}

export async function mergePackageJSON(): Promise<PackageJson> {
  const cwd = process.cwd()
  const filepath = await findUp(LOCK_FILES, { cwd, type: 'file' })
  const data = filepath ? await readPackageJSON(filepath) : {}
  return deepmerge(data, await readPackageJSON(cwd))
}

export function extractAuthor(data: PackageJson) {
  const { author } = data
  const isObject = typeof author === 'object'
  return {
    name: isObject ? author.name : author,
    email: isObject ? author.email : undefined,
    url: isObject ? author.url : undefined,
  }
}

export function extractOptions<K extends keyof OptionsConfig>(options: OptionsConfig, key: K): ResolvedOptions<OptionsConfig[K]> {
  return (typeof options[key] === 'boolean' ? {} : options[key] || {}) as ResolvedOptions<OptionsConfig[K]>
}

export async function loadPlugins(plugins: ConditionPlugin[]): Promise<PluginOption[]> {
  const data: PluginOption[] = []
  for (const plugin of plugins) {
    if (plugin.condition)
      data.push(...await plugin.plugins())
  }
  return data.flat()
}
