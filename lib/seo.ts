import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

const SITE_URL = 'https://aktifosgb.com.tr'
const DEFAULT_IMAGE = 'https://aktifosgb.com.tr/wp-content/uploads/2020/02/aktifosgblogo.png'

export async function getSeoMetadata(sayfa: string): Promise<Metadata> {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await sb.from('site_seo').select('*').eq('sayfa', sayfa).single()

  if (!data) return getDefaultMetadata(sayfa)

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    robots: data.robots || 'index, follow',
    alternates: { canonical: data.canonical || `${SITE_URL}${sayfa}` },
    openGraph: {
      title: data.og_title || data.title,
      description: data.og_description || data.description,
      url: data.canonical || `${SITE_URL}${sayfa}`,
      siteName: 'Aktif OSGB',
      locale: 'tr_TR',
      type: 'website',
      images: [{ url: data.og_image || DEFAULT_IMAGE, width: 1200, height: 630, alt: data.og_title || data.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.og_title || data.title,
      description: data.og_description || data.description,
      images: [data.og_image || DEFAULT_IMAGE],
    },
  }
}

function getDefaultMetadata(sayfa: string): Metadata {
  return {
    title: 'Aktif OSGB | Afyon İş Güvenliği',
    description: '2014\'ten bu yana Afyonkarahisar\'da yetkili OSGB hizmetleri.',
    openGraph: {
      siteName: 'Aktif OSGB',
      locale: 'tr_TR',
      images: [{ url: DEFAULT_IMAGE }],
    },
  }
}

// JSON-LD LocalBusiness schema
export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Aktif OSGB',
  description: '2014 yılından bu yana Afyonkarahisar\'da yetkili iş sağlığı ve güvenliği hizmetleri.',
  url: 'https://aktifosgb.com.tr',
  logo: 'https://aktifosgb.com.tr/wp-content/uploads/2020/02/aktifosgblogo.png',
  image: 'https://aktifosgb.com.tr/wp-content/uploads/2020/02/aktifosgblogo.png',
  telephone: ['+90-272-223-20-03', '+90-553-169-68-67'],
  email: 'info@aktifosgb.com.tr',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dumlupınar Mah., Atatürk Cad. No:49/1A',
    addressLocality: 'Merkez',
    addressRegion: 'Afyonkarahisar',
    postalCode: '03100',
    addressCountry: 'TR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 38.7555,
    longitude: 30.5389,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '15:00' },
  ],
  sameAs: [
    'https://www.facebook.com/afyonaktifOSGB/',
    'https://www.instagram.com/aktifosgb/',
  ],
  priceRange: '₺₺',
  areaServed: { '@type': 'City', name: 'Afyonkarahisar' },
}
