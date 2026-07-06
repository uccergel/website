// src/config/bookmarks.ts

export interface CollectionConfig {
  id: number
  label: string
  emoji?: string
}

/**
 * Gösterilecek Raindrop.io koleksiyonları buraya eklenir.
 * Yeni koleksiyon eklemek için sadece bu diziye bir satır ekle.
 */
export const BOOKMARK_COLLECTIONS: CollectionConfig[] = [
  { id: 28498046, label: 'Takip Edilen Siteler', emoji: '🔖' },
]
