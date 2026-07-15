// src/components/about/tag-group.tsx
import { cn } from '#/lib/utils'

interface TagGroupProps {
  title: string
  tags: string[]
  emptyLabel?: string
  className?: string
}

export function TagGroup({
  title,
  tags,
  emptyLabel = 'Yakında eklenecek',
  className
}: TagGroupProps) {
  return (
    <div className={cn(className)}>
      <p className="island-kicker mb-3 text-(--sea-ink-soft)">{title}</p>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-(--line) bg-(--surface-strong) px-4 py-1.5 text-sm text-(--sea-ink) shadow-sm transition-colors hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-(--sea-ink-soft) italic">{emptyLabel}</p>
      )}
    </div>
  )
}
