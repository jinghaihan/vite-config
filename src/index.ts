import type { OptionsConfig } from './types'
import { isPackageExists } from 'local-pkg'
import { defineAppConfig } from './config/app'
import { defineLibConfig } from './config/lib'
import { VUE_PACKAGES } from './constants'
import { getProjectType } from './utils'

export * from './types'

export function defineConfig(options: OptionsConfig) {
  const resolved = {
    type: getProjectType(),
    vue: VUE_PACKAGES.some(pkg => isPackageExists(pkg)),
    ...options,
  }

  switch (resolved.type) {
    case 'app':
      return defineAppConfig(resolved)
    case 'lib':
      return defineLibConfig(resolved)
      break
    default:
      throw new Error(`Unsupported project type: ${resolved.type}`)
  }
}
