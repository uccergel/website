/**
 * Kapak görselini yönetir.
 * onError tetiklenirse fallback UI gösterir.
 * useState ile "hata var mı" bilgisini takip ederiz.
 */

import { getCoverUrl } from '#/lib/openLibrary'
import { BookOpenIcon } from 'lucide-react'
import { useState } from 'react'

interface CoverImageProps {
  isbn: string
  title: string
}

export default function CoverImage({ isbn, title }: CoverImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="flex size-full items-center justify-center bg-(--sand)">
        <BookOpenIcon className="size-8 text-(--sea-ink-soft)" />
      </div>
    )
  }

  return (
    <img
      src={getCoverUrl(isbn, 'M')}
      alt={`${title} kitap kapağı`}
      className="size-full object-cover"
      loading="lazy"
      onError={() => setHasError(true)}
    />
  )
}
