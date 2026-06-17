import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ⚙️ BAKIM MODU — true = bakımda, false = açık
const BAKIM_MODU = false

const ROL_ERISIM: Record<string, string[]> = {
  yonetici:  ['/dashboard','/firmalar','/ara','/saglik','/teklifler','/tahsilat','/koordinasyon','/idari','/ziyaretler','/hekim','/malzemeler','/tedarikciler','/taramalar','/personeller','/raporlar','/fatura','/eksik-veriler','/arsiv','/site'],
  operasyon: ['/dashboard','/firmalar','/saglik','/koordinasyon','/ziyaretler','/taramalar','/arsiv'],
  hekim:     ['/dashboard','/koordinasyon','/saglik'],
  satis:     ['/dashboard','/firmalar','/koordinasyon','/ziyaretler','/teklifler','/tahsilat','/saglik','/taramalar'],
  muhasebe:  ['/dashboard','/firmalar','/koordinasyon','/saglik','/ziyaretler','/teklifler','/tahsilat','/taramalar'],
  saha:      ['/dashboard','/koordinasyon','/ziyaretler','/arsiv'],
}

const ROL_ANA_SAYFA: Record<string, string> = {
  yonetici:  '/dashboard',
  operasyon: '/dashboard',
  hekim:     '/saglik',
  satis:     '/teklifler',
  muhasebe:  '/tahsilat',
  saha:      '/koordinasyon',
}

// Panel sayfaları — /arsiv eklendi
const PANEL_SAYFALAR = [
  '/dashboard','/firmalar','/ara','/saglik','/teklifler','/tahsilat','/koordinasyon',
  '/idari','/ziyaretler','/hekim','/malzemeler','/tedarikciler','/taramalar',
  '/personeller','/raporlar','/fatura','/eksik-veriler','/arsiv','/site'
]

const PUBLIC_SAYFALAR = [
  '/kurumsal','/ekibimiz','/hizmetlerimiz','/egitimler',
  '/referanslar','/yazilarimiz','/iletisim',
  '/tehlike-sinifi','/ramak-kala','/portal'
]

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req })
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')

  const path = req.nextUrl.pathname

  if (path.startsWith('/_next') || path.startsWith('/api') || path === '/favicon.ico') return res

  if (BAKIM_MODU) {
    if (path === '/bakim') return res
    const bakimHaric = [...PANEL_SAYFALAR, '/giris']
    if (!bakimHaric.some(p => path === p || path.startsWith(p + '/'))) {
      return NextResponse.redirect(new URL('/bakim', req.url))
    }
  }

  if (PUBLIC_SAYFALAR.some(p => path === p || path.startsWith(p + '/'))) return res

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll() },
        setAll(cs) {
          cs.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({ request: req })
          res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
          cs.forEach(({ name, value, options }) => res.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  async function getRol(): Promise<string> {
    if (!user) return 'operasyon'
    const { data: personel } = await supabase.from('personeller').select('rol').eq('id', user.id).single()
    return personel?.rol || 'operasyon'
  }

  if (path === '/') {
    if (user) {
      const rol = await getRol()
      return NextResponse.redirect(new URL(ROL_ANA_SAYFA[rol] || '/koordinasyon', req.url))
    }
    return res
  }

  if (path === '/giris') {
    if (user) {
      const rol = await getRol()
      return NextResponse.redirect(new URL(ROL_ANA_SAYFA[rol] || '/koordinasyon', req.url))
    }
    return res
  }

  const isPanelSayfasi = PANEL_SAYFALAR.some(p => path === p || path.startsWith(p + '/'))
  if (isPanelSayfasi) {
    if (!user) return NextResponse.redirect(new URL('/giris', req.url))
    const rol = await getRol()
    const izinli = ROL_ERISIM[rol] || ROL_ERISIM.operasyon
    const yetkili = izinli.some(r => path === r || path.startsWith(r + '/'))
    if (!yetkili) return NextResponse.redirect(new URL(ROL_ANA_SAYFA[rol] || '/koordinasyon', req.url))
  }

  return res
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
