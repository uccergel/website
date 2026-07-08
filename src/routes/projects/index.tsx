import { ProjectCard } from '#/components/project-card'
import { projects } from '#/data/projects'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/')({
  component: RouteComponent
})

function RouteComponent() {
  const totalCount = projects.length
  const activeCount = projects.filter((p) => p.status === 'active').length

  return (
    <main className="page-wrap px-4 py-12">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <p className="island-kicker mb-3">Projeler</p>
        <h1 className="display-title text-3xl font-bold text-(--sea-ink) sm:text-4xl">
          Yaptıklarım
        </h1>
        <p className="mt-3 max-w-xl text-(--sea-ink-soft)">
          Geliştirdiğim yazılım projeleri, kişisel denemeler ve açık kaynak
          katkıları.{' '}
          <span className="font-medium text-(--sea-ink)">
            {activeCount} aktif / {totalCount} toplam
          </span>
        </p>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div
            key={project.id}
            className="rise-in"
            style={{ animationDelay: `${index * 80 + 60}ms` }}
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </section>
    </main>
  )
}
