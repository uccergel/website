import { BOOKMARK_COLLECTIONS } from '#/config/bookmarks'
import { getRaindropsByCollections } from '#/lib/raindrop'
import type { Raindrop } from '#/lib/raindrop'
import { createFileRoute } from '@tanstack/react-router'
import { ExternalLinkIcon } from 'lucide-react'

// ─── LOADER ──────────────────────────────────────────────────────────────────
// Tüm koleksiyonları paralel olarak sunucu tarafında fetch ediyoruz.
// getRaindropsByCollections zaten Promise.all kullandığı için performanslı.

export const Route = createFileRoute('/bookmarks/')({
  loader: async () => {
    const groups = await getRaindropsByCollections(BOOKMARK_COLLECTIONS)
    return { groups }
  },
  component: RouteComponent,
  // errorComponent: BookmarksError,
})

function RouteComponent() {
  const { groups } = Route.useLoaderData()
  console.log('[DEBUG] groups:', groups)
  console.log('[DEBUG] groups[0]?.items:', groups[0]?.items)
  console.log('[DEBUG] items length:', groups[0]?.items?.length)

  const totalCount = groups.reduce((acc, col) => acc + col.items.length, 0)

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {/* Sayfa Başlığı */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <p className="island-kicker mb-2">Yer İmleri</p>
        <h1 className="display-title text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Takip Ettiklerim
        </h1>
        <p className="mt-3 max-w-xl text-base leading-8 text-(--sea-ink-soft)">
          Düzenli olarak takip ettiğim siteler, araçlar ve kaynaklar.
        </p>
        <span className="island-kicker mt-4 block text-xs">
          {/* {totalCount} bağlantı · {collections.length} koleksiyon */}
          {totalCount} bağlantı · {groups.length} koleksiyon
        </span>
      </section>

      {groups.map((group) => (
        <section key={group.id} className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-(--sea-ink)">
            {group.emoji} {group.label}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Koleksiyonun bağlantıları */}
            {group.items.map((item) => (
              <a
                key={item._id}
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="island-shell feature-card rise-in block rounded-2xl p-4 no-underline"
              >
                <p className="font-medium text-(--sea-ink)">{item.title}</p>
                <p className="mt-1 text-sm text-(--sea-ink-soft)">
                  {item.domain}
                </p>
                {item.excerpt && (
                  <p className="mt-2 line-clamp-2 text-xs text-(--sea-ink-soft)">
                    {item.excerpt}
                  </p>
                )}
              </a>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}
