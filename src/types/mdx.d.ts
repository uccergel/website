// src/types/mdx.d.ts
import type { ComponentType } from 'react'

declare module '*.mdx' {
  /** MDX dosyasının kendisi bir React component'tir */
  const Component: ComponentType
  export default Component

  /**
   * remark-mdx-frontmatter tarafından export edilen frontmatter verisi.
   * --- ile başlayan YAML bloğu buraya gelir.
   */
  export const frontmatter: {
    title: string
    date: string
    description: string
    tags?: string[]
    author?: string
    draft?: boolean
    [key: string]: unknown
  }
}
