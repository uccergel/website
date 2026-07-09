import { getProjectBySlug } from '#/content'
import type { ProjectStatus } from '#/content'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'

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
  }
}

export const Route = createFileRoute('/projects/$slug')({
  loader: ({ params }) => {
    // params.slug → TypeScript bu değerin string olduğunu garanti eder
    const project = getProjectBySlug(params.slug)

    // Proje bulunamazsa 404 fırlat
    // notFound() özel bir hata objesidir, router onu yakalar
    if (!project) throw notFound()

    return { project }
  },
  component: RouteComponent,
  notFoundComponent: ProjectNotFound
})

function RouteComponent() {
  const { project } = Route.useLoaderData()

  const status = STATUS_CONFIG[project.status]
  const dateRange = project.endDate
    ? `${project.startDate} – ${project.endDate}`
    : `${project.startDate} – Devam ediyor`

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex items-center gap-2 text-sm text-[var(--sea-ink-soft)]"
      >
        <Link
          to="/projects"
          className="hover:text-[var(--sea-ink)] transition-colors"
        >
          Projeler
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[var(--sea-ink)] font-medium">
          {project.title}
        </span>
      </nav>

      {/* Hero */}
      <section className="island-shell rise-in rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="island-kicker mb-3">Proje</p>
            <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)] sm:text-4xl">
              {project.title}
            </h1>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        <p className="mt-4 max-w-2xl text-[var(--sea-ink-soft)] leading-relaxed">
          {project.description}
        </p>

        {/* Etiketler */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1 text-sm font-medium text-[var(--sea-ink-soft)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Detay Grid */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Metadata */}
        <section className="island-shell rounded-2xl p-6">
          <p className="island-kicker mb-4">Detaylar</p>
          <dl className="flex flex-col gap-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
                Süre
              </dt>
              <dd className="mt-1 text-sm text-[var(--sea-ink)]">
                {dateRange}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
                Durum
              </dt>
              <dd className="mt-1">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                >
                  {status.label}
                </span>
              </dd>
            </div>
          </dl>
        </section>

        {/* Bağlantılar */}
        <section className="island-shell rounded-2xl p-6">
          <p className="island-kicker mb-4">Bağlantılar</p>
          <div className="flex flex-col gap-3">
            {project.links.github && (
              <Link
                to={project.links.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-[var(--lagoon-deep)] hover:underline"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="16"
                  height="16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub'da Gör
              </Link>
            )}
            {project.links.live && (
              <Link
                to={project.links.live}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-[var(--lagoon-deep)] hover:underline"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Canlı Siteye Git
              </Link>
            )}
            {project.links.demo && (
              <Link
                to={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-[var(--lagoon-deep)] hover:underline"
              >
                Demo
              </Link>
            )}
            {!project.links.github &&
              !project.links.live &&
              !project.links.demo && (
                <p className="text-sm text-[var(--sea-ink-soft)]">
                  Henüz bağlantı eklenmemiş.
                </p>
              )}
          </div>
        </section>
      </div>

      {/* Uzun Açıklama */}
      {project.longDescription && (
        <section className="island-shell mt-4 rounded-2xl p-6">
          <p className="island-kicker mb-4">Hakkında</p>
          <div className="flex flex-col gap-3">
            {project.longDescription.split('\n').map((paragraph, i) => (
              <p
                key={i}
                className="text-sm text-[var(--sea-ink-soft)] leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Geri Dön */}
      <div className="mt-8">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--sea-ink-soft)] transition-colors hover:text-[var(--sea-ink)]"
        >
          ← Tüm Projelere Dön
        </Link>
      </div>
    </main>
  )
}

// ─────────────────────────────────────────
// 404 bileşeni
// loader'da notFound() fırlatılınca bu render edilir
// ─────────────────────────────────────────
function ProjectNotFound() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rounded-2xl p-10 text-center">
        <p className="island-kicker mb-3">404</p>
        <h1 className="display-title text-2xl font-bold text-(--sea-ink)">
          Proje Bulunamadı
        </h1>
        <p className="mt-3 text-(--sea-ink-soft)">
          Aradığınız proje mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link
          to="/projects"
          className="mt-6 inline-block text-sm font-semibold text-(--lagoon-deep) hover:underline"
        >
          Tüm Projelere Dön →
        </Link>
      </section>
    </main>
  )
}
