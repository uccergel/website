// src/content/books.ts

// ─── 1. TİP TANIMLARI ────────────────────────────────────────────────────────

export type ReadingStatus = 'read' | 'reading' | 'want-to-read'

/**
 * Tamamen sana ait olan, yerel veri.
 * Open Library'den gelmeyen hiçbir şeyi buraya koyuyoruz.
 */
export interface BookEntry {
  isbn: string
  status: ReadingStatus
  rating: 1 | 2 | 3 | 4 | 5 | null // null = henüz puanlamadım
  note: string | null
  finishedAt: string | null // "YYYY-MM" formatı, "2024-03" gibi
  startedAt: string | null // isteğe bağlı, ekledim
}

/**
 * Open Library API'sinden gelecek veri.
 * openlibrary.ts'de bu tipe dönüştüreceğiz.
 */
export interface OpenLibraryData {
  title: string
  author: string
  coverUrl: string | null // kapak yoksa null olabilir
  publishYear: number | null
  pageCount: number | null
}

/**
 * Sayfada ve bileşenlerde kullanacağımız birleşik tip.
 * BookEntry + OpenLibraryData = tek bir kullanışlı nesne.
 */
export interface Book extends BookEntry, OpenLibraryData {}

// ─── 2. VERİ ─────────────────────────────────────────────────────────────────

/**
 * Kişisel kitaplığın. ISBN'leri Open Library kapak URL'si için kullanacağız:
 * https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg
 *
 * ISBN-13 kullanmak tercih edilir (978 ile başlayan format).
 */
export const bookEntries: BookEntry[] = [
  {
    isbn: '9780743273565',
    status: 'read',
    rating: 5,
    note: "Harika bir roman. Fitzgerald'ın dili çok etkileyici.",
    finishedAt: '2024-03',
    startedAt: '2024-02',
  },
  {
    isbn: '9780062316097',
    status: 'want-to-read',
    rating: null,
    note: null,
    finishedAt: null,
    startedAt: null,
  },
  {
    isbn: '9780525559474',
    status: 'reading',
    rating: null,
    note: 'Yavaş yavaş okuyorum, çok yoğun bir içerik.',
    finishedAt: null,
    startedAt: '2024-11',
  },
]
