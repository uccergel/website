# website — kişisel site

Kişisel web sitesi: hakkımda, blog (MDX yazılar, okunan kitaplar, yer imleri) ve
projeler. Tek geliştirici. Dokploy ile yayında.

@docs/standards/CLAUDE.md

Yukarıdaki ortak standartlar (çalışma kuralları, "bitti" tanımı, güvenlik kontrol listesi,
wiki disiplini) bu projede de geçerlidir. Kaynak: `uccergel/dev-standards`, `docs/standards/`
altında git submodule. Bu dosya yalnızca bu siteye özel kuralları ve standarttan sapmaları tutar.

## Stack

- TanStack Start (SSR) + Router (dosya tabanlı) + Query, React 19, Vite 8
- MDX: `@mdx-js/rollup` + `remark-gfm`, `remark-frontmatter`, `remark-mdx-frontmatter`,
  `rehype-highlight`
- Tailwind v4 (`@tailwindcss/vite`), shadcn/ui (`radix-ui`), `lucide-react`
- Sunucu: `server.mjs` (srvx) — `dist/server/server.js` handler'ını ve `dist/client`
  statik dosyalarını servis eder (sıkıştırma, MIME, cache başlıkları burada); ayrıca
  `GET /api/healthz` canlılık ucu (SSR'a uğramaz; Docker healthcheck'i ve dash yoklar)
- Dağıtım: `Dockerfile` (çok aşamalı, `node:22-alpine`, root olmayan kullanıcı) +
  `docker-compose.yml` → Dokploy (Traefik, `dokploy-network`, container portu 3000)

Tek parçalı uygulama: standarttaki `web/` alt klasörü yok, proje kökte durur.

## Klasör düzeni

```
src/
  routes/        dosya tabanlı rotalar: index, about/, blog/{posts,books,bookmarks}/, projects/
  content/       sitenin içeriği — kod değil veri
    blogs/       *.mdx yazılar (frontmatter: title, date, description, tags, author, draft)
    books/       bookEntries: okunan kitaplar (künye Open Library'den tamamlanır)
    bookmarks/   BOOKMARK_COLLECTIONS: Raindrop koleksiyonları
    projects/    projects: proje kartları
    about/       hakkımda verisi
  components/    site bileşenleri; ui/ altında shadcn (elle düzenlenmez)
  lib/           blog.ts (MDX yükleme), books.ts + openLibrary.ts, raindrop.ts, env.ts
  styles/        tokens, primitives, utilities, animations, fonts
  routeTree.gen.ts  üretilir (vite / `npm run generate-routes`), elle düzenlenmez
```

- **Yeni blog yazısı:** `src/content/blogs/<slug>.mdx`. `lib/blog.ts`
  `import.meta.glob` ile build anında toplar; ayrıca kayıt gerekmez. Dosya adı = URL slug'ı.
  `draft: true` olan yazı yayınlanmaz.
- **Yeni kitap / proje / yer imi koleksiyonu:** ilgili `src/content/*/index.ts`
  dizisine bir öğe ekle.
- Import takma adı `#/` (`package.json` → `imports`): `import { cn } from '#/lib/utils'`.

## Standarttan sapmalar

- **Backend yok:** standarttaki API, domain eşleme tablosu, auth ve veritabanı maddeleri
  bu projede uygulanmaz. Sunucu tarafı yalnızca `createServerFn` (Raindrop) ve SSR'dır.
- **Kod yorumları Türkçe** (mevcut kod böyle yazılmış: `lib/env.ts`, `lib/blog.ts`).
  Tanımlayıcılar İngilizce, kullanıcıya görünen metin Türkçe.
- **Paket yöneticisi npm.** `package.json`'daki `pnpm` alanı ve `.cursorrules`'taki
  `pnpm dlx` komutu eski şablondan kalma; lock dosyası `package-lock.json`, Dockerfile
  `npm ci` kullanır. shadcn bileşeni eklemek için: `npx shadcn@latest add <bileşen>`.
- **Biçim:** Prettier (`prettier.config.js`): noktalı virgül yok, tek tırnak,
  `trailingComma: 'none'`, 80 sütun.

## Secret'lar ve güvenlik

- `RAINDROP_TOKEN` yalnızca sunucuda okunur: `lib/env.ts` → `getServerEnv()`, yalnızca
  `createServerFn` içinden çağrılır (`lib/raindrop.ts`). `env.ts` istemci koduna import
  edilmez; secret `VITE_*` değişkenine konmaz.
- `.env` git dışıdır, örnek `.env.example`. Dokploy'da değişkenler arayüzden verilir.
- Open Library çağrıları anahtarsızdır, istemcide de çalışabilir.
- Bağımlılık eklerken sabit sürüm kullan; `"latest"` yazma (bkz. "Bilinen açık işler").

## Komutlar

- Geliştirme: `npm run dev` (→ http://localhost:3000)
- Build: `npm run build` (`vite build`, `routeTree.gen.ts`'i de üretir)
- Üretim sunucusu: `npm start` (`node server.mjs`, önce build)
- Lint: `npm run lint` · Biçim kontrolü: `npm run check` · Biçimle + düzelt: `npm run format`
- Test: `npm run test` (Vitest)
- Tip kontrolü: `npx tsc --noEmit` (package.json'da script'i yok)
- Rota ağacını yeniden üret: `npm run generate-routes`
- Docker: `docker compose up --build` (`dokploy-network` dış ağı gerekir; yerelde
  yoksa `docker network create dokploy-network`)

## Bitirmeden önce

- [ ] `npm run build` başarılı
- [ ] `npm run lint` ve `npx tsc --noEmit` — dokunduğun dosyalarda yeni hata yok
- [ ] `npm run check` — dokunduğun dosyalar Prettier'a uygun (yalnızca onları biçimle;
      `npm run format`'ı toplu çalıştırma, mevcut 23 dosyalık fark ayrı bir iştir)
- [ ] Mantık içeren kod eklediysen testi var (`*.test.ts`, Vitest)

## Bilinen açık işler (2026-11-19 itibarıyla)

- `lint` 2 hata (shadcn'den gelen `ui/button.tsx`, `lib/utils.ts`), `tsc` 1 hata
  (`header.tsx`, davranış etkisi yok), `check` 23 dosyada biçim farkı veriyor.
  Ayrıntı: `wiki/gunluk/2026-11-19-ortak-standartlar.md`. Raindrop'taki iki hata
  düzeltildi: `wiki/gunluk/2026-11-19-raindrop-hatalari.md`.
- Test yalnızca `src/lib/raindrop.test.ts`'te var.
- `package.json`'da 12 bağımlılık `"latest"` (TanStack paketleri): lock dosyası
  sabitliyor ama `npm install` her seferinde yeni sürüm çekebilir.
- `.idea/` (JetBrains) ayar dosyaları repoda; `workspace.xml` kişisel çalışma durumu taşır.

## Yapma

- `src/components/ui/` (shadcn) ve `src/routeTree.gen.ts` dosyalarını elle düzenleme.
- `docs/standards/` altını bu repoda düzenleme; standart değişikliği `uccergel/dev-standards`'ta
  yapılır, burada `git submodule update --remote docs/standards` ile alınır.
