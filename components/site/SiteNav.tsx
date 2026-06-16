'use client'
import { useEffect } from 'react'

const LINKLER = [
  { href: '/kurumsal', label: 'Kurumsal' },
  { href: '/hizmetlerimiz', label: 'Hizmetler' },
  { href: '/egitimler', label: 'Eğitimler' },
  { href: '/ekibimiz', label: 'Ekibimiz' },
  { href: '/referanslar', label: 'Referanslar' },
  { href: '/yazilarimiz', label: 'Yazılarımız' },
  { href: '/iletisim', label: 'İletişim' },
]

export default function SiteNav() {
  useEffect(() => {
    // Body overflow her sayfa yüklenince temizle
    document.body.style.overflow = ''

    const burger = document.getElementById('snav-burger')
    const panel = document.getElementById('snav-panel')
    const overlay = document.getElementById('snav-overlay')
    const close = document.getElementById('snav-close')

    if (!burger || !panel || !overlay || !close) return

    function ac() {
      panel!.style.transform = 'translateX(0)'
      overlay!.style.display = 'block'
      document.body.style.overflow = 'hidden'
    }
    function kapat() {
      panel!.style.transform = 'translateX(-100%)'
      overlay!.style.display = 'none'
      document.body.style.overflow = ''
    }

    burger.addEventListener('click', ac)
    overlay.addEventListener('click', kapat)
    close.addEventListener('click', kapat)

    // Drawer içindeki tüm linklere tıklanınca kapat
    const links = panel.querySelectorAll('a')
    links.forEach(l => l.addEventListener('click', kapat))

    return () => {
      burger.removeEventListener('click', ac)
      overlay.removeEventListener('click', kapat)
      close.removeEventListener('click', kapat)
      links.forEach(l => l.removeEventListener('click', kapat))
    }
  }, [])

  return (
    <>
      {/* INFO BAR */}
      <div style={{background:'#f5c200',padding:'6px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:12,color:'#1a1a1a',fontWeight:600}}>
        <span>📞 0 553 169 68 67 &nbsp;|&nbsp; ✉️ info@aktifosgb.com.tr</span>
        <span style={{display:'flex',gap:14}}>
          <a href="https://www.facebook.com/afyonaktifOSGB/" target="_blank" rel="noopener noreferrer" style={{color:'#1a1a1a',textDecoration:'none',fontWeight:700}}>FB</a>
          <a href="https://www.instagram.com/aktifosgb/" target="_blank" rel="noopener noreferrer" style={{color:'#1a1a1a',textDecoration:'none',fontWeight:700}}>IG</a>
          <a href="https://wa.me/905531696867" target="_blank" rel="noopener noreferrer" style={{color:'#1a1a1a',textDecoration:'none',fontWeight:700}}>WA</a>
        </span>
      </div>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,background:'#0a0a0f',borderBottom:'1px solid rgba(245,194,0,.15)'}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 20px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <a href="/" style={{flexShrink:0}}>
            <img src="/logo.png" alt="Aktif OSGB" style={{height:40,objectFit:'contain',display:'block'}} />
          </a>

          <ul id="snav-links" style={{display:'flex',gap:2,listStyle:'none',margin:0,padding:0}}>
            {LINKLER.map(l => (
              <li key={l.href}>
                <a href={l.href} style={{color:'#c8c8d8',textDecoration:'none',fontSize:13,fontWeight:600,padding:'8px 12px',borderRadius:8,display:'block',whiteSpace:'nowrap'}}>{l.label}</a>
              </li>
            ))}
          </ul>

          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            <a href="/tehlike-sinifi" id="snav-teh" style={{padding:'8px 12px',borderRadius:8,background:'rgba(245,194,0,.1)',border:'1px solid rgba(245,194,0,.3)',color:'#f5c200',fontSize:12,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap'}}>Tehlike Sınıfı</a>
            <a href="/giris" style={{padding:'8px 16px',borderRadius:8,background:'#f5c200',color:'#1a1a1a',fontSize:13,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap'}}>Giriş</a>
            <button id="snav-burger" type="button" style={{display:'none',background:'none',border:'none',color:'#f5c200',cursor:'pointer',fontSize:32,padding:'4px 8px',lineHeight:1,flexShrink:0}}>☰</button>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      <div id="snav-overlay" style={{display:'none',position:'fixed',inset:0,background:'rgba(0,0,0,.8)',zIndex:9998}} />

      {/* DRAWER */}
      <div id="snav-panel" style={{position:'fixed',top:0,left:0,bottom:0,width:280,background:'#0e0e1c',borderRight:'1px solid rgba(245,194,0,.2)',zIndex:9999,display:'flex',flexDirection:'column',transform:'translateX(-100%)',transition:'transform .2s ease'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 18px',borderBottom:'1px solid rgba(255,255,255,.06)',flexShrink:0}}>
          <img src="/logo.png" alt="Aktif OSGB" style={{height:34,objectFit:'contain'}} />
          <button id="snav-close" type="button" style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.1)',borderRadius:8,color:'#fff',cursor:'pointer',width:36,height:36,fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
        </div>
        <nav style={{flex:1,overflowY:'auto'}}>
          {LINKLER.map(l => (
            <a key={l.href} href={l.href} style={{display:'block',padding:'15px 18px',color:'#c8c8d8',textDecoration:'none',fontSize:16,fontWeight:600,borderBottom:'1px solid rgba(255,255,255,.04)'}}>
              {l.label}
            </a>
          ))}
        </nav>
        <div style={{padding:16,display:'flex',flexDirection:'column',gap:10,borderTop:'1px solid rgba(255,255,255,.06)'}}>
          <a href="/giris" style={{display:'block',padding:13,borderRadius:10,background:'#f5c200',color:'#0a0a0f',fontSize:15,fontWeight:800,textDecoration:'none',textAlign:'center'}}>Giriş Yap</a>
          <a href="/tehlike-sinifi" style={{display:'block',padding:11,borderRadius:10,background:'rgba(245,194,0,.08)',border:'1px solid rgba(245,194,0,.15)',color:'#f5c200',fontSize:14,fontWeight:700,textDecoration:'none',textAlign:'center'}}>🔍 Tehlike Sınıfı Sorgula</a>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          #snav-links{display:none!important}
          #snav-burger{display:flex!important}
          #snav-teh{display:none!important}
        }
      `}</style>
    </>
  )
}
