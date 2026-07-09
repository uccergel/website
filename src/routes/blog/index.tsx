// src/routes/blog/index.tsx
import { createFileRoute, Link } from '@tanstack/react-router'
import { ContentNav } from '#/components/content-nav'
import { booksQueryOptions } from '#/lib/books'
import { getCoverUrl } from '#/lib/openLibrary'
import { getRaindropsByCollection } from '#/lib/raindrop'
import { BOOKMARK_COLLECTIONS, getAllPosts } from '#/content'

export const Route = createFileRoute('/blog/')({
  loader: async ({ context: { queryClient } }) => {
    const [books, bookmarks] = await Promise.all([
      queryClient.ensureQueryData(booksQueryOptions),
      getRaindropsByCollection(BOOKMARK_COLLECTIONS[0].id)
    ])

    return {
      // getAllPosts() senkron — await gerektirmez
      recentPosts: getAllPosts().slice(0, 3),
      recentBooks: books.slice(0, 3),
      recentBookmarks: bookmarks.slice(0, 3)
    }
  },
  component: BlogHubPage
})

function BlogHubPage() {
  const { recentPosts, recentBooks, recentBookmarks } = Route.useLoaderData()

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <ContentNav />

      {/* Hero */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <p className="island-kicker mb-3">İçerik</p>
        <h1 className="display-title text-3xl font-bold text-(--sea-ink) sm:text-4xl">
          Blog
        </h1>
        <p className="mt-3 max-w-xl leading-8 text-(--sea-ink-soft)">
          Yazılar, kitaplar ve takip ettiğim kaynakların bir araya geldiği yer.
        </p>
      </section>

      {/* ── Son Yazılar ───────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-(--sea-ink)">Son Yazılar</h2>
        <Link
          to="/blog/posts"
          className="island-kicker text-xs transition-opacity hover:opacity-70"
        >
          Tümünü Gör →
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {recentPosts.map((post, i) => (
          <Link
            key={post.slug}
            to="/blog/posts/$slug"
            params={{ slug: post.slug }}
            className="island-shell feature-card rise-in block rounded-2xl p-5 no-underline"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {post.frontmatter.tags?.[0] && (
              <span className="island-kicker mb-2 block text-[0.6rem]">
                {post.frontmatter.tags[0]}
              </span>
            )}
            <h3 className="text-sm font-semibold leading-snug text-(--sea-ink)">
              {post.frontmatter.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-(--sea-ink-soft)">
              {post.frontmatter.description}
            </p>
            <time
              dateTime={post.frontmatter.date}
              className="mt-3 block text-xs text-(--sea-ink-soft)"
            >
              {new Date(post.frontmatter.date).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
          </Link>
        ))}
      </div>

      {/* ── Son Kitaplar ──────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-(--sea-ink)">Son Kitaplar</h2>
        <Link
          to="/blog/books"
          className="island-kicker text-xs transition-opacity hover:opacity-70"
        >
          Tümünü Gör →
        </Link>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {recentBooks.map((book, i) => (
          <div
            key={book.isbn}
            className="island-shell feature-card rise-in flex gap-3 rounded-2xl p-4"
            style={{ animationDelay: `${i * 80 + 240}ms` }}
          >
            {/* getCoverUrl sadece URL üretir, fetch yapmaz */}
            <img
              src={getCoverUrl(book.isbn, 'S')}
              alt={`${book.title} kapak`}
              className="h-16 w-11 shrink-0 rounded object-cover shadow-sm"
            />
            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="truncate text-sm font-semibold text-(--sea-ink)">
                {book.title}
              </p>
              <p className="text-xs text-(--sea-ink-soft)">{book.author}</p>
              {book.publishYear && (
                <p className="text-xs text-(--sea-ink-soft)">
                  {book.publishYear}
                </p>
              )}
              {book.pageCount && (
                <p className="text-xs text-(--sea-ink-soft)">
                  {book.pageCount} sayfa
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Son Yer İmleri ────────────────────────────────────── */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-(--sea-ink)">
          Son Yer İmleri
        </h2>
        <Link
          to="/blog/bookmarks"
          className="island-kicker text-xs transition-opacity hover:opacity-70"
        >
          Tümünü Gör →
        </Link>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {recentBookmarks.map((item, i) => (
          <Link
            key={item._id}
            to={item.link}
            target="_blank"
            rel="noreferrer"
            className="island-shell feature-card rise-in block rounded-2xl p-4 no-underline"
            style={{ animationDelay: `${i * 80 + 480}ms` }}
          >
            <p className="text-sm font-medium text-(--sea-ink)">{item.title}</p>
            <p className="mt-1 text-xs text-(--sea-ink-soft)">{item.domain}</p>
            {item.excerpt && (
              <p className="mt-2 line-clamp-2 text-xs text-(--sea-ink-soft)">
                {item.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  )
}
