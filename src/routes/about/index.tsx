import { TagGroup } from '#/components/about/tag-group'
import { SectionHeader } from '#/components/section-header'
import { aboutBio, aboutSections } from '#/content'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div className="page-wrap px-4 py-12">
      <SectionHeader index="01" title="Hakkımda" />
      <section>
        <p className="mt-3 max-w-xl text-(--sea-ink-soft)"></p>
      </section>
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* ── Sol: Biyografi ─────────────────────────────────── */}
        <section className="lg:col-span-8">
          <div className="flex flex-col gap-5">
            {aboutBio.map((paragraph, index) => (
              <p
                key={index}
                className="text-lg leading-9 text-(--sea-ink-soft)"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* ── Sağ: Eğitim / Hobiler / İlgi Alanları / Diller ──── */}
        <section className="lg:col-span-4">
          <div className="flex flex-col gap-9">
            {aboutSections.map((section) => (
              <TagGroup
                key={section.title}
                title={section.title}
                tags={section.tags}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
