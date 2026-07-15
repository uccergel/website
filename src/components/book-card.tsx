// src/components/book-card.tsx
import { CalendarIcon, FileTextIcon } from 'lucide-react'

import { STATUS_LABELS } from '#/lib/books'
import { cn } from '#/lib/utils'
import type { Book, ReadingStatus } from '#/content'
import CoverImage from './books/cover-image'
import RatingDisplay from './books/rating-display'

// ─── 1. YARDIMCI BILEŞENLER ──────────────────────────────────────────────────

/**
 * Status badge'i için renk mapping'i.
 * Her status'ın kendi renk tonunu alması okuma deneyimini kolaylaştırır.
 */
const STATUS_STYLES: Record<ReadingStatus, string> = {
  read: 'bg-[rgba(47,106,74,0.12)] text-(--palm) border-[rgba(47,106,74,0.2)]',
  reading:
    'bg-[rgba(79,184,178,0.12)] text-(--lagoon-deep) border-[rgba(79,184,178,0.2)]',
  'want-to-read':
    'bg-[rgba(23,58,64,0.08)] text-(--sea-ink-soft) border-(--line)'
}

// ─── 2. ANA BILEŞEN ──────────────────────────────────────────────────

interface BookCardProps {
  book: Book
  index?: number // animasyon gecikmesi için
}

export function BookCard({ book, index = 0 }: BookCardProps) {
  return (
    <article
      className="island-shell feature-card rise-in flex gap-4 rounded-2xl p-4"
      style={{ animationDelay: `${index * 60 + 80}ms` }}
    >
      {/* ── Kapak Görseli ─────────────────────────────────────── */}
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg border border-(--line) shadow-sm">
        <CoverImage isbn={book.isbn} title={book.title} />
      </div>

      {/* ── İçerik ────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Başlık + Yazar */}
        <div>
          <h2 className="truncate text-sm font-semibold leading-snug text-(--sea-ink)">
            {book.title}
          </h2>
          <p className="truncate text-xs text-(--sea-ink-soft)">
            {book.author}
          </p>
        </div>

        {/* Puan */}
        <RatingDisplay rating={book.rating} />

        {/* Status Badge + Meta */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              'island-kicker inline-flex items-center rounded-full border px-2 py-0.5 text-[0.6rem]',
              STATUS_STYLES[book.status]
            )}
          >
            {STATUS_LABELS[book.status]}
          </span>

          {/* Yayın yılı */}
          {book.publishYear && (
            <span className="flex items-center gap-1 text-xs text-(--sea-ink-soft)">
              <CalendarIcon className="size-3" />
              {book.publishYear}
            </span>
          )}

          {/* Sayfa sayısı */}
          {book.pageCount && (
            <span className="flex items-center gap-1 text-xs text-(--sea-ink-soft)">
              <FileTextIcon className="size-3" />
              {book.pageCount} sayfa
            </span>
          )}
        </div>

        {/* Kişisel Not */}
        {book.note && (
          <p className="line-clamp-2 text-xs leading-relaxed text-(--sea-ink-soft)">
            "{book.note}"
          </p>
        )}

        {/* Bitiş Tarihi — sadece okunanlar için */}
        {book.finishedAt && book.status === 'read' && (
          <p className="text-xs text-(--sea-ink-soft)">
            Bitirildi:{' '}
            <span className="font-medium">
              {formatFinishedAt(book.finishedAt)}
            </span>
          </p>
        )}
      </div>
    </article>
  )
}

// ─── 4. YARDIMCI FONKSİYONLAR ────────────────────────────────────────────────

/**
 * "2024-03" formatını "Mart 2024" olarak formatlar.
 * Intl.DateTimeFormat kullanır — harici bağımlılık gerektirmez.
 */
function formatFinishedAt(finishedAt: string): string {
  // "2024-03" → "2024-03-01" — Date parse için gün ekliyoruz
  const date = new Date(`${finishedAt}-01`)

  return new Intl.DateTimeFormat('tr-TR', {
    year: 'numeric',
    month: 'long'
  }).format(date)
}
