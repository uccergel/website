// src/lib/openlibrary.ts
import type { OpenLibraryData } from '#/content'

// ─── 1. RAW API TİP TANIMLARI ────────────────────────────────────────────────

interface OLAuthor {
  name: string
  url: string
}

interface OLBookRaw {
  title?: string
  authors?: OLAuthor[]
  publish_date?: string
  number_of_pages?: number
  cover?: {
    small?: string
    medium?: string
    large?: string
  }
}

type OLBooksResponse = Record<string, OLBookRaw>

/**
 * ISBN aramasında Open Library'de bulunamazsa (ya da eksik alan varsa)
 * kullanılacak yedek başlık/yazar bilgisi.
 */
export interface BookFallback {
  title?: string
  author?: string
}

// ─── 2. SABİTLER VE YARDIMCI FONKSİYONLAR ───────────────────────────────────

const OL_BOOKS_BASE = 'https://openlibrary.org/api/books'
const OL_COVERS_BASE = 'https://covers.openlibrary.org/b/isbn'

export type CoverSize = 'S' | 'M' | 'L'

export function getCoverUrl(isbn: string, size: CoverSize = 'L'): string {
  return `${OL_COVERS_BASE}/${isbn}-${size}.jpg`
}

function extractYear(dateStr: string | undefined): number | null {
  if (!dateStr) return null
  const match = dateStr.match(/\d{4}/)
  return match ? parseInt(match[0], 10) : null
}

/**
 * Ham API nesnesini temiz OpenLibraryData tipine dönüştürür.
 *
 * Öncelik sırası (title için, author aynı mantık):
 *   1. Open Library'nin döndürdüğü gerçek veri
 *   2. BookEntry'de tanımlı fallbackTitle/fallbackAuthor
 *   3. "Bilinmeyen Kitap" / "Bilinmeyen Yazar" (son çare)
 */
function transformBookRaw(
  raw: OLBookRaw | undefined,
  isbn: string,
  fallback?: BookFallback
): OpenLibraryData {
  // API'de kitap hiç bulunamazsa → fallback'e, o da yoksa sabit metne düş
  if (!raw) {
    return {
      title: fallback?.title ?? 'Bilinmeyen Kitap',
      author: fallback?.author ?? 'Bilinmeyen Yazar',
      coverUrl: getCoverUrl(isbn),
      publishYear: null,
      pageCount: null
    }
  }

  return {
    title: raw.title ?? fallback?.title ?? 'Bilinmeyen Kitap',
    author: raw.authors?.[0]?.name ?? fallback?.author ?? 'Bilinmeyen Yazar',
    coverUrl: raw.cover?.large ?? raw.cover?.medium ?? getCoverUrl(isbn),
    publishYear: extractYear(raw.publish_date),
    pageCount: raw.number_of_pages ?? null
  }
}

// ─── 3. ANA API FONKSİYONU ───────────────────────────────────────────────────

/**
 * Birden fazla ISBN için metadata'yı TEK BİR API isteğiyle getirir.
 *
 * `fallbacks` parametresi: isbn → {title, author} şeklinde bir map.
 * Open Library o ISBN'i bulamazsa (ya da alan eksikse) burdaki veriyi kullanır.
 *
 * NOT: Bu fonksiyon sadece server-side (loader) içinden çağrılmalı.
 */
export async function fetchBooksMetadata(
  isbns: string[],
  fallbacks: Record<string, BookFallback> = {}
): Promise<Record<string, OpenLibraryData>> {
  if (isbns.length === 0) return {}

  const bibkeys = isbns.map((isbn) => `ISBN:${isbn}`).join(',')
  const url = `${OL_BOOKS_BASE}?bibkeys=${bibkeys}&format=json&jscmd=data`

  const response = await fetch(url)

  if (!response.ok) {
    throw new OpenLibraryError(
      `Open Library API hatası: ${response.statusText}`,
      response.status
    )
  }

  const raw: OLBooksResponse = (await response.json()) as OLBooksResponse

  const result: Record<string, OpenLibraryData> = {}

  for (const isbn of isbns) {
    const apiKey = `ISBN:${isbn}`
    result[isbn] = transformBookRaw(raw[apiKey], isbn, fallbacks[isbn])
  }

  return result
}

// ─── 4. HATA SINIFI ──────────────────────────────────────────────────────────

export class OpenLibraryError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'OpenLibraryError'
  }
}
