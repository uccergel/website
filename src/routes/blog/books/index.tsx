// src/routes/books/index.tsx
import { BookCard } from '#/components/book-card'
import { ContentNav } from '#/components/content-nav' // ← YENİ
import type { ReadingStatus } from '#/content'
import {
  booksQueryOptions,
  filterBooks,
  getBooksStats,
  SORT_LABELS,
  sortBooks,
  STATUS_LABELS
} from '#/lib/books'
import type { SortOption } from '#/lib/books'
import { cn } from '#/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/blog/books/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(booksQueryOptions),
  component: RouteComponent
})

const STATUS_FILTER_KEYS: Array<ReadingStatus | 'all'> = [
  'all',
  'read',
  'reading',
  'want-to-read'
]

interface FilterBarProps {
  activeStatus: ReadingStatus | 'all'
  onStatusChange: (status: ReadingStatus | 'all') => void
  activeSortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

function FilterBar({
  activeStatus,
  onStatusChange,
  activeSortBy,
  onSortChange
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTER_KEYS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={cn(
              'island-kicker rounded-full border px-3 py-1 text-[0.65rem] transition-all',
              activeStatus === status
                ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.15)] text-(--lagoon-deep)'
                : 'border-(--chip-line) bg-(--chip-bg) text-(--sea-ink-soft) hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)'
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="island-kicker text-(--sea-ink-soft)">Sırala:</span>
        <select
          value={activeSortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={cn(
            'rounded-full border border-(--chip-line) bg-(--chip-bg)',
            'px-3 py-1 text-xs font-semibold text-(--sea-ink)',
            'outline-none transition-colors',
            'hover:border-(--lagoon-deep) focus:border-(--lagoon-deep)'
          )}
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

interface StatsBarProps {
  total: number
  read: number
  reading: number
  wantToRead: number
  averageRating: number | null
}

function StatsBar({
  total,
  read,
  reading,
  wantToRead,
  averageRating
}: StatsBarProps) {
  const stats = [
    { label: 'kitap', value: total },
    { label: 'okundu', value: read },
    { label: 'okunuyor', value: reading },
    { label: 'okunacak', value: wantToRead }
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-(--sea-ink-soft)">
      {stats.map((stat, i) => (
        <span key={stat.label} className="flex items-center gap-1">
          {i > 0 && (
            <span className="text-(--line)" aria-hidden="true">
              ·
            </span>
          )}
          <span className="font-semibold text-(--sea-ink)">{stat.value}</span>
          {stat.label}
        </span>
      ))}
      {averageRating !== null && (
        <span className="flex items-center gap-1">
          <span className="text-(--line)" aria-hidden="true">
            ·
          </span>
          <span className="font-semibold text-(--sea-ink)">
            ★ {averageRating}
          </span>
          ort. puan
        </span>
      )}
    </div>
  )
}

function RouteComponent() {
  const { data: allBooks } = useSuspenseQuery(booksQueryOptions)
  const [activeStatus, setActiveStatus] = useState<ReadingStatus | 'all'>('all')
  const [activeSortBy, setActiveSortBy] = useState<SortOption>('finishedAt')

  const filteredBooks = filterBooks(allBooks, activeStatus)
  const sortedBooks = sortBooks(filteredBooks, activeSortBy)
  const stats = getBooksStats(allBooks)

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {/* ── Sekme Navigasyonu ─────────────────────────────── */}
      <ContentNav /> {/* ← YENİ */}
      {/* ── Sayfa Başlığı ─────────────────────────────────── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <h1 className="display-title text-4xl sm:text-5xl text-(--sea-ink) mb-2">
          Kitaplık
        </h1>
        <p className="mt-3 max-w-xl text-base leading-8 text-(--sea-ink-soft)">
          Okuduğum, okumak istediğim kitaplar.
        </p>
        <div className="mt-4">
          <StatsBar {...stats} />
        </div>
      </section>
      <section className="mt-6">
        <FilterBar
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          activeSortBy={activeSortBy}
          onSortChange={setActiveSortBy}
        />
      </section>
      {sortedBooks.length > 0 ? (
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {sortedBooks.map((book, index) => (
            <BookCard key={book.isbn} book={book} index={index} />
          ))}
        </section>
      ) : (
        <section className="island-shell mt-6 rounded-2xl p-12 text-center">
          <p className="text-(--sea-ink-soft)">
            <span className="block text-2xl">📚</span>
            <span className="mt-2 block text-sm">
              Bu kategoride henüz kitap yok.
            </span>
          </p>
        </section>
      )}
    </main>
  )
}
