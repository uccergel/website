// src/components/section-header.tsx
import { cn } from '#/lib/utils'

interface SectionHeaderProps {
  /** "01", "02" gibi sıra numarası */
  index: string
  title: string
  className?: string
}

/**
 * Sayfa üstü başlık deseni: küçük vurgu renkli sıra no + büyük başlık,
 * altında tam genişlikte ince bir ayraç çizgisi.
 * about, projects gibi "numaralı bölüm" sayfalarında tekrar kullanılabilir.
 */
export function SectionHeader({ index, title, className }: SectionHeaderProps) {
  return (
    <div className={cn('border-b border-(--line) pb-6', className)}>
      <div className="flex items-baseline gap-3">
        <span className="text-sm font-bold text-(--lagoon-deep)">{index}</span>
        <h1 className="display-title text-4xl font-extrabold text-(--sea-ink) sm:text-5xl">
          {title}
        </h1>
      </div>
    </div>
  )
}
