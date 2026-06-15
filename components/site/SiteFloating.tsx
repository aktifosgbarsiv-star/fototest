'use client'
import { useState, useEffect } from 'react'

export default function SiteFloating() {
  const [cerezGoster, setCerezGoster] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cerez-onay')) setCerezGoster(true)
  }, [])

  function cerezKabul() {
    localStorage.setItem('cerez-onay', '1')
    setCerezGoster(false)
  }

  return (
    <>
      {/* WhatsApp butonu */}
      <a href="https://wa.me/905531696867" target="_blank" rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg,#25d366,#128c7e)',
          boxShadow: '0 4px 20px rgba(37,211,102,.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          textDecoration: 'none', fontSize: 26,
          animation: 'waPulse 2.5s infinite',
        }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* Çerez banner */}
      {cerezGoster && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 998,
          background: 'linear-gradient(135deg,rgba(10,10,15,.98),rgba(18,18,26,.98))',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(245,194,0,.2)',
          padding: '20px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 28 }}>🍪</span>
            <div>
              <p style={{ fontSize: 14, color: '#e0e0f0', fontWeight: 600, marginBottom: 4 }}>Bu site çerezleri kullanmaktadır</p>
              <p style={{ fontSize: 12, color: '#5d5d7a' }}>Deneyiminizi geliştirmek için çerezler kullanıyoruz. Siteyi kullanmaya devam ederek kabul etmiş olursunuz.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={cerezKabul} style={{
              padding: '10px 24px', borderRadius: 8, background: '#f5c200', color: '#0a0a0f',
              fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            }}>Kabul Et</button>
            <button onClick={() => setCerezGoster(false)} style={{
              padding: '10px 18px', borderRadius: 8, background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.1)', color: '#9b9bb8',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>Reddet</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes waPulse {
          0%,100%{box-shadow:0 4px 20px rgba(37,211,102,.4)}
          50%{box-shadow:0 4px 32px rgba(37,211,102,.7),0 0 0 8px rgba(37,211,102,.1)}
        }
      `}</style>
    </>
  )
}
