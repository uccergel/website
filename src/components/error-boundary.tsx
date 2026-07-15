import { Link, useRouter } from '@tanstack/react-router'

interface ErrorBoundaryProps {
  error: Error
  reset?: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter()

  // Geliştirme ortamında hata detayını göster
  const isDev = import.meta.env.DEV

  return (
    <div className="page-wrap flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <div className="island-shell rise-in rounded-[2rem] px-8 py-14 sm:px-14">
        {/* İkon */}
        <p className="text-5xl">⚠️</p>

        <h1 className="mt-4 text-2xl font-semibold text-(--sea-ink)">
          Bir Şeyler Ters Gitti
        </h1>

        <p className="mt-3 max-w-md text-base leading-relaxed text-(--sea-ink-soft)">
          Beklenmedik bir hata oluştu. Sayfayı yenilemeyi ya da ana sayfaya
          dönmeyi deneyin.
        </p>

        {/* Geliştirme ortamında hata detayı */}
        {isDev && (
          <details className="mt-6 rounded-xl border border-(--line) bg-(--sand) p-4 text-left">
            <summary className="island-kicker cursor-pointer text-xs text-(--sea-ink-soft)">
              Hata Detayı (sadece geliştirme ortamında görünür)
            </summary>
            <pre className="mt-3 overflow-x-auto text-xs text-red-600">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          </details>
        )}

        {/* Aksiyon butonları */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="island-kicker rounded-xl border border-(--chip-line) bg-(--chip-bg) px-4 py-2 text-xs transition hover:border-(--lagoon-deep) hover:text-(--lagoon-deep)"
            >
              ↺ Tekrar Dene
            </button>
          )}

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
    </div>
  )
}
