import type { ReadingStatus } from '#/content'
import { SORT_LABELS, STATUS_LABELS } from '#/lib/books'
import type { SortOption } from '#/lib/books'
import { cn } from '#/lib/utils'

const STATUS_FILTER_KEYS: Array<ReadingStatus | 'all'> = [
  'all',
  'read',
  'reading',
  'want-to-read'
]

interface FilterBarProps {
  activeStatus: ReadingStatus | 'all'
  onStatusChange: (status: ReadingStatus | 'all') => void
  activeSortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export default function FilterBar({
  activeStatus,
  onStatusChange,
  activeSortBy,
  onSortChange
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTER_KEYS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            className={cn(
              'island-kicker rounded-full border px-3 py-1 text-[0.65rem] transition-all',
              activeStatus === status
                ? 'border-(--lagoon-deep) bg-[rgba(79,184,178,0.15)] text-(--lagoon-deep)'
                : 'border-(--chip-line) bg-(--chip-bg) text-(--sea-ink-soft) hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)'
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="island-kicker text-(--sea-ink-soft)">Sırala:</span>
        <select
          value={activeSortBy}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className={cn(
            'rounded-full border border-(--chip-line) bg-(--chip-bg)',
            'px-3 py-1 text-xs font-semibold text-(--sea-ink)',
            'outline-none transition-colors',
            'hover:border-(--lagoon-deep) focus:border-(--lagoon-deep)'
          )}
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
            <option key={key} value={key}>
              {SORT_LABELS[key]}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
