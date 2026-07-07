// src/routes/bookmarks/index.tsx
import { BOOKMARK_COLLECTIONS } from '#/config/bookmarks'
import { getRaindropsByCollections } from '#/lib/raindrop'
import { createFileRoute } from '@tanstack/react-router'
import { ExternalLinkIcon } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/bookmarks/')({
  loader: async () => {
    const groups = await getRaindropsByCollections(BOOKMARK_COLLECTIONS)
    return { groups }
  },
  component: RouteComponent
})

// ─── Favicon Bileşeni ─────────────────────────────────────────────────────────
// Google'ın kamuya açık favicon servisi kullanılır.
// Favicon yüklenemezse domain'in baş harfi fallback olarak gösterilir.

interface FaviconProps {
  domain: string
}

function Favicon({ domain }: FaviconProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <span className="text-xs font-bold text-(--sea-ink-soft) uppercase">
        {domain.charAt(0)}
      </span>
    )
  }

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
      alt=""
      aria-hidden="true"
      width={16}
      height={16}
      className="size-4"
      onError={() => setHasError(true)}
    />
  )
}

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────

function RouteComponent() {
  const { groups } = Route.useLoaderData()
  const totalCount = groups.reduce((acc, col) => acc + col.items.length, 0)

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <p className="island-kicker mb-2">Yer İmleri</p>
        <h1 className="display-title text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Takip Ettiklerim
        </h1>
        <p className="mt-3 max-w-xl text-base leading-8 text-(--sea-ink-soft)">
          Düzenli olarak takip ettiğim siteler, araçlar ve kaynaklar.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="island-kicker">{totalCount} bağlantı</span>
          <span className="text-(--line)" aria-hidden="true">
            ·
          </span>
          <span className="island-kicker">{groups.length} koleksiyon</span>
        </div>
      </section>

      {/* ── Koleksiyonlar ─────────────────────────────────────── */}
      <div className="mt-8 flex flex-col gap-10">
        {groups.map((group) => (
          <section key={group.id}>
            {/* Koleksiyon Başlığı */}
            <div className="mb-4 flex items-center gap-2">
              {group.emoji && (
                <span className="text-xl leading-none" aria-hidden="true">
                  {group.emoji}
                </span>
              )}
              <h2 className="text-lg font-semibold text-(--sea-ink)">
                {group.label}
              </h2>
              {/* Yazı sayısı badge */}
              <span className="island-kicker rounded-full border border-(--chip-line) bg-(--chip-bg) px-2 py-0.5 text-[0.6rem]">
                {group.items.length}
              </span>
            </div>

            {/* Bağlantı Kartları */}
            <div className="grid gap-3 sm:grid-cols-2">
              {group.items.map((item) => (
                <a
                  key={item._id}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="island-shell feature-card group flex items-start gap-3 rounded-2xl p-4 no-underline"
                >
                  {/* Favicon kutusu */}
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-(--line) bg-(--sand)">
                    <Favicon domain={item.domain} />
                  </div>

                  {/* İçerik */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-medium text-(--sea-ink) transition-colors group-hover:text-(--lagoon-deep)">
                        {item.title}
                      </p>
                      {/* Hover'da görünür external link ikonu */}
                      <ExternalLinkIcon className="mt-0.5 size-3.5 shrink-0 text-(--sea-ink-soft) opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>

                    <p className="text-xs text-(--sea-ink-soft)">
                      {item.domain}
                    </p>

                    {item.excerpt && (
                      <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-(--sea-ink-soft)">
                        {item.excerpt}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
