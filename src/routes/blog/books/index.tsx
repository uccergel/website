// src/routes/books/index.tsx
import { BookCard } from '#/components/book-card'
import FilterBar from '#/components/books/filter-bar'
import StatsBar from '#/components/books/stats-bar'
import { ContentNav } from '#/components/content-nav' // ← YENİ
import type { ReadingStatus } from '#/content'
import {
  booksQueryOptions,
  filterBooks,
  getBooksStats,
  sortBooks
} from '#/lib/books'
import type { SortOption } from '#/lib/books'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/blog/books/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.prefetchQuery(booksQueryOptions),
  component: RouteComponent
})

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
        <p className="island-kicker mb-2">Blog</p>
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
