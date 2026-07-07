import { getAllPosts } from '#/lib/blog'
import type { BlogPost } from '#/lib/blog'
import { cn } from '#/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/blogs/')({
  loader: () => getAllPosts(),
  component: RouteComponent
})

interface BlogCardProps {
  post: BlogPost
  index: number
}

function BlogCard({ post, index }: BlogCardProps) {
  return (
    <Link
      to="/blogs/$slug"
      params={{ slug: post.slug }}
      className="island-shell feature-card rise-in block rounded-2xl p-6 no-underline"
      style={{ animationDelay: `${index * 90 + 80}ms` }}
    >
      {/* Etiketler */}
      {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="island-kicker rounded-full bg-(--chip-bg) px-3 py-0.5 text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {/* Başlık */}
      <h2 className="mb-2 flex-1 text-base font-semibold leading-snug text-(--sea-ink) transition-colors group-hover:text-(--lagoon-deep)">
        {post.frontmatter.title}
      </h2>
      {/* Açıklama — 2 satırda kesilir */}
      <p className="line-clamp-2 text-sm leading-relaxed text-(--sea-ink-soft)">
        {post.frontmatter.description}
      </p>
      {/* Alt meta — ince separator üstünde */}
      <div className="mt-4 flex items-center justify-between border-t border-(--line) pt-4">
        <time
          dateTime={post.frontmatter.date}
          className="text-xs text-(--sea-ink-soft)"
        >
          {new Date(post.frontmatter.date).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>

        {/* Sadece hover'da görünür — opacity transition */}
        <span className="text-xs font-semibold text-(--lagoon-deep) opacity-0 transition-opacity group-hover:opacity-100">
          Devamını oku →
        </span>
      </div>
    </Link>
  )
}

// Ana Sayfa Bileşeni

function RouteComponent() {
  // loader'dan gelen tip-güvenli veri — BlogPost[]
  const posts = Route.useLoaderData()
  const [activeTag, setActiveTag] = useState<string | null>(null)

  // Tüm benzersiz etiketleri alfabetik sırala
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.frontmatter.tags ?? []))
  ).sort()

  // Aktif etikete göre filtrele
  const filteredPosts =
    activeTag !== null
      ? posts.filter((p) => p.frontmatter.tags?.includes(activeTag))
      : posts

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <p className="island-kicker mb-2">Blog</p>
        <h1 className="display-title text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Yazılarım
        </h1>
        <p className="mt-3 max-w-xl text-base leading-8 text-(--sea-ink-soft)">
          Yazılım, kimya mühendisliği ve öğrendiklerim üzerine notlar.
        </p>
        <span className="island-kicker mt-4 block text-xs">
          {posts.length} yazı
        </span>
      </section>

      {/* ── Tag Filtre Bar ───────────────────────────────────── */}
      {allTags.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {/* "Tümü" butonu — activeTag null ise aktif */}
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              'island-kicker cursor-pointer rounded-full border px-3 py-1 text-[0.65rem] transition-all',
              activeTag === null
                ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.15)] text-(--lagoon-deep)'
                : 'border-(--chip-line) bg-(--chip-bg) text-(--sea-ink-soft) hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)'
            )}
          >
            Tümü ({posts.length})
          </button>

          {allTags.map((tag) => {
            const count = posts.filter((p) =>
              p.frontmatter.tags?.includes(tag)
            ).length

            return (
              <button
                key={tag}
                type="button"
                // Aynı tag'e tekrar basılırsa filtreyi kaldır
                onClick={() =>
                  setActiveTag((prev) => (prev === tag ? null : tag))
                }
                className={cn(
                  'island-kicker cursor-pointer rounded-full border px-3 py-1 text-[0.65rem] transition-all',
                  activeTag === tag
                    ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.15)] text-(--lagoon-deep)'
                    : 'border-(--chip-line) bg-(--chip-bg) text-(--sea-ink-soft) hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)'
                )}
              >
                {tag} ({count})
              </button>
            )
          })}
        </div>
      )}

      {/* ── Yazı Kartları ────────────────────────────────────── */}
      {filteredPosts.length > 0 ? (
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {filteredPosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </section>
      ) : (
        <section className="island-shell mt-6 rounded-2xl p-12 text-center">
          <span className="block text-3xl" aria-hidden="true">
            ✍️
          </span>
          <p className="mt-3 text-sm text-(--sea-ink-soft)">
            Bu etikette henüz yazı yok.
          </p>
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className="island-kicker mt-4 cursor-pointer rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1 text-[0.65rem] text-(--sea-ink-soft) transition-all hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)"
          >
            Tüm yazıları göster
          </button>
        </section>
      )}
    </main>
  )
}
