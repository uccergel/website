// Türkçe tarih biçimlendirme
const bicimlendirici = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function tarihYaz(tarih: Date): string {
  return bicimlendirici.format(tarih);
}

export function isoTarih(tarih: Date): string {
  return tarih.toISOString().slice(0, 10);
}

// Tarihe göre tersten sırala (yeni → eski)
export function yeniden<T extends { data: { tarih: Date } }>(liste: T[]): T[] {
  return [...liste].sort(
    (a, b) => b.data.tarih.valueOf() - a.data.tarih.valueOf(),
  );
}
