// src/components/content-nav.tsx
import { Link, useMatchRoute } from '@tanstack/react-router'
import { cn } from '#/lib/utils'

// ─── Sekme Tanımları ─────────────────────────────────────────────────────────
// fuzzy: true → /blogs/$slug gibi alt route'larda da sekme aktif kalır.
// Bu, "yazı okurken hâlâ Yazılar sekmesindeyim" deneyimini sağlar.

const CONTENT_TABS = [
  { label: 'Yazılar', to: '/blogs' as const },
  { label: 'Kitaplar', to: '/books' as const },
  { label: 'Yer İmleri', to: '/bookmarks' as const }
] as const

// ─── TabLink Alt Bileşeni ─────────────────────────────────────────────────────
// Her sekme kendi aktiflik durumunu useMatchRoute ile kontrol eder.
// Bu, activeProps'un className birleştirme belirsizliğini ortadan kaldırır.

function TabLink({
  to,
  label
}: {
  to: (typeof CONTENT_TABS)[number]['to']
  label: string
}) {
  const matchRoute = useMatchRoute()
  // fuzzy: true → "/blogs/herhangi-bir-slug" da Yazılar sekmesini aktif tutar
  const isActive = !!matchRoute({ to, fuzzy: true })

  return (
    <Link
      to={to}
      className={cn(
        'island-kicker flex-1 rounded-xl px-3 py-2.5 text-center transition-all',
        isActive
          ? 'bg-[rgba(79,184,178,0.15)] text-(--lagoon-deep) shadow-sm'
          : 'text-(--sea-ink-soft) hover:text-(--sea-ink)'
      )}
    >
      {label}
    </Link>
  )
}

// ─── ContentNav Ana Bileşeni ──────────────────────────────────────────────────

export function ContentNav() {
  return (
    <nav
      className="island-shell mb-8 flex gap-1 rounded-2xl p-1.5"
      aria-label="İçerik bölümü navigasyonu"
    >
      {CONTENT_TABS.map((tab) => (
        <TabLink key={tab.to} to={tab.to} label={tab.label} />
      ))}
    </nav>
  )
}
