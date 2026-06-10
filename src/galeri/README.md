# Galeri

Bu klasöre fotoğraf (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`) eklediğinde
**Galeri** sayfasında otomatik olarak görünür ve Astro tarafından boyut/biçim
açısından optimize edilir.

İpuçları:

- Dosya adı, fotoğrafın altında başlık olarak kullanılır.
  Örnek: `ahsap-kasik-yapimi.jpg` → "ahsap kasik yapimi"
- Tireler (`-`) ve alt çizgiler (`_`) boşluğa çevrilir.
- Fotoğraflar dosya adına göre tersten (yeni → eski gibi) sıralanır; istersen
  başına `2026-01-` gibi tarih ekleyerek sırayı kontrol edebilirsin.
