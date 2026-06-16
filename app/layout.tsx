import type { Metadata } from 'next'
import './globals.css'
import Shell from '@/components/Shell'
import { LOCAL_BUSINESS_SCHEMA } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL('https://aktifosgb.com.tr'),
  title: { default: 'Aktif OSGB | Afyon İş Güvenliği - İşe Giriş Sağlık Raporu', template: '%s | Aktif OSGB' },
  description: '2014\'ten bu yana Afyonkarahisar\'da yetkili OSGB hizmetleri. İşyeri hekimliği, iş güvenliği uzmanlığı, mobil sağlık taraması.',
  keywords: 'Afyon OSGB, Afyonkarahisar iş güvenliği, işe giriş sağlık raporu, işyeri hekimi, iş güvenliği uzmanı',
  authors: [{ name: 'Aktif OSGB' }],
  creator: 'Aktif OSGB',
  publisher: 'Aktif OSGB',
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://aktifosgb.com.tr',
    siteName: 'Aktif OSGB',
    title: 'Aktif OSGB | Afyon İş Güvenliği',
    description: '2014\'ten bu yana Afyonkarahisar\'da yetkili OSGB hizmetleri.',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Aktif OSGB Logo' }],
  },
  twitter: { card: 'summary_large_image', title: 'Aktif OSGB | Afyon İş Güvenliği', description: '2014\'ten bu yana Afyonkarahisar\'da yetkili OSGB hizmetleri.', images: ['/logo.png'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  verification: { google: '', yandex: '5ebcf3f9d59c13bd', other: { 'msvalidate.01': ['F781B011863FA586706406E04E3EC7EF'] } },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_SCHEMA) }} />
      </head>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  )
}
