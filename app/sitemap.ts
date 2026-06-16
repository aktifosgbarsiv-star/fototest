import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aktifosgb.com.tr'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/kurumsal`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/ekibimiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/hizmetlerimiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/egitimler`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/referanslar`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/yazilarimiz`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/iletisim`, lastModified: now, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${base}/tehlike-sinifi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/ramak-kala`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
