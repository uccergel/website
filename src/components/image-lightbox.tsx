// src/components/image-lightbox.tsx
import { useCallback, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import { cn } from '#/lib/utils'

interface ImageLightboxProps {
  images: string[]
  index: number
  alt: string
  onClose: () => void
  onIndexChange: (index: number) => void
}

/**
 * Tam ekran görsel galerisi (lightbox).
 *
 * Kendi state'ini tutmaz — hangi görselin açık olduğu bilgisi
 * (`index`) dışarıdan (parent component) yönetilir. Bu sayede
 * bu bileşen tamamen "dumb/presentational" kalır ve farklı
 * context'lerde (proje galerisi, blog görselleri vb.) tekrar
 * kullanılabilir.
 */
export function ImageLightbox({
  images,
  index,
  alt,
  onClose,
  onIndexChange
}: ImageLightboxProps) {
  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length)
  }, [index, images.length, onIndexChange])

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % images.length)
  }, [index, images.length, onIndexChange])

  // ── Klavye navigasyonu ─────────────────────────────
  // ← → ile görsel değiştir, Esc ile kapat.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goPrev, goNext, onClose])

  // ── Arka plan scroll'unu kilitle ────────────────────
  // Lightbox açıkken sayfanın arkasında kayma olmasın.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  const hasMultiple = images.length > 1

  return (
    <div
      className="fade-in fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/85 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} - görsel ${index + 1} / ${images.length}`}
    >
      {/* Kapat butonu */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        aria-label="Kapat"
      >
        <XIcon className="size-6" />
      </button>

      {/* Ana görsel alanı — flex-1 ile kalan dikey alanı doldurur,
       * bu sayede thumbnail şeridi her zaman altta sabit kalır. */}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        {/* Önceki görsel */}
        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:left-6"
            aria-label="Önceki görsel"
          >
            <ChevronLeftIcon className="size-7" />
          </button>
        )}

        {/* Aktif görsel */}
        <img
          src={images[index]}
          alt={`${alt} - ${index + 1}`}
          className="max-h-[70vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Sonraki görsel */}
        {hasMultiple && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 sm:right-6"
            aria-label="Sonraki görsel"
          >
            <ChevronRightIcon className="size-7" />
          </button>
        )}

        {/* Sayaç */}
        {hasMultiple && (
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white sm:bottom-24">
            {index + 1} / {images.length}
          </div>
        )}
      </div>

      {/* ── Thumbnail Şeridi ─────────────────────────────
       * Yatay scrollable, aktif thumbnail vurgulanır.
       * Tek görsel varsa hiç render edilmez — anlamsız olur.
       * ─────────────────────────────────────────────────── */}
      {hasMultiple && (
        <div
          className="no-scrollbar mt-4 flex max-w-full gap-2 overflow-x-auto px-2 pb-1"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => onIndexChange(i)}
              className={cn(
                'h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition',
                i === index
                  ? 'border-white opacity-100'
                  : 'border-transparent opacity-50 hover:opacity-80'
              )}
              aria-label={`${i + 1}. görsele git`}
              aria-current={i === index}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
