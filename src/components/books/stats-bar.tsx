interface StatsBarProps {
  total: number
  read: number
  reading: number
  wantToRead: number
  averageRating: number | null
}

export default function StatsBar({
  total,
  read,
  reading,
  wantToRead,
  averageRating
}: StatsBarProps) {
  const stats = [
    { label: 'kitap', value: total },
    { label: 'okundu', value: read },
    { label: 'okunuyor', value: reading },
    { label: 'okunacak', value: wantToRead }
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-(--sea-ink-soft)">
      {stats.map((stat, i) => (
        <span key={stat.label} className="flex items-center gap-1">
          {i > 0 && (
            <span className="text-(--line)" aria-hidden="true">
              ·
            </span>
          )}
          <span className="font-semibold text-(--sea-ink)">{stat.value}</span>
          {stat.label}
        </span>
      ))}
      {averageRating !== null && (
        <span className="flex items-center gap-1">
          <span className="text-(--line)" aria-hidden="true">
            ·
          </span>
          <span className="font-semibold text-(--sea-ink)">
            ★ {averageRating}
          </span>
          ort. puan
        </span>
      )}
    </div>
  )
}
