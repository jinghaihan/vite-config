import type { PluginOption } from 'vite'
import { readFile } from 'node:fs/promises'
import { join } from 'pathe'
import { PACKAGE_ROOT } from '../../constants'

export interface AppLoadingPluginOptions {
  container?: string
  title?: string
  filepath?: string
}

const INJECT_SCRIPT = `
  <script data-app-loading="inject-js">
    ;(function () {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      const setting = localStorage.getItem('vueuse-color-scheme') || 'auto'
      if (setting === 'dark' || (prefersDark && setting !== 'light'))
        document.documentElement.classList.toggle('dark', true)
    })()
  </script>
  `

export async function AppLoadingPlugin(options?: AppLoadingPluginOptions): Promise<PluginOption> {
  const {
    container = 'app',
    title = '',
    filepath = join(PACKAGE_ROOT, './default-loading.html'),
  } = options || {}

  const loadingHtml = await readFile(filepath, 'utf8')

  return {
    name: 'vite-plugin-app-loading',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler: (html: string) => {
        const pattern = new RegExp(`<div id="${container}"\\s*></div>`, 'i')
        if (!pattern.test(html))
          return html
        return html.replace(pattern, `<div id="${container}">${`${INJECT_SCRIPT}${loadingHtml.replace('[app-loading-title]', title)}`}</div>`)
      },
    },
  }
}
