import GithubIcon from '#/components/icons/github-icon'
import LinkedinIcon from '#/components/icons/linkedin-icon'
import XIcon from '#/components/icons/x-icon'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

export interface IconList {
  name: string
  icon: React.ReactNode
  link: string
}

const iconLists: IconList[] = [
  {
    name: 'Twitter',
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

export interface Qualification {
  name: string
  description: string
}

const qualifications: Qualification[] = [
  { name: 'call-center', description: 'Çağrı Merkezi' },
  { name: 'engineer', description: 'Mühendislik' },
  { name: 'chemistry', description: 'Kimya' }
]

function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % qualifications.length)
    }, 1000)

    // Component unmount olduğunda interval'i temizle (memory leak önlemi)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="page-wrap px-4 pb-8 pt-14 h-full box-border">
      <div className="grid grid-cols-6 gap-4 h-full">
        <section className="max-h-96 col-span-4 island-shell rise-in relative overflow-hidden rounded-2xl px-6 py-10 sm:px-10 sm:py-14 flex flex-col h-full box-border">
          <div className="flex flex-col justify-between flex-1">
            <div>
              <h1 className="text-4xl font-bold mb-8">
                Uğur Cem <br /> Çergel
              </h1>
              <p
                key={activeIndex}
                className="fade-swap text-base font-medium text-(--sea-ink)"
              >
                {qualifications[activeIndex].description}
              </p>
            </div>

            <div className="flex gap-4">
              {iconLists.map((iconList) => (
                <a
                  key={iconList.name}
                  href={iconList.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex my-auto items-center border transition rounded-xl p-2 text-(--sea-ink-soft) hover:bg-(--link-bg-hover) hover:text-(--sea-ink) gap-2"
                >
                  {iconList.name}
                  {iconList.icon}
                </a>
              ))}
            </div>
          </div>
        </section>
        <section className="max-h-96 island-shell feature-card rise-in rounded-2xl grid col-span-2 gap-4 sm:grid-rows-2 lg:grid-rows-4 h-full overflow-y-auto pr-1">
          {[
            [
              'Ne iş yapıyorum?',
              'Bir kamu kurumunda Çağrı Merkezinden sorumlu olarak çalışyorum.'
            ],
            [
              'Neyle uğraşıyorum?',
              'Çağrı Merkezi iş ve raporlama süreçlerini ihtiyaçlarıma yönelik olarak tasarladığım web uygulaması geliştiriyorum.'
            ]
          ].map(([title, desc], index) => (
            <article
              key={title}
              className="p-5"
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
    </div>
  )
}
