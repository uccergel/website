// src/lib/openlibrary.ts
import type { OpenLibraryData } from '#/content'

// ─── 1. RAW API TİP TANIMLARI ────────────────────────────────────────────────
// Bu tipler sadece bu dosyaya özel, dışarı export edilmez.
// Open Library API'sinin ne döndürdüğünü modelliyoruz.

interface OLAuthor {
  name: string
  url: string
}

/**
 * Open Library'den gelen ham kitap nesnesi.
 * Tüm alanlar opsiyonel — API hiçbir alanı garanti etmez.
 */
interface OLBookRaw {
  title?: string
  authors?: OLAuthor[]
  publish_date?: string // "2004", "April 2004", "April 10, 2004" hepsi mümkün
  number_of_pages?: number
  cover?: {
    small?: string
    medium?: string
    large?: string
  }
}

/**
 * Batch API isteğinin yanıt yapısı.
 * Key'ler "ISBN:9780743273565" formatında gelir.
 *
 * Örnek:
 * {
 *   "ISBN:9780743273565": { title: "The Great Gatsby", ... },
 *   "ISBN:9780062316097": { ... }
 * }
 */
type OLBooksResponse = Record<string, OLBookRaw>

// ─── 2. SABİTLER VE YARDIMCI FONKSİYONLAR ───────────────────────────────────

const OL_BOOKS_BASE = 'https://openlibrary.org/api/books'
const OL_COVERS_BASE = 'https://covers.openlibrary.org/b/isbn'

export type CoverSize = 'S' | 'M' | 'L'

/**
 * ISBN'den kapak URL'si üretir. Fetch gerektirmez.
 *
 * Open Library, olmayan kapaklar için küçük bir placeholder döner —
 * 404 atmaz. Bu yüzden her zaman bu URL'i güvenle kullanabiliriz.
 *
 * Kullanım: getCoverUrl("9780743273565")       → boyut varsayılan L
 *           getCoverUrl("9780743273565", "M")  → medium
 */
export function getCoverUrl(isbn: string, size: CoverSize = 'L'): string {
  return `${OL_COVERS_BASE}/${isbn}-${size}.jpg`
}

/**
 * Ham tarih string'inden yılı çıkarır.
 *
 * Open Library birçok format kullanır:
 * "2004" → 2004
 * "April 2004" → 2004
 * "April 10, 2004" → 2004
 * "2004-04-10" → 2004
 * undefined → null
 *
 * Basit bir regex ile ilk 4 haneli sayıyı alıyoruz.
 */
function extractYear(dateStr: string | undefined): number | null {
  if (!dateStr) return null
  const match = dateStr.match(/\d{4}/)
  return match ? parseInt(match[0], 10) : null
}

/**
 * Ham API nesnesini temiz OpenLibraryData tipine dönüştürür.
 * isbn parametresi, kapak URL'si fallback için gerekiyor.
 */
function transformBookRaw(
  raw: OLBookRaw | undefined,
  isbn: string
): OpenLibraryData {
  // API'de kitap hiç bulunamazsa minimum bir nesne döndür
  if (!raw) {
    return {
      title: 'Bilinmeyen Kitap',
      author: 'Bilinmeyen Yazar',
      // Kapak URL'ini yine de dene — belki görsel vardır
      coverUrl: getCoverUrl(isbn),
      publishYear: null,
      pageCount: null
    }
  }

  return {
    title: raw.title ?? 'Bilinmeyen Kitap',
    // İlk yazar alınır; birden fazla yazar varsa diğerleri göz ardı edilir
    author: raw.authors?.[0]?.name ?? 'Bilinmeyen Yazar',
    // Öncelik: API'den gelen URL > ISBN pattern'i
    // API'deki large yoksa medium'a bak, o da yoksa kendi URL'imizi üret
    coverUrl: raw.cover?.large ?? raw.cover?.medium ?? getCoverUrl(isbn),
    publishYear: extractYear(raw.publish_date),
    pageCount: raw.number_of_pages ?? null
  }
}

// ─── 3. ANA API FONKSİYONU ───────────────────────────────────────────────────

/**
 * Birden fazla ISBN için metadata'yı TEK BİR API isteğiyle getirir.
 *
 * Dönen Map yapısı, ISBN'i key olarak kullanır:
 * { "9780743273565": { title: "...", author: "...", ... }, ... }
 *
 * Bu yapı sayesinde route loader'da local BookEntry ile
 * kolayca eşleştirebiliriz: result[entry.isbn]
 *
 * NOT: Bu fonksiyon sadece server-side (loader) içinden çağrılmalı.
 * Client bundle'a sızmaz çünkü TanStack Start loader'ları
 * otomatik olarak server'da kalır.
 *
 * Kullanım:
 *   const metadata = await fetchBooksMetadata(["isbn1", "isbn2"])
 *   const titleOfFirstBook = metadata["isbn1"]?.title
 */
export async function fetchBooksMetadata(
  isbns: string[]
): Promise<Record<string, OpenLibraryData>> {
  // Boş liste için erken dön — gereksiz API çağrısını önle
  if (isbns.length === 0) return {}

  // "ISBN:isbn1,ISBN:isbn2,..." formatında bibkeys parametresi oluştur
  const bibkeys = isbns.map((isbn) => `ISBN:${isbn}`).join(',')

  // jscmd=data → tam metadata (kapak, yazar, sayfa sayısı dahil)
  // jscmd=details → daha az veri, bizim için yeterli değil
  const url = `${OL_BOOKS_BASE}?bibkeys=${bibkeys}&format=json&jscmd=data`

  const response = await fetch(url)

  if (!response.ok) {
    throw new OpenLibraryError(
      `Open Library API hatası: ${response.statusText}`,
      response.status
    )
  }

  const raw: OLBooksResponse = (await response.json()) as OLBooksResponse

  // Her ISBN için ham veriyi temiz tipe dönüştür
  const result: Record<string, OpenLibraryData> = {}

  for (const isbn of isbns) {
    const apiKey = `ISBN:${isbn}` // API'nin kullandığı key formatı
    result[isbn] = transformBookRaw(raw[apiKey], isbn)
  }

  return result
}

// ─── 4. HATA SINIFI ──────────────────────────────────────────────────────────

/**
 * Raindrop implementasyonundaki RaindropApiError ile aynı pattern.
 * instanceof ile yakalanabilmesi için özel sınıf kullanıyoruz.
 */
export class OpenLibraryError extends Error {
  constructor(
    message: string,
    public readonly status?: number
  ) {
    super(message)
    this.name = 'OpenLibraryError'
  }
}
