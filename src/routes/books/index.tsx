import { BookCard } from '#/components/book-card'
import type { ReadingStatus } from '#/content/books'
import {
  booksQueryOptions,
  filterBooks,
  getBooksStats,
  SORT_LABELS,
  sortBooks,
  STATUS_LABELS,
} from '#/lib/books'
import type { SortOption } from '#/lib/books'
import { cn } from '#/lib/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/books/')({
  /**
   * Loader, component render edilmeden önce çalışır.
   * ensureQueryData:
   *   - Cache doluysa → anında döner (0ms)
   *   - Cache boşsa → fetchBooksMetadata çağrılır, cache doldurulur
   *
   * context.queryClient root route'da tanımlı, oradan geliyor.
   */
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(booksQueryOptions),
  component: RouteComponent,
})

// ─── 2. TİP SABİTLERİ ────────────────────────────────────────────────────────

// Filtre butonları için sıra — 'all' her zaman ilk
const STATUS_FILTER_KEYS: Array<ReadingStatus | 'all'> = [
  'all',
  'read',
  'reading',
  'want-to-read',
]

// ─── 3. ALT BİLEŞENLER ───────────────────────────────────────────────────────

interface FilterBarProps {
  activeStatus: ReadingStatus | 'all'
  onStatusChange: (status: ReadingStatus | 'all') => void
  activeSortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

/**
 * Filtre pill'leri ve sıralama seçimi.
 * Kendi state'i yok — tamamen kontrollü bileşen (controlled component).
 */
function FilterBar({
  activeStatus,
  onStatusChange,
  activeSortBy,
  onSortChange,
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
              // Taban stil — her butonda var
              'island-kicker rounded-full border px-3 py-1 text-[0.65rem] transition-all',
              // Aktif durum
              activeStatus === status
                ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.15)] text-(--lagoon-deep)'
                : 'border-(--chip-line) bg-(--chip-bg) text-(--sea-ink-soft) hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)',
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      {/* Sıralama Seçimi */}
      <div className="flex items-center gap-2">
        <span className="island-kicker text-(--sea-ink-soft)">Sırala:</span>
        <select
          value={activeSortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={cn(
            'rounded-full border border-(--chip-line) bg-(--chip-bg)',
            'px-3 py-1 text-xs font-semibold text-(--sea-ink)',
            'outline-none transition-colors',
            'hover:border-(--lagoon-deep) focus:border-(--lagoon-deep)',
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

/**
 * Sayfa başlığının altında gösterilen özet istatistikler.
 * Sayıları görsel olarak bölen "·" ayırıcılar kullanır.
 */
function StatsBar({
  total,
  read,
  reading,
  wantToRead,
  averageRating,
}: StatsBarProps) {
  const stats = [
    { label: 'kitap', value: total },
    { label: 'okundu', value: read },
    { label: 'okunuyor', value: reading },
    { label: 'okunacak', value: wantToRead },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-(--sea-ink-soft)">
      {stats.map((stat, i) => (
        <span key={stat.label} className="flex items-center gap-1">
          {/* İlk item'dan önce ayırıcı yok */}
          {i > 0 && (
            <span className="text-(--line)" aria-hidden="true">
              ·
            </span>
          )}
          <span className="font-semibold text-(--sea-ink)">{stat.value}</span>
          {stat.label}
        </span>
      ))}

      {/* Ortalama puan — sadece en az 1 puanlama varsa */}
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

// ─── 4. ANA SAYFA BİLEŞENİ ───────────────────────────────────────────────────

function RouteComponent() {
  // Loader zaten cache'i doldurdu — bu çağrı senkron, bekleme yok
  const { data: allBooks } = useSuspenseQuery(booksQueryOptions)

  // Filtre ve sıralama state'leri — sadece UI'a ait, URL'e taşımak gerekmiyor
  const [activeStatus, setActiveStatus] = useState<ReadingStatus | 'all'>('all')
  const [activeSortBy, setActiveSortBy] = useState<SortOption>('finishedAt')

  // Saf fonksiyonlar — her render'da yeniden hesaplanır
  // useMemo'ya gerek yok: bookEntries küçük, hesaplama çok ucuz
  const filteredBooks = filterBooks(allBooks, activeStatus)
  const sortedBooks = sortBooks(filteredBooks, activeSortBy)
  const stats = getBooksStats(allBooks) // istatistikler her zaman tüm kitaba göre

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {/* ── Sayfa Başlığı ─────────────────────────────────────── */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <p className="island-kicker mb-2">Kitaplık</p>
        <h1 className="display-title text-4xl font-bold text-(--sea-ink) sm:text-5xl">
          Kitaplarım
        </h1>
        <p className="mt-3 max-w-xl text-base leading-8 text-(--sea-ink-soft)">
          Okuduğum, okuduğum ve okumak istediğim kitaplar.
        </p>
        <div className="mt-4">
          <StatsBar {...stats} />
        </div>
      </section>

      {/* ── Filtre + Sıralama ─────────────────────────────────── */}
      <section className="mt-6">
        <FilterBar
          activeStatus={activeStatus}
          onStatusChange={setActiveStatus}
          activeSortBy={activeSortBy}
          onSortChange={setActiveSortBy}
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
        // Boş durum — seçilen filtreye uyan kitap yoksa
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
