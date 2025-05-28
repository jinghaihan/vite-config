import type { PluginOption } from 'vite'
import fsp from 'node:fs/promises'
import path from 'node:path'

export interface AppLoadingPluginOptions {
  rootContainer?: string
  title?: string
  filePath?: string
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
    rootContainer = 'app',
    title = '',
    filePath = path.join(__dirname, './default-loading.html'),
  } = options || {}

  const loadingHtml = await getLoadingRawByHtmlTemplate(filePath)

  return {
    name: 'vite-plugin-app-loading',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler: (html: string) => {
        const rootContainerPattern = new RegExp(`<div id="${rootContainer}"\\s*></div>`, 'i')
        if (!rootContainerPattern.test(html)) {
          return html
        }

        const processedLoadingHtml = loadingHtml.replace(
          '[app-loading-title]',
          title,
        )
        const injectedContent = `${INJECT_SCRIPT}${processedLoadingHtml}`

        return html.replace(
          rootContainerPattern,
          `<div id="${rootContainer}">${injectedContent}</div>`,
        )
      },
    },
  }
}

async function getLoadingRawByHtmlTemplate(filePath: string) {
  return await fsp.readFile(filePath, 'utf8')
}
