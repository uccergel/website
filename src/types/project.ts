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
