import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE } from "../config";

export async function GET(context: APIContext) {
  const yazilar = (await getCollection("yazilar")).filter(
    (y) => !y.data.taslak,
  );

  return rss({
    title: SITE.isim,
    description: SITE.aciklama,
    site: context.site ?? SITE.url,
    items: yazilar
      .sort((a, b) => b.data.tarih.valueOf() - a.data.tarih.valueOf())
      .map((y) => ({
        title: y.data.baslik,
        description: y.data.ozet ?? "",
        pubDate: y.data.tarih,
        link: `/yazilar/${y.id}/`,
      })),
    customData: `<language>tr-TR</language>`,
  });
}
