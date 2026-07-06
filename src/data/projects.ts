import type { Project } from '#/types/project'

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
    startDate: '2025-01',
    links: {
      github: 'https://github.com/uccergel/uccergel.github.io',
      live: 'https://uccergel.github.io',
    },
    featured: true,
  },
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
