export type ProjectStatus = 'active' | 'completed' | 'archived'

export type ProjectTag =
  | 'React'
  | 'TypeScript'
  | 'Python'
  | 'Django'
  | 'TailwindCSS'
  | 'Node.js'
  | string // Özel etiketler için

export interface ProjectLink {
  github?: string
  live?: string
  demo?: string
}

export interface Project {
  id: string // URL slug olarak kullanılacak: "my-portfolio"
  title: string // "Kişisel Portföy Sitesi"
  description: string // Kısa açıklama (liste sayfası için)
  longDescription?: string // Detaylı açıklama (detay sayfası için)
  tags: ProjectTag[]
  status: ProjectStatus
  startDate: string // "2024-01"
  endDate?: string // Bitmemişse undefined
  links: ProjectLink
  featured: boolean // Ana sayfada veya öne çıkarılmış listede gösterilsin mi?
  imageUrl?: string // Proje görseli (sonraki adımda)
}

export const projects: Project[] = [
  {
    id: 'uccergel-github-io',
    title: 'Kişisel Web Sitesi',
    description:
      'TanStack Start, React ve Tailwind CSS ile inşa edilmiş kişisel portföy ve blog sitesi.',
    longDescription:
      'Type-safe routing, server-side rendering ve modern UI bileşenleriyle hazırlanmış kişisel alan. Yazılar, kitaplar ve yer imlerini barındırıyor.',
    tags: ['React', 'TypeScript', 'TailwindCSS'],
    status: 'active',
    startDate: '2026-06',
    links: {
      github: 'https://github.com/uccergel/uccergel.github.io',
      live: 'https://uccergel.github.io'
    },
    featured: true
  }
  // Daha fazla proje ekleyebilirsin...
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.id === slug)
}

// Öne çıkan projeleri almak için yardımcı fonksiyon
export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured)
}

// Statüye göre filtrelemek için yardımcı fonksiyon
export function getProjectsByStatus(status: Project['status']): Project[] {
  return projects.filter((p) => p.status === status)
}
