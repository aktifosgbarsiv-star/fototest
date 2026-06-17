import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard', '/giris', '/firmalar', '/saglik', '/koordinasyon',
          '/teklifler', '/tahsilat', '/ziyaretler', '/hekim', '/malzemeler',
          '/tedarikciler', '/taramalar', '/personeller', '/raporlar', '/fatura',
          '/eksik-veriler', '/arsiv', '/site', '/ara', '/idari', '/api/',
          '/portal/dosyalar',
        ],
      },
    ],
    sitemap: 'https://aktifosgb.com.tr/sitemap.xml',
    host: 'https://aktifosgb.com.tr',
  }
}
