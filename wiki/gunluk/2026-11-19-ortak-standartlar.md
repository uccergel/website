---
title: Ortak standartlara bağlanma ve ilk CLAUDE.md
date: 2026-11-19
phase: bakim
type: gunluk
tags: [claude-md, standartlar, submodule, wiki]
related: [CLAUDE.md, .gitmodules, .claude/settings.json]
status: kapandi
---

# Oturum Günlüğü — 2026-11-19

## Yapılanlar

- `uccergel/dev-standards` `docs/standards/` altına submodule olarak eklendi.
- İlk kök `CLAUDE.md` yazıldı: ortak standartları import eder; stack, klasör düzeni,
  içerik ekleme yolu (MDX yazı, kitap, proje, yer imi), secret kuralı, komutlar,
  "Bitirmeden önce" listesi, bilinen açık işler.
- `.claude/settings.json` (ortak izinler) eklendi. Önceki tek AI kuralı dosyası
  `.cursorrules` (shadcn komutu) yerinde bırakıldı.
- `wiki/` açıldı: `README.md`, `gunluk/`, `daily-done/` (şablonlarıyla).

## Alınan kararlar ve gerekçeleri

- **Tek parçalı yapı korundu:** standart, tek parçalı uygulamaların kökte kalmasını
  söylüyor; `web/` alt klasörüne taşımak Dockerfile ve yolları bozmaktan başka kazanç getirmezdi.
- **Paket yöneticisi npm:** `package.json`'da `pnpm` alanı ve `.cursorrules`'ta
  `pnpm dlx` var, ama lock dosyası `package-lock.json` ve Dockerfile `npm ci`
  kullanıyor; gerçeği yansıtan npm. Eski alanlar bu işte silinmedi (küçük diff).
- **Wiki küçük başladı:** yalnızca `gunluk/` ve `daily-done/`; boş klasör açmak yerine
  ihtiyaç oldukça şablondan açılacak.

## Karşılaşılan sorunlar

Bugünkü durum ölçüldü (`main` @ `4482a19`, bu işin değişikliklerinden önce):

| Kontrol                    | Sonuç                                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`            | ✅ başarılı                                                                                                                            |
| `npm run lint`             | ❌ 2 hata — `import/consistent-type-specifier-style`, `src/components/ui/button.tsx` ve `src/lib/utils.ts` (shadcn'den gelen dosyalar) |
| `npx tsc --noEmit`         | ❌ 3 hata (aşağıda)                                                                                                                    |
| `npm run check` (Prettier) | ❌ 23 dosyada biçim farkı; ayrıca `prettier.config.js`'te bilinmeyen `fluid` seçeneği                                                  |
| `npm run test`             | ❌ hiç test dosyası yok                                                                                                                |

`tsc` hatalarından ikisi **gerçek hata**:

1. `src/lib/raindrop.ts:68` — hata mesajında tanımsız `body` değişkeni. Raindrop API
   başarısız yanıt verdiğinde `RaindropApiError` yerine `ReferenceError` fırlatılır;
   durum kodu ve anlamlı mesaj kaybolur.
2. `src/lib/raindrop.ts:133` — `getRaindropsByCollections` sunucu fonksiyonunu
   `getRaindropsByCollection(collection.id)` diye çağırıyor; `createServerFn`
   `{ data: … }` bekler (`routes/blog/index.tsx` doğru biçimi kullanıyor). Sonuç:
   `/blog/bookmarks` sayfası yanlış koleksiyon adresi isteyip boş/hatalı dönüyor olmalı.
   Canlıda doğrulanmadı.

Üçüncüsü (`src/components/header.tsx:44`, `link.to === '/'` karşılaştırması) tip
düzeyinde: nav listesinde `/` olmadığı için koşul hiç doğru olmuyor, davranış hatası yok.

## Sonraki adım

- `raindrop.ts`'teki iki hatayı düzelt (`fix:` commit'i) ve `/blog/bookmarks`'ı canlıda kontrol et.
- 12 `"latest"` bağımlılığı lock dosyasındaki sürümlere sabitle.
- Lint/Prettier temizliğini ayrı bir `style:` commit'inde yap; `fluid` seçeneğini kaldır.
- `.idea/`'yı repodan çıkar ve `.gitignore`'a ekle.
