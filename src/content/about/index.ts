// src/content/about/index.ts

/**
 * Hakkımda sayfasının sağ sütununda gösterilecek her etiket grubu
 * için ortak tip. Boş tags dizisi geçilirse TagGroup component'i
 * otomatik olarak bir "yakında" placeholder'ı gösterir.
 */
export interface AboutTagSection {
  title: string
  tags: string[]
}

/**
 * Sol sütundaki biyografi paragrafları.
 * Dizi olması, ileride yeni bir paragraf eklemeyi tek satırlık
 * bir iş haline getiriyor — component'te map ile basılıyor.
 */
export const aboutBio: string[] = [
  "Selam, ben Uğur Cem Çergel. Bir kamu kurumunda Çağrı Merkezi'nden sorumlu olarak çalışıyor, aynı zamanda kimya ve mühendislik arasında gidip gelen bir arka plana sahibim.",
  'Kurumdaki çağrı merkezi ve raporlama süreçlerini kendi ihtiyaçlarıma göre tasarladığım web uygulamalarıyla dönüştürmeye çalışıyorum. Bu site de o meraklarımın bir uzantısı — hem bir portföy hem de öğrendiklerimi not aldığım bir defter.',
  'Boş vakitlerimde hobi elektroniği ile uğraşmayı, bateri çalmayı ve yeni bir şeyler kodlamayı seviyorum.'
]

/**
 * Sağ sütunda sırasıyla render edilecek gruplar.
 * Sıra bu dizideki sıraya göre belirlenir.
 */
export const aboutSections: AboutTagSection[] = [
  {
    title: 'Eğitim',
    tags: ['İzzet Baysal Üniversitesi', 'Ahmet Yesevi Üniversitesi']
  },
  {
    title: 'Hobiler',
    tags: ['Hobi Elektroniği', 'Bateri', 'Yazılım', 'Kimya']
  },
  {
    title: 'İlgi Alanlarım',
    tags: [] // şimdilik boş — TagGroup placeholder gösterecek
  },
  {
    title: 'Diller',
    tags: ['Türkçe', 'İngilizce']
  }
]
