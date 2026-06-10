// Sitenin genel ayarları — buradan kolayca düzenleyebilirsin.

export const SITE = {
  isim: "Uğur Cem Çergel",
  baslik: "Uğur Cem Çergel — Kişisel Blog",
  aciklama:
    "İletişim yöneticisi, kimyager ve bilgisayar mühendisi. Yazılım, deri ve ahşap işçiliği, bateri ve bas gitar üzerine notlar, fotoğraflar ve kitap yorumları.",
  url: "https://uccergel.github.io",
  dil: "tr",
};

// Üst menü
export const NAV = [
  { ad: "Anasayfa", yol: "/" },
  { ad: "Yazılar", yol: "/yazilar" },
  { ad: "Kitaplar", yol: "/kitaplar" },
  { ad: "Galeri", yol: "/galeri" },
  { ad: "Bookmark", yol: "/bookmarks" },
  { ad: "Hakkımda", yol: "/hakkimda" },
];

// Sosyal bağlantılar — kullanmadıklarını silebilir, yenilerini ekleyebilirsin.
export const SOSYAL = [
  { ad: "GitHub", url: "https://github.com/uccergel", ikon: "github" },
  { ad: "LinkedIn", url: "https://www.linkedin.com/", ikon: "linkedin" },
  { ad: "Instagram", url: "https://www.instagram.com/", ikon: "instagram" },
  { ad: "E-posta", url: "mailto:ugurcemcergel@gmail.com", ikon: "mail" },
];

// İlgi alanları / hobiler — anasayfada gösterilir.
export const ILGI_ALANLARI = [
  {
    ad: "Yazılım",
    aciklama: "Hobi olarak kod yazıyorum; küçük araçlar ve denemeler.",
    ikon: "code",
  },
  {
    ad: "Deri İşçiliği",
    aciklama: "El dikişi cüzdanlar, kemerler ve küçük deri eşyalar.",
    ikon: "leather",
  },
  {
    ad: "Ahşap İşçiliği",
    aciklama: "Ahşap objeler ve küçük mobilya denemeleri.",
    ikon: "wood",
  },
  {
    ad: "Bateri & Bas Gitar",
    aciklama: "Ritim ve groove peşinde; çalmaktan keyif alıyorum.",
    ikon: "music",
  },
];
