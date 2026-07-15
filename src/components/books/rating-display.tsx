/**
 * Yıldız puanını görsel olarak gösterir.
 * Puanlanmamış kitaplar için boş yıldızlar render edilir.
 */

import type { Book } from '#/content'
import { cn } from '#/lib/utils'
import { StarIcon } from 'lucide-react'

interface RatingDisplayProps {
  rating: Book['rating']
}

export default function RatingDisplay({ rating }: RatingDisplayProps) {
  // Puanlanmamış kitap — boş yıldızlar göster
  if (rating === null) {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="size-3.5 text-(--line)" />
        ))}
        <span className="ml-1.5 text-xs text-(--sea-ink-soft)">
          Puanlanmadı
        </span>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} üzerinden 5 puan`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            'size-3.5 transition-colors',
            // i < rating → dolu yıldız, i >= rating → boş yıldız
            i < rating ? 'fill-amber-400 text-amber-400' : 'text-(--line)'
          )}
        />
      ))}
    </div>
  )
}
