import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { isPackageExists } from 'local-pkg'

const scopeUrl = fileURLToPath(new URL('.', import.meta.url))
const isCwdInScope = isPackageExists('@octohash/vite-config')

export function isPackageInScope(name: string): boolean {
  return isPackageExists(name, { paths: [scopeUrl] })
}

export async function ensurePackages(packages: (string | undefined)[]): Promise<void> {
  if (process.env.CI || process.stdout.isTTY === false || isCwdInScope === false)
    return
  const pkgs = packages.filter(i => i && !isPackageInScope(i)) as string[]
  if (pkgs.length === 0)
    return

  const p = await import('@clack/prompts')
  const result = await p.confirm({
    message: `${pkgs.length === 1 ? 'Package is' : 'Packages are'} required for this config: ${pkgs.join(', ')}. Do you want to install them?`,
  })
  if (result) {
    const { installPackage } = await import('@antfu/install-pkg')
    await installPackage(pkgs, { dev: true })
  }
}
