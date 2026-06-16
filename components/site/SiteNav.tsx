'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

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
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [menuAcik, setMenuAcik] = useState(false)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    setMenuAcik(false)
  }, [pathname])

  return (
    <>
      <style>{`
        .sitenav-wrap {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #0a0a0f;
          border-bottom: 1px solid rgba(245,194,0,.15);
        }
        .sitenav-infobar {
          background: #f5c200;
          padding: 6px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #1a1a1a;
          font-weight: 600;
        }
        .sitenav-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .sitenav-links {
          display: flex;
          gap: 2px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .sitenav-link {
          color: #c8c8d8;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          padding: 8px 12px;
          border-radius: 8px;
          display: block;
          transition: color .15s, background .15s;
          white-space: nowrap;
        }
        .sitenav-link:hover { color: #fff; background: rgba(255,255,255,.06); }
        .sitenav-link.aktif { color: #f5c200; background: rgba(245,194,0,.08); }
        .sitenav-giris {
          padding: 8px 16px;
          border-radius: 8px;
          background: #f5c200;
          color: #1a1a1a;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .sitenav-burger {
          display: none;
          background: none;
          border: none;
          color: #c8c8d8;
          cursor: pointer;
          padding: 8px;
          font-size: 24px;
          line-height: 1;
          flex-shrink: 0;
        }
        /* Mobil drawer */
        .sitenav-drawer {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          z-index: 9999;
        }
        .sitenav-drawer.open {
          display: block;
        }
        .sitenav-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.7);
        }
        .sitenav-panel {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 280px;
          background: #0e0e1c;
          border-right: 1px solid rgba(245,194,0,.15);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .sitenav-panel-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          border-bottom: 1px solid rgba(255,255,255,.06);
          flex-shrink: 0;
        }
        .sitenav-panel-close {
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 8px;
          color: #c8c8d8;
          cursor: pointer;
          width: 34px;
          height: 34px;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sitenav-panel-link {
          display: block;
          padding: 15px 20px;
          color: #c8c8d8;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          border-bottom: 1px solid rgba(255,255,255,.04);
          transition: color .15s, background .15s;
        }
        .sitenav-panel-link:hover { color: #fff; background: rgba(255,255,255,.04); }
        .sitenav-panel-link.aktif { color: #f5c200; background: rgba(245,194,0,.06); border-left: 3px solid #f5c200; padding-left: 17px; }
        .sitenav-panel-footer {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
          border-top: 1px solid rgba(255,255,255,.06);
        }
        .sitenav-panel-giris {
          display: block;
          padding: 13px;
          border-radius: 10px;
          background: #f5c200;
          color: #0a0a0f;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          text-align: center;
        }
        @media (max-width: 900px) {
          .sitenav-links { display: none !important; }
          .sitenav-tehlike { display: none !important; }
          .sitenav-burger { display: flex !important; }
        }
      `}</style>

      {/* Info bar */}
      <div className="sitenav-infobar">
        <span>📞 0 553 169 68 67 &nbsp;|&nbsp; ✉️ info@aktifosgb.com.tr</span>
        <span style={{ display: 'flex', gap: 16 }}>
          <a href="https://www.facebook.com/afyonaktifOSGB/" target="_blank" rel="noopener noreferrer" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 700 }}>FB</a>
          <a href="https://www.instagram.com/aktifosgb/" target="_blank" rel="noopener noreferrer" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 700 }}>IG</a>
          <a href="https://wa.me/905531696867" target="_blank" rel="noopener noreferrer" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 700 }}>WA</a>
        </span>
      </div>

      {/* Nav */}
      <div className="sitenav-wrap">
        <div className="sitenav-inner">
          <Link href="/" style={{ flexShrink: 0 }}>
            <img src="/logo.png" alt="Aktif OSGB" style={{ height: 40, objectFit: 'contain', display: 'block' }} />
          </Link>

          <ul className="sitenav-links">
            {LINKLER.map(l => (
              <li key={l.href}>
                <Link href={l.href} className={`sitenav-link${pathname.startsWith(l.href) ? ' aktif' : ''}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/tehlike-sinifi" className="sitenav-tehlike" style={{
              padding: '8px 12px', borderRadius: 8,
              background: 'rgba(245,194,0,.1)', border: '1px solid rgba(245,194,0,.3)',
              color: '#f5c200', fontSize: 12, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap',
            }}>
              Tehlike Sınıfı
            </Link>
            <Link href={user ? '/firmalar' : '/giris'} className="sitenav-giris">
              {user ? 'Panel →' : 'Giriş'}
            </Link>
            <button className="sitenav-burger" onClick={() => setMenuAcik(true)} aria-label="Menü aç">
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobil Drawer */}
      <div className={`sitenav-drawer${menuAcik ? ' open' : ''}`}>
        <div className="sitenav-overlay" onClick={() => setMenuAcik(false)} />
        <div className="sitenav-panel">
          <div className="sitenav-panel-head">
            <img src="/logo.png" alt="Aktif OSGB" style={{ height: 34, objectFit: 'contain' }} />
            <button className="sitenav-panel-close" onClick={() => setMenuAcik(false)}>✕</button>
          </div>

          <nav style={{ flex: 1 }}>
            {LINKLER.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`sitenav-panel-link${pathname.startsWith(l.href) ? ' aktif' : ''}`}
                onClick={() => setMenuAcik(false)}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="sitenav-panel-footer">
            <Link
              href={user ? '/firmalar' : '/giris'}
              className="sitenav-panel-giris"
              onClick={() => setMenuAcik(false)}
            >
              {user ? 'Panel →' : 'Giriş Yap'}
            </Link>
            <Link
              href="/tehlike-sinifi"
              onClick={() => setMenuAcik(false)}
              style={{
                display: 'block', padding: '12px', borderRadius: 10,
                background: 'rgba(245,194,0,.08)', border: '1px solid rgba(245,194,0,.15)',
                color: '#f5c200', fontSize: 14, fontWeight: 700,
                textDecoration: 'none', textAlign: 'center',
              }}
            >
              🔍 Tehlike Sınıfı Sorgula
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
