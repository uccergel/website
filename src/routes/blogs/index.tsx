import { getAllPosts } from '#/lib/blog'
import type { BlogPost } from '#/lib/blog'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/blogs/')({
  loader: () => getAllPosts(),
  component: RouteComponent,
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
      <h2 className="mb-2 text-lg font-semibold text-(--sea-ink)">
        {post.frontmatter.title}
      </h2>
      {/* Açıklama — 2 satırda kesilir */}
      <p className="m-0 line-clamp-2 text-sm leading-relaxed text-(--sea-ink-soft)">
        {post.frontmatter.description}
      </p>
      {/* Tarih */}
      <p className="mt-4 text-xs text-(--sea-ink-soft)">
        {new Date(post.frontmatter.date).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
    </Link>
  )
}

// Ana Sayfa Bileşeni

function RouteComponent() {
  // loader'dan gelen tip-güvenli veri — BlogPost[]
  const posts = Route.useLoaderData()
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {/* Sayfa Başlığı */}
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

      {/* Yazı Kartları */}
      {posts.length > 0 ? (
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {posts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </section>
      ) : (
        // Boş durum — henüz yazı yoksa gösterilir
        <section className="island-shell mt-8 rounded-2xl p-12 text-center">
          <p className="text-(--sea-ink-soft)">
            Henüz yazı yok. Yakında görüşürüz!
          </p>
        </section>
      )}
    </main>
  )
}
