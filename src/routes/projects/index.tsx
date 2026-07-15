import { ProjectCard } from '#/components/project-card'
import { SectionHeader } from '#/components/section-header'
import { projects } from '#/content'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="page-wrap px-4 py-12">
      <SectionHeader index="03" title="Projeler" />
      <section>
        <p className="mt-3 max-w-xl text-(--sea-ink-soft)">
          Geliştirdiğim yazılım projeleri, kişisel denemeler ve açık kaynak
          katkıları.{' '}
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
    </div>
  )
}
