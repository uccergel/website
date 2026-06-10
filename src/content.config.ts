import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

// Blog yazıları — Markdown
const yazilar = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/yazilar" }),
  schema: ({ image }) =>
    z.object({
      baslik: z.string(),
      ozet: z.string().optional(),
      tarih: z.coerce.date(),
      etiketler: z.array(z.string()).default([]),
      kapak: image().optional(),
      taslak: z.boolean().default(false),
    }),
});

// Okuduğum kitaplar ve yorumları — Markdown
const kitaplar = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/kitaplar" }),
  schema: ({ image }) =>
    z.object({
      baslik: z.string(),
      yazar: z.string(),
      tarih: z.coerce.date(),
      puan: z.number().min(1).max(5).optional(),
      durum: z.enum(["okudum", "okuyorum", "okunacak"]).default("okudum"),
      kapak: image().optional(),
      ozet: z.string().optional(),
      taslak: z.boolean().default(false),
    }),
});

// Bookmark / bağlantılar — tek bir veri dosyası
const bookmarks = defineCollection({
  loader: file("./src/content/bookmarks.json"),
  schema: z.object({
    id: z.string(),
    baslik: z.string(),
    url: z.string().url(),
    aciklama: z.string().optional(),
    kategori: z.string().default("Genel"),
  }),
});

export const collections = { yazilar, kitaplar, bookmarks };
