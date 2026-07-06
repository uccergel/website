// src/lib/books.ts
import { queryOptions } from '@tanstack/react-query'

import { bookEntries } from '#/content/books'
import { fetchBooksMetadata } from '#/lib/openlibrary'
import type { Book, ReadingStatus } from '#/content/books'

// ─── 1. QUERY OPTIONS ────────────────────────────────────────────────────────

/**
 * Tüm kitaplar için merkezi query tanımı.
 *
 * Bu nesne hem server-side loader'da (prefetch için)
 * hem de client-side component'te (useSuspenseQuery için) kullanılır.
 *
 * Veri akışı:
 * 1. Loader çalışır → queryClient.prefetchQuery(booksQueryOptions)
 * 2. SSR sırasında queryFn tetiklenir → Open Library API çağrısı
 * 3. Sonuç dehydrate edilir → client'a gönderilir
 * 4. Client'ta useSuspenseQuery → cache'den okur, API çağrısı yapmaz
 * 5. staleTime dolarsa → client doğrudan Open Library'ye istek atar
 *    (Open Library public API, CORS destekler)
 */
export const booksQueryOptions = queryOptions({
  queryKey: ['books'] as const,
  queryFn: async (): Promise<Book[]> => {
    // Tüm ISBN'leri topla — tek bir API isteği için
    const isbns = bookEntries.map((entry) => entry.isbn)
    const metadata = await fetchBooksMetadata(isbns)

    // Her local BookEntry'yi karşılık gelen API verisiyle birleştir
    // fetchBooksMetadata, bulunamayan ISBN'ler için de fallback döndürür
    // bu yüzden metadata[entry.isbn] her zaman tanımlıdır
    return bookEntries.map((entry) => ({
      ...entry,
      ...metadata[entry.isbn]!,
    }))
  },
  // Kitap metadata'sı nadiren değişir — 24 saat boyunca taze say
  // Bu değer, gereksiz API çağrılarını önler
  staleTime: 1000 * 60 * 60 * 24,
})

// ─── 2. FİLTRELEME ───────────────────────────────────────────────────────────

/**
 * Kitapları okuma durumuna göre filtreler.
 * 'all' seçilirse tüm kitapları döndürür.
 *
 * Pure function — React state'e bağımlı değil.
 * Hem loader hem component içinde güvenle çağrılabilir.
 */
export function filterBooks(
  books: Book[],
  status: ReadingStatus | 'all',
): Book[] {
  if (status === 'all') return books
  return books.filter((book) => book.status === status)
}

// ─── 3. SIRALAMA ─────────────────────────────────────────────────────────────

export type SortOption = 'finishedAt' | 'rating' | 'title'

/**
 * Kitapları verilen kritere göre sıralar.
 *
 * Önemli: [...books] ile önce kopyalıyoruz.
 * Array.sort() orijinal diziyi mutate eder — bu TanStack Query
 * cache'inde beklenmedik davranışlara yol açabilir.
 */
export function sortBooks(books: Book[], sortBy: SortOption): Book[] {
  return [...books].sort((a, b) => {
    switch (sortBy) {
      case 'finishedAt':
        // null değerler (henüz bitmemiş) listenin sonuna gider
        if (!a.finishedAt && !b.finishedAt) return 0
        if (!a.finishedAt) return 1
        if (!b.finishedAt) return -1
        // "YYYY-MM" formatı lexicographic karşılaştırmaya uygundur
        // "2024-03" > "2023-11" doğru çalışır
        return b.finishedAt.localeCompare(a.finishedAt)

      case 'rating':
        // null puan (değerlendirilmemiş) sona gider, en yüksek puan üste
        return (b.rating ?? 0) - (a.rating ?? 0)

      case 'title':
        // Türkçe karakter sıralaması için locale belirt
        return a.title.localeCompare(b.title, 'tr')
    }
  })
}

// ─── 4. İSTATİSTİKLER ────────────────────────────────────────────────────────

export interface BookStats {
  total: number
  read: number
  reading: number
  wantToRead: number
  averageRating: number | null // hiç puanlama yoksa null
}

/**
 * Kitaplık istatistiklerini hesaplar.
 * Sidebar veya sayfa başlığında özet göstermek için kullanılır.
 */
export function getBooksStats(books: Book[]): BookStats {
  const ratedBooks = books.filter((b) => b.rating !== null)

  const averageRating =
    ratedBooks.length > 0
      ? ratedBooks.reduce((sum, b) => sum + (b.rating ?? 0), 0) /
        ratedBooks.length
      : null

  return {
    total: books.length,
    read: books.filter((b) => b.status === 'read').length,
    reading: books.filter((b) => b.status === 'reading').length,
    wantToRead: books.filter((b) => b.status === 'want-to-read').length,
    // Ondalık basamağı 1 ile sınırla: 4.666... → 4.7
    averageRating:
      averageRating !== null ? Math.round(averageRating * 10) / 10 : null,
  }
}

// ─── 5. UI SABİTLERİ ─────────────────────────────────────────────────────────

/**
 * Status değerlerinin Türkçe karşılıkları.
 * Component'lerde magic string kullanmaktan kaçınmak için.
 *
 * Record<K, V> tipi, tüm key'lerin karşılığının tanımlı olduğunu garanti eder.
 * Yeni bir status eklenirse TypeScript burada hata verir — güvenli.
 */
export const STATUS_LABELS: Record<ReadingStatus | 'all', string> = {
  all: 'Tümü',
  read: 'Okundu',
  reading: 'Okunuyor',
  'want-to-read': 'Okunacak',
}

export const SORT_LABELS: Record<SortOption, string> = {
  finishedAt: 'Bitiş Tarihi',
  rating: 'Puan',
  title: 'Başlık',
}
