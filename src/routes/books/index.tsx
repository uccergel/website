// src/routes/books/index.tsx
import { BookCard } from '#/components/book-card'
import type { ReadingStatus } from '#/content/books'
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

export const Route = createFileRoute('/books/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(booksQueryOptions),
  component: RouteComponent
})

// ─── Tip Sabitleri ─────────────────────────────────────────────────────────────

const STATUS_FILTER_KEYS: Array<ReadingStatus | 'all'> = [
  'all',
  'read',
  'reading',
  'want-to-read'
]

// Her status için renk tokeni — book-card.tsx ile birebir aynı
const STATUS_ACTIVE_STYLES: Record<ReadingStatus | 'all', string> = {
  all: 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.15)] text-(--lagoon-deep)',
  read: 'border-[rgba(47,106,74,0.4)] bg-[rgba(47,106,74,0.1)] text-(--palm)',
  reading:
    'border-[rgba(79,184,178,0.4)] bg-[rgba(79,184,178,0.1)] text-(--lagoon-deep)',
  'want-to-read':
    'border-(--line) bg-[rgba(23,58,64,0.06)] text-(--sea-ink-soft)'
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────

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
  // Her istatistik için renk + label
  const stats = [
    {
      value: total,
      label: 'kitap',
      color: 'text-(--sea-ink)'
    },
    {
      value: read,
      label: 'okundu',
      color: 'text-(--palm)'
    },
    {
      value: reading,
      label: 'okunuyor',
      color: 'text-(--lagoon-deep)'
    },
    {
      value: wantToRead,
      label: 'okunacak',
      color: 'text-(--sea-ink-soft)'
    }
  ] as const

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
      {stats.map((stat, i) => (
        <span key={stat.label} className="flex items-center gap-1.5 text-sm">
          {i > 0 && (
            <span className="text-(--line)" aria-hidden="true">
              ·
            </span>
          )}
          <span className={cn('text-lg font-bold', stat.color)}>
            {stat.value}
          </span>
          <span className="text-(--sea-ink-soft)">{stat.label}</span>
        </span>
      ))}

      {averageRating !== null && (
        <span className="flex items-center gap-1.5 text-sm">
          <span className="text-(--line)" aria-hidden="true">
            ·
          </span>
          <span className="font-bold text-amber-500">★ {averageRating}</span>
          <span className="text-(--sea-ink-soft)">ort. puan</span>
        </span>
      )}
    </div>
  )
}

// ─── FilterBar ────────────────────────────────────────────────────────────────

interface FilterBarProps {
  activeStatus: ReadingStatus | 'all'
  onStatusChange: (status: ReadingStatus | 'all') => void
  activeSortBy: SortOption
  onSortChange: (sort: SortOption) => void
  counts: Record<ReadingStatus | 'all', number>
}

function FilterBar({
  activeStatus,
  onStatusChange,
  activeSortBy,
  onSortChange,
  counts
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Status Filtreleri */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTER_KEYS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={cn(
              'island-kicker cursor-pointer rounded-full border px-3 py-1 text-[0.65rem] transition-all',
              activeStatus === status
                ? STATUS_ACTIVE_STYLES[status]
                : 'border-(--chip-line) bg-(--chip-bg) text-(--sea-ink-soft) hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)'
            )}
          >
            {STATUS_LABELS[status]} ({counts[status]})
          </button>
        ))}
      </div>

      {/* Sıralama */}
      <div className="flex items-center gap-2">
        <span className="island-kicker text-(--sea-ink-soft)">Sırala:</span>
        <select
          value={activeSortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={cn(
            'cursor-pointer rounded-full border border-(--chip-line) bg-(--chip-bg)',
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

// ─── Ana Bileşen ──────────────────────────────────────────────────────────────

function RouteComponent() {
  const { data: allBooks } = useSuspenseQuery(booksQueryOptions)

  const [activeStatus, setActiveStatus] = useState<ReadingStatus | 'all'>('all')
  const [activeSortBy, setActiveSortBy] = useState<SortOption>('finishedAt')

  const filteredBooks = filterBooks(allBooks, activeStatus)
  const sortedBooks = sortBooks(filteredBooks, activeSortBy)
  const stats = getBooksStats(allBooks)

  // FilterBar'a her status'un kaç kitabı olduğunu ilet
  const counts: Record<ReadingStatus | 'all', number> = {
    all: allBooks.length,
    read: allBooks.filter((b) => b.status === 'read').length,
    reading: allBooks.filter((b) => b.status === 'reading').length,
    'want-to-read': allBooks.filter((b) => b.status === 'want-to-read').length
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <p className="island-kicker mb-2">Kitaplık</p>
        <h1 className="display-title text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Kitaplarım
        </h1>
        <p className="mt-3 max-w-xl text-base leading-8 text-(--sea-ink-soft)">
          Okuduğum, okuduğum ve okumak istediğim kitaplar.
        </p>
        <StatsBar {...stats} />
      </section>

      {/* ── Filtre + Sıralama ─────────────────────────────────── */}
      <section className="mt-6">
        <FilterBar
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          activeSortBy={activeSortBy}
          onSortChange={setActiveSortBy}
          counts={counts}
        />
      </section>

      {/* ── Kitap Grid'i ──────────────────────────────────────── */}
      {sortedBooks.length > 0 ? (
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {sortedBooks.map((book, index) => (
            <BookCard key={book.isbn} book={book} index={index} />
          ))}
        </section>
      ) : (
        <section className="island-shell mt-6 rounded-2xl p-12 text-center">
          <span className="block text-3xl" aria-hidden="true">
            📚
          </span>
          <p className="mt-3 text-sm text-(--sea-ink-soft)">
            Bu kategoride henüz kitap yok.
          </p>
        </section>
      )}
    </main>
  )
}
