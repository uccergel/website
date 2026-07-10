// src/components/project-card.tsx

import type { Project, ProjectStatus } from '#/content'
import { Link } from '@tanstack/react-router'

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; className: string }
> = {
  active: {
    label: 'Aktif',
    className: 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  },
  completed: {
    label: 'Tamamlandı',
    className: 'bg-blue-50 text-blue-700 border border-blue-200'
  },
  archived: {
    label: 'Arşivlendi',
    className: 'bg-gray-50 text-gray-600 border border-gray-200'
  },
  planning: {
    label: 'Planlanıyor.',
    className: 'bg-yellow-50 text-yellow-600 border border-yellow-200'
  }
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = STATUS_CONFIG[project.status]
  const dateRange = project.endDate
    ? `${project.startDate} – ${project.endDate}`
    : `${project.startDate} – Devam ediyor`

  return (
    <article className="island-shell feature-card rounded-2xl p-6 flex flex-col gap-4 h-full">
      {/* Başlık + Statü */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold text-[var(--sea-ink)] leading-snug">
          {project.title}
        </h2>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Açıklama */}
      <p className="text-sm text-[var(--sea-ink-soft)] leading-relaxed flex-1">
        {project.description}
      </p>

      {/* Etiketler */}
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs font-medium text-[var(--sea-ink-soft)]"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Alt: Tarih + Detay Linki */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--line)]">
        <span className="text-xs text-[var(--sea-ink-soft)]">{dateRange}</span>
        {/*
          TanStack Router'ın Link bileşeni burada kritik:
          - "to" prop'u route path'ini alıyor
          - "params" prop'u TypeScript tarafından type-check ediliyor
          - Yanlış bir param ismi yazsaydık derleme hatası alırdık
        */}
        <Link
          to="/projects/$slug"
          params={{ slug: project.id }}
          className="text-xs font-semibold text-[var(--lagoon-deep)] hover:underline"
        >
          Detaylar →
        </Link>
      </div>
    </article>
  )
}
