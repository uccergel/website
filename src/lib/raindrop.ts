// src/lib/raindrop.ts

// ─── 1. TİP TANIMLARI ────────────────────────────────────────────────────────

/**
 * Raindrop.io API'sinden dönen tek bir bookmark'ın yapısı.
 * Sadece UI'da kullanacağımız alanları tanımlıyoruz.
 */
export interface Raindrop {
  _id: number
  title: string
  link: string
  excerpt: string
  domain: string
  cover: string
  tags: string[]
  created: string
}

/**
 * Koleksiyondan bookmark listesi çekildiğinde dönen API yanıtı.
 */
export interface RaindropListResponse {
  result: boolean
  items: Raindrop[]
  count: number
}

/**
 * Hata durumunda fırlatacağımız özel hata sınıfı.
 * Böylece route loader'da instanceof ile yakalayabiliriz.
 */
export class RaindropApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = 'RaindropApiError'
  }
}

// ─── 2. BASE FETCHER ─────────────────────────────────────────────────────────

const RAINDROP_BASE_URL = 'https://api.raindrop.io/rest/v1'

/**
 * Tüm Raindrop API isteklerini bu fonksiyon üzerinden yapıyoruz.
 * Authorization header'ı tek yerden yönetmek için base fetcher pattern'i kullandık.
 *
 * NOT: Bu fonksiyon sadece server-side (loader) içinden çağrılmalı.
 * Token hiçbir zaman client'a gönderilmez.
 */
async function raindropFetch<T>(endpoint: string): Promise<T> {
  const token = process.env['RAINDROP_TOKEN']

  if (!token) {
    throw new RaindropApiError(
      'RAINDROP_TOKEN environment variable is not set.',
    )
  }

  const response = await fetch(`${RAINDROP_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new RaindropApiError(
      `Raindrop API error: ${response.status} - ${response.statusText} - ${body}`,
      response.status,
    )
  }

  return response.json() as Promise<T>
}

// ─── 3. DOMAIN FONKSİYONLARI ─────────────────────────────────────────────────

/**
 * Belirli bir koleksiyondaki tüm bookmark'ları getirir.
 *
 * Kullanım:
 *   const bookmarks = await getRaindropsByCollection(28498046)
 */
export async function getRaindropsByCollection(
  collectionId: number,
): Promise<Raindrop[]> {
  const data = await raindropFetch<RaindropListResponse>(
    `/raindrops/${collectionId}`,
  )

  if (!data.result) {
    throw new RaindropApiError(
      `Failed to fetch raindrops for collection ${collectionId}`,
    )
  }

  return data.items
}

/**
 * Config dosyasında tanımlı birden fazla koleksiyonun
 * bookmark'larını paralel olarak getirir.
 *
 * Promise.all sayesinde N koleksiyon için N ayrı istek
 * sıralı değil, paralel çalışır — bu performans açısından kritik.
 *
 * Kullanım:
 *   const groups = await getRaindropsByCollections([
 *     { id: 28498046, label: 'Takip Edilen Siteler', emoji: '🔖' }
 *   ])
 */
export async function getRaindropsByCollections(
  collections: Array<{ id: number; label: string; emoji?: string }>,
): Promise<
  Array<{ id: number; label: string; emoji?: string; items: Raindrop[] }>
> {
  const results = await Promise.all(
    collections.map(async (collection) => {
      const items = await getRaindropsByCollection(collection.id)
      return { ...collection, items }
    }),
  )

  return results
}
