// src/lib/blog.ts
import type { ComponentType } from 'react'

// ─── 1. TİP TANIMLARI ────────────────────────────────────────────────────────

/**
 * MDX dosyalarının başındaki --- bloğunun (frontmatter) TypeScript karşılığı.
 * remark-mdx-frontmatter bu veriyi "export const frontmatter = {...}" olarak
 * MDX modülüne ekler.
 */
export interface BlogFrontmatter {
  title: string
  date: string // "YYYY-MM-DD" formatında
  description: string
  tags?: string[]
  author?: string
  draft?: boolean // true ise yayınlanmaz
  [key: string]: unknown
}

/**
 * Blog listesi için gereken minimum veri.
 * React component'e ihtiyaç yok, sadece meta bilgiler.
 */
export interface BlogPost {
  slug: string
  frontmatter: BlogFrontmatter
}

/**
 * Blog detay sayfası için gereken tam veri.
 * BlogPost'u extend eder, üstüne MDX'ten gelen Component eklenir.
 */
export interface BlogPostWithComponent extends BlogPost {
  Component: ComponentType
}

// ─── 2. GLOB İLE MODÜL YÜKLEME ───────────────────────────────────────────────

/**
 * Vite'ın import.meta.glob API'si ile tüm MDX dosyalarını BUILD ZAMANINDA yükle.
 *
 * eager: true → async Promise yerine senkron modül nesneleri döner.
 * Bu sayede loader'lar await beklemez, SSR'da hiç sorun yaşanmaz.
 *
 * Dönen yapı şu şekilde görünür:
 * {
 *   '../content/blogs/hello-world.mdx': {
 *     default: [React Component],
 *     frontmatter: { title: '...', date: '...', ... }
 *   },
 *   ...
 * }
 */
const blogModules = import.meta.glob<{
  default: ComponentType
  frontmatter: BlogFrontmatter
}>('./*.mdx', { eager: true })

// ─── 3. YARDIMCI FONKSİYONLAR ────────────────────────────────────────────────

/**
 * Dosya yolundan slug üretir.
 *
 * Örnek:
 *   '../content/blogs/hello-world.mdx' → 'hello-world'
 */
function pathToSlug(filePath: string): string {
  return filePath.split('/').pop()!.replace('.mdx', '')
}

/**
 * Ham glob verisini BlogPost dizisine dönüştüren iç yardımcı.
 * draft filtresi henüz uygulanmaz; bu karar public fonksiyonlara bırakılır.
 */
function parseAllPosts(): BlogPost[] {
  return Object.entries(blogModules).map(([path, mod]) => ({
    slug: pathToSlug(path),
    frontmatter: mod.frontmatter
  }))
}

// ─── 4. PUBLIC API ────────────────────────────────────────────────────────────

/**
 * Yayınlanmış tüm blog yazılarını tarihe göre sıralı döndürür.
 * draft: true olan yazılar otomatik olarak filtrelenir.
 *
 * Kullanım:
 *   const posts = getAllPosts()
 */
export function getAllPosts(): BlogPost[] {
  return parseAllPosts()
    .filter((post) => !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    )
}

/**
 * Slug'a göre tek bir yazıyı React component'i ile birlikte döndürür.
 * Yazı bulunamazsa veya draft ise null döner.
 *
 * Kullanım:
 *   const post = getPostBySlug('hello-world')
 *   if (!post) throw notFound()
 */
export function getPostBySlug(slug: string): BlogPostWithComponent | null {
  // Tüm path'ler içinde slug'a uyan birini bul
  const matchedPath = Object.keys(blogModules).find((path) =>
    path.endsWith(`/${slug}.mdx`)
  )

  if (!matchedPath) return null

  const mod = blogModules[matchedPath]

  // Draft yazıları detay sayfasında da gizle
  if (mod.frontmatter.draft) return null

  return {
    slug,
    frontmatter: mod.frontmatter,
    Component: mod.default
  }
}

/**
 * Belirli bir etikete sahip yazıları döndürür.
 *
 * Kullanım:
 *   const reactPosts = getPostsByTag('react')
 */
export function getPostsByTag(tag: string): BlogPost[] {
  return getAllPosts().filter((post) => post.frontmatter.tags?.includes(tag))
}

/**
 * Tüm eşsiz etiketleri alfabetik sırayla döndürür.
 * Tag cloud veya filtre UI'ı için kullanışlıdır.
 *
 * Kullanım:
 *   const tags = getAllTags() // ['mdx', 'react', 'typescript']
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  getAllPosts().forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
}

/**
 * Toplam yayınlanmış yazı sayısını döndürür.
 * Sidebar veya meta bilgiler için kullanışlıdır.
 */
export function getPostCount(): number {
  return getAllPosts().length
}
