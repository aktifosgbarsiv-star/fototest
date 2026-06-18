import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer style={{ background:'#1a1a2e', color:'#c8cad8', fontFamily:"'Inter',-apple-system,system-ui,sans-serif" }}>
      {/* Ana footer */}
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'56px 32px 40px' }}>
        <div className="site-footer-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40 }}>

          {/* Marka */}
          <div>
            <img src="/logo.png" alt="Aktif OSGB" style={{ height:44, objectFit:'contain', marginBottom:16, filter:'brightness(1)' }} />
            <p style={{ fontSize:13, lineHeight:1.8, color:'#9098b1', maxWidth:260 }}>
              2014'ten bu yana Afyonkarahisar'da güvenilir iş sağlığı ve güvenliği hizmetleri.
            </p>
            <div style={{ marginTop:20, display:'flex', gap:10 }}>
              <a href="https://wa.me/905531696867" target="_blank" rel="noopener noreferrer"
                style={{ background:'#25D366', color:'#fff', padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:700, textDecoration:'none' }}>
                💬 WhatsApp
              </a>
              <a href="tel:05531696867"
                style={{ background:'rgba(255,255,255,.08)', color:'#c8cad8', padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:600, textDecoration:'none' }}>
                📞 Ara
              </a>
            </div>
          </div>

          {/* Hizmetler */}
          <div>
            <h4 style={{ color:'#f5c200', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>Hizmetler</h4>
            {['İş Güvenliği','İşyeri Hekimliği','Sağlık Taraması','Eğitimler','Ramak Kala'].map(h => (
              <div key={h} style={{ marginBottom:10 }}>
                <a href="/hizmetlerimiz" style={{ color:'#9098b1', textDecoration:'none', fontSize:13, transition:'color .15s' }}>{h}</a>
              </div>
            ))}
          </div>

          {/* Kurumsal */}
          <div>
            <h4 style={{ color:'#f5c200', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>Kurumsal</h4>
            {[
              { label:'Hakkımızda', href:'/kurumsal' },
              { label:'Ekibimiz', href:'/ekibimiz' },
              { label:'Referanslar', href:'/referanslar' },
              { label:'Yazılarımız', href:'/yazilarimiz' },
              { label:'İletişim', href:'/iletisim' },
            ].map(l => (
              <div key={l.href} style={{ marginBottom:10 }}>
                <a href={l.href} style={{ color:'#9098b1', textDecoration:'none', fontSize:13 }}>{l.label}</a>
              </div>
            ))}
          </div>

          {/* İletişim */}
          <div>
            <h4 style={{ color:'#f5c200', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>İletişim</h4>
            <div style={{ fontSize:13, color:'#9098b1', lineHeight:2 }}>
              <div>📍 Afyonkarahisar, Türkiye</div>
              <div><a href="tel:05531696867" style={{ color:'#9098b1', textDecoration:'none' }}>📞 0 553 169 68 67</a></div>
              <div><a href="mailto:info@aktifosgb.com.tr" style={{ color:'#9098b1', textDecoration:'none' }}>✉️ info@aktifosgb.com.tr</a></div>
              <div style={{ marginTop:14 }}>
                <a href="/tehlike-sinifi" style={{ display:'inline-block', padding:'8px 14px', borderRadius:8, background:'rgba(245,194,0,.12)', border:'1px solid rgba(245,194,0,.3)', color:'#f5c200', fontSize:12, fontWeight:700, textDecoration:'none' }}>
                  Tehlike Sınıfı Sorgula →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alt bar */}
      <div style={{ borderTop:'1px solid rgba(255,255,255,.07)', padding:'18px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, maxWidth:1280, margin:'0 auto' }}>
        <p style={{ fontSize:12, color:'#5a6070' }}>© {new Date().getFullYear()} Aktif OSGB. Tüm hakları saklıdır.</p>
        <p style={{ fontSize:12, color:'#5a6070' }}>6331 Sayılı İş Sağlığı ve Güvenliği Kanunu Kapsamında Yetkili OSGB</p>
      </div>
    </footer>
  )
}
