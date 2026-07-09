import GithubIcon from '#/components/icons/GithubIcon'
import LinkedinIcon from '#/components/icons/LinkedinIcon'
import XIcon from '#/components/icons/XIcon'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

const iconLists = [
  {
    name: 'X',
    icon: <XIcon />,
    link: 'https://x.com/uccergel'
  },
  {
    name: 'Linkedin',
    icon: <LinkedinIcon />,
    link: 'https://www.linkedin.com/in/uccergel/'
  },
  {
    name: 'Github',
    icon: <GithubIcon />,
    link: 'https://github.com/uccergel'
  }
]

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="grid grid-cols-6 gap-4">
        <section className="col-span-4 island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
          <div>
            <h1 className="text-4xl font-bold mb-8">
              Uğur Cem <br /> Çergel
            </h1>
            <p>Kamu kurumunda çalışıyorum. İki çocuk babasıyım. </p>
            <div className="mt-4 flex justify-center gap-4">
              {iconLists.map((iconList) => (
                <a
                  key={iconList.name}
                  href={iconList.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl p-2 text-sea-ink-soft] transition hover:bg-(--link-bg-hover) hover:text--sea-ink"
                >
                  {iconList.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid col-span-2 gap-4 sm:grid-rows-2 lg:grid-rows-4">
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
