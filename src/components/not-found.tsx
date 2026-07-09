import { Link, useRouter } from '@tanstack/react-router'

export function NotFound() {
  const router = useRouter()

  return (
    <main className="page-wrap flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="island-shell rise-in rounded-[2rem] px-8 py-14 sm:px-14">
        {/* Büyük hata kodu */}
        <p className="display-title text-7xl font-bold text-(--lagoon) sm:text-9xl">
          404
        </p>

        <h1 className="mt-4 text-2xl font-semibold text-(--sea-ink)">
          Sayfa Bulunamadı
        </h1>

        <p className="mt-3 max-w-md text-base leading-relaxed text-(--sea-ink-soft)">
          Aradığınız sayfa mevcut değil, taşınmış ya da silinmiş olabilir.
        </p>

        {/* Aksiyon butonları */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.history.back()}
            className="island-kicker rounded-xl border border-(--chip-line) bg-(--chip-bg) px-4 py-2 text-xs transition hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)"
          >
            ← Geri Dön
          </button>

          <Link
            to="/"
            className="island-kicker rounded-xl bg-[rgba(79,184,178,0.15)] px-4 py-2 text-xs text-(--lagoon-deep) transition hover:bg-[rgba(79,184,178,0.25)]"
          >
            Ana Sayfaya Git →
          </Link>
        </div>
      </div>
    </main>
  )
}
