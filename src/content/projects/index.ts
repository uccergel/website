export type ProjectStatus = 'active' | 'completed' | 'archived' | 'planning'

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
  projectName: string
  title: string // "Kişisel Portföy Sitesi"
  description: string // Kısa açıklama (liste sayfası için)
  longDescription?: string // Detaylı açıklama (detay sayfası için)
  tags: ProjectTag[]
  status: ProjectStatus
  startDate: string // "2024-01"
  endDate?: string // Bitmemişse undefined
  links: ProjectLink
  featured: boolean // Ana sayfada veya öne çıkarılmış listede gösterilsin mi?
  imageUrl?: string // Kapak / hero görseli (detay sayfasının üstünde tam genişlik)
  images?: string[] // Galeri görselleri (detay sayfasında grid olarak gösterilir)
}

export const projects: Project[] = [
  {
    id: 'uccergel-github-io',
    projectName: 'Kişisel Web Sitesi',
    title: 'Kişisel Web Sitesi',
    description:
      'TanStack Start, React ve Tailwind CSS ile inşa edilmiş kişisel portföy ve blog sitesi.',
    longDescription:
      'Type-safe routing, server-side rendering ve modern UI bileşenleriyle hazırlanmış kişisel alan. Yazılar, kitaplar ve yer imlerini barındırıyor.',
    tags: ['React', 'TypeScript', 'TailwindCSS'],
    status: 'completed',
    startDate: '2026-06',
    endDate: '2026-06',
    links: {
      github: 'https://github.com/uccergel/uccergel.github.io',
      live: 'https://uccergel.com'
    },
    featured: true
  },
  {
    id: 'vira',
    projectName: 'Vira CCM',
    title: 'Çağrı Merkezi Yönetim Uygulaması',
    description:
      'Çağrı Merkezi Metrikleri ve Çalışan Yönetimini bir araya getiren web & mobil uygulaması.',
    longDescription:
      'Çağrı Merkezi Metrikleri (Kuyruk İstatistikleri, Çağrı İstatistikleri), İletişim Kanallarından Gelen Başvuruların ',
    tags: [
      'React',
      'TypeScript',
      'Tanstack Start',
      'Django',
      'Python',
      'Postgresql',
      'React-Native'
    ],
    status: 'active',
    startDate: '2023-01',
    links: {
      github: '',
      live: 'https://vira.uccergel.com'
    },
    featured: true,
    imageUrl: '/images/projects/vira/cover.png',
    images: [
      '/images/projects/vira/dashboard.png',
      '/images/projects/vira/queue-stats.png',
      '/images/projects/vira/mobile.png'
    ]
  },
  {
    id: 'manus-adiutrix',
    projectName: 'Manus Adiutrix',
    title: 'Sosyal Yardım Takip Uygulaması',
    description:
      'Kamu kurumlarının verdiği sosyal yardımları tek bir çatı altında yönetmesini sağlayan web & mobil uygulaması.',
    longDescription: 'manus: el, adiutrix: yardım',
    tags: [
      'React',
      'TypeScript',
      'Tanstack Start',
      'Django',
      'Python',
      'Postgresql',
      'React-Native'
    ],
    status: 'planning',
    startDate: '2024-05',
    links: {
      github: '',
      live: ''
    },
    featured: true
  },
  {
    id: 'dummy-mernis',
    projectName: 'SERNİS',
    title: 'SERNİS - Sahte Nüfus İdaresi Sistemi',
    description:
      'Uygulama geliştirme aşamasında ihtiyaç duyulan mernis datasının tamamen sahte üretimlerle API haline getirilmesi.',
    longDescription: '',
    tags: [],
    status: 'planning',
    startDate: '2026-05',
    links: {
      github: '',
      live: ''
    },
    featured: true
  }
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
