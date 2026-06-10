# uccergel.github.io

Uğur Cem Çergel'in kişisel blogu — yazılar, fotoğraflar, kitap yorumları ve
bookmark'lar. [**Astro**](https://astro.build) ile geliştirildi ve GitHub Pages
üzerinde yayınlanıyor.

🔗 https://uccergel.github.io

## Geliştirme

```bash
npm install      # bağımlılıkları yükle
npm run dev      # yerel sunucu → http://localhost:4321
npm run build    # üretim derlemesi → dist/
npm run preview  # derlemeyi yerelde önizle
```

> Node.js 20+ gerekir.

## İçerik nasıl eklenir?

Kod bilgisi gerektirmeden, sadece dosya ekleyerek içerik yönetebilirsin.

### ✍️ Yazı eklemek

`src/content/yazilar/` içine yeni bir `.md` dosyası oluştur:

```markdown
---
baslik: "Yazının başlığı"
ozet: "Listelerde görünecek kısa açıklama."
tarih: 2026-06-10
etiketler: ["deri", "atolye"]
# kapak: ./gorsel.jpg   # (isteğe bağlı) dosyayı yazının yanına koy
---

Yazının içeriği buraya, Markdown olarak...
```

`taslak: true` eklersen yazı yayınlanmaz (sadece taslak olarak durur).

### 📚 Kitap eklemek

`src/content/kitaplar/` içine `.md` dosyası ekle:

```markdown
---
baslik: "Kitabın adı"
yazar: "Yazar Adı"
tarih: 2026-06-10
puan: 4           # 1–5 arası (isteğe bağlı)
durum: "okudum"   # okudum | okuyorum | okunacak
ozet: "Kısa bir cümle."
# kapak: ./kapak.jpg
---

Kitap hakkındaki yorumun...
```

### 📷 Fotoğraf eklemek

`src/galeri/` klasörüne görsel (`.jpg`, `.png`, `.webp` …) at — Galeri
sayfasında otomatik görünür. Dosya adı başlık olarak kullanılır.

### 🔖 Bookmark eklemek

`src/content/bookmarks.json` dosyasına yeni bir nesne ekle:

```json
{
  "id": "benzersiz-id",
  "baslik": "Bağlantı başlığı",
  "url": "https://ornek.com",
  "aciklama": "Kısa açıklama (isteğe bağlı).",
  "kategori": "Yazılım"
}
```

### ⚙️ Site ayarları

İsim, menü, sosyal bağlantılar ve hobiler `src/config.ts` dosyasında —
buradan kolayca düzenleyebilirsin.

## Yayınlama

`main` dalına her push'ta `.github/workflows/deploy.yml` iş akışı siteyi
derleyip GitHub Pages'e yayınlar. Bir kerelik ayar: repo **Settings → Pages →
Build and deployment → Source** kısmını **GitHub Actions** olarak seç.
