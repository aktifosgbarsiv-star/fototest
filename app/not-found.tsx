import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı | Aktif OSGB',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', background: '#0a0a0f',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter',-apple-system,system-ui,sans-serif",
      padding: 32, textAlign: 'center',
    }}>
      <div style={{ maxWidth: 480 }}>
        <img src="/logo.png"
          alt="Aktif OSGB" style={{ height: 48, marginBottom: 40, opacity: .85 }} />

        <div style={{ fontSize: 80, fontWeight: 900, color: 'rgba(245,194,0,.15)', lineHeight: 1, letterSpacing: -4, marginBottom: 8 }}>404</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: -0.5 }}>Sayfa Bulunamadı</h1>
        <p style={{ fontSize: 15, color: '#5d5d7a', lineHeight: 1.7, marginBottom: 36 }}>
          Aradığınız sayfa taşınmış veya kaldırılmış olabilir. Ana sayfaya dönerek devam edebilirsiniz.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
          <Link href="/" style={{ padding: '12px 24px', borderRadius: 10, background: 'linear-gradient(135deg,#f5c200,#e6a800)', color: '#0a0a0f', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
            Ana Sayfaya Dön
          </Link>
          <Link href="/iletisim" style={{ padding: '12px 20px', borderRadius: 10, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: '#c8c8e0', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            İletişim
          </Link>
        </div>

        {/* Hızlı linkler */}
        <div style={{ background: '#0e0e1c', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: 24 }}>
          <p style={{ fontSize: 12, color: '#5d5d7a', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Popüler Sayfalar</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              ['/hizmetlerimiz', '🛡️ Hizmetlerimiz'],
              ['/egitimler', '🎓 Eğitimler'],
              ['/tehlike-sinifi', '🔍 Tehlike Sınıfı'],
              ['/referanslar', '🏢 Referanslar'],
              ['/kurumsal', '📋 Hakkımızda'],
              ['/iletisim', '📞 İletişim'],
            ].map(([href, label]) => (
              <Link key={href} href={href} style={{
                padding: '10px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: 'rgba(245,194,0,.06)', border: '1px solid rgba(245,194,0,.1)',
                color: '#c8c8e0', textDecoration: 'none', textAlign: 'left',
              }}>{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
