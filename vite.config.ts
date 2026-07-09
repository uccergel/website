import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrotmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeHighLight from 'rehype-highlight'

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  Object.assign(process.env, env)

  // ← Sadece development ortamında SSL doğrulamasını devre dışı bırak
  if (mode === 'development') {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
  }

  return {
    resolve: { tsconfigPaths: true },
    plugins: [
      {
        enforce: 'pre',
        ...mdx({
          remarkPlugins: [
            remarkGfm,
            remarkFrotmatter,
            // frontmatter'ı "export const frontmatter = {...}" haline getirir
            remarkMdxFrontmatter
          ],
          rehypePlugins: [rehypeHighLight]
        })
      },
      devtools(),
      tailwindcss(),
      tanstackStart(),
      viteReact()
    ]
  }
})

export default config
