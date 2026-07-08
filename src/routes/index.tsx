import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="flex ">
        <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
          <div>
            <h1>Uğur Cem Çergel</h1>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-rows-2 lg:grid-rows-4">
          {[
            [
              'Type-Safe Routing',
              'Routes and links stay in sync across every page.'
            ],
            [
              'Server Functions',
              'Call server code from your UI without creating API boilerplate.'
            ],
            [
              'Streaming by Default',
              'Ship progressively rendered responses for faster experiences.'
            ],
            [
              'Tailwind Native',
              'Design quickly with utility-first styling and reusable tokens.'
            ]
          ].map(([title, desc], index) => (
            <article
              key={title}
              className="island-shell feature-card rise-in rounded-2xl p-5"
              style={{ animationDelay: `${index * 90 + 80}ms` }}
            >
              <h2 className="mb-2 text-base font-semibold text-sea-ink">
                {title}
              </h2>
              <p className="m-0 text-sm text-sea-ink-soft">{desc}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
