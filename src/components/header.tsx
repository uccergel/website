// src/components/Header.tsx
import { Link } from '@tanstack/react-router'
import ThemeToggle from './theme-toggle'

// Tip güvenliği için TanStack Router'ın bildiği route'ları kullanıyoruz.
// Projects route'u henüz yok, onu sonraki adımda ekleyeceğiz.
const NAV_LINKS = [
  { label: 'Hakkımda', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Projeler', to: '/projects' }
] as const

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'var(--header-bg)',
        borderColor: 'var(--line)',
        backdropFilter: 'blur(8px)'
      }}
    >
      {/* page-wrap: styles.css'te tanımlı, max-width + auto margin sağlar */}
      <div className="page-wrap flex h-16 items-center justify-between">
        {/* Sol: Logo / Baş harfler */}
        <Link
          to="/"
          className="text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-70"
          style={{ color: 'var(--sea-ink)' }}
        >
          ucç
        </Link>

        {/* Sağ: Navigasyon linkleri + Tema butonu */}
        <nav className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link text-sm font-medium"
              // TanStack Router, aktif durumda bu className'i mevcut ile birleştirir.
              // Sonuç: "nav-link is-active" → styles.css'teki underline animasyonu tetiklenir.
              activeProps={{ className: 'nav-link is-active' }}
              // "/" için exact match zorunlu, yoksa tüm route'larda aktif görünür.
              activeOptions={link.to === '/' ? { exact: true } : undefined}
            >
              {link.label}
            </Link>
          ))}

          {/* Var olan ThemeToggle bileşenini koruyoruz */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
