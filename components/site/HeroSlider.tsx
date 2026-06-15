'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const SLIDES = [
  {
    img: 'https://aktifosgb.com.tr/wp-content/uploads/2020/01/slider2.jpg',
    baslik: '10 Yıldır Güvenli\nİşyerleri İçin\nÇalışıyoruz!',
    alt: 'Önce Sağlık, Daima Güvenlik',
    aciklama: 'Aktif OSGB olarak işletmenizi güvenli bir geleceğe taşıyoruz. İşyeri hekimliği, mobil sağlık hizmetleri ve uzman desteğiyle her zaman yanınızdayız.',
  },
  {
    img: 'https://aktifosgb.com.tr/wp-content/uploads/2020/01/slider6-1.jpg',
    baslik: 'Yasal Yükümlülüklerinizi\nZamanında\nYerine Getirin',
    alt: 'Yasal Uyumluluk',
    aciklama: 'Periyodik sağlık taramaları, işe giriş muayeneleri ve risk analizleri tek noktada. Etkin çözümlerle iş güvenliğinizi garanti altına alın.',
  },
  {
    img: 'https://aktifosgb.com.tr/wp-content/uploads/2023/11/aktif-osgb-9-yil-slider.jpg',
    baslik: '2014\'ten Bu Yana\nAfyon\'un Güvenilir\nOSGB\'si',
    alt: '9 Yıllık Deneyim',
    aciklama: '500\'den fazla firmaya verdiğimiz kesintisiz hizmetle iş sağlığı ve güvenliği alanında sektörün lider kuruluşu olmaya devam ediyoruz.',
  },
]

export default function HeroSlider() {
  const [aktif, setAktif] = useState(0)
  const [gecis, setGecis] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setGecis(false)
      setTimeout(() => {
        setAktif(prev => (prev + 1) % SLIDES.length)
        setGecis(true)
      }, 400)
    }, 5000)
    return () => clearInterval(t)
  }, [])

  function git(i: number) {
    setGecis(false)
    setTimeout(() => { setAktif(i); setGecis(true) }, 300)
  }

  const slide = SLIDES[aktif]

  return (
    <section style={{ position: 'relative', width: '100%', height: 'clamp(480px, 80vh, 720px)', overflow: 'hidden' }}>
      {/* Arkaplan resim */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${slide.img})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        transition: 'opacity 0.4s ease',
        opacity: gecis ? 1 : 0,
      }} />
      {/* Koyu overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,.75) 0%, rgba(0,0,0,.4) 60%, rgba(0,0,0,.15) 100%)',
      }} />

      {/* İçerik */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%', display: 'flex', alignItems: 'center',
        padding: 'clamp(24px, 5vw, 80px)',
        maxWidth: 1200, margin: '0 auto',
      }}>
        <div style={{
          maxWidth: 640,
          transition: 'opacity 0.4s ease, transform 0.4s ease',
          opacity: gecis ? 1 : 0,
          transform: gecis ? 'translateY(0)' : 'translateY(16px)',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,.2)', border: '1px solid rgba(99,102,241,.35)',
            borderRadius: 100, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#a5b4fc',
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block', animation: 'sliderPulse 2s infinite' }} />
            6331 Sayılı Kanun Kapsamında Yetkili OSGB
          </div>

          {/* Başlık */}
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 56px)',
            fontWeight: 900, lineHeight: 1.1,
            letterSpacing: -1, color: '#fff',
            marginBottom: 20, whiteSpace: 'pre-line',
          }}>
            {slide.baslik.split('\n').map((line, i) => (
              <span key={i}>
                {i === 0 ? <span style={{ color: '#fbbf24' }}>{line}</span> : line}
                {i < slide.baslik.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Açıklama */}
          <p style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'rgba(255,255,255,.8)',
            lineHeight: 1.7, marginBottom: 36,
            maxWidth: 520,
          }}>
            {slide.aciklama}
          </p>

          {/* Butonlar */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/iletisim" style={{
              padding: '13px 28px', borderRadius: 10,
              background: '#6366f1', color: '#fff',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'background .15s',
            }}>Ücretsiz Teklif Al →</Link>
            <Link href="/hizmetlerimiz" style={{
              padding: '13px 24px', borderRadius: 10,
              background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,.2)',
              color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none',
            }}>Hizmetlerimiz</Link>
          </div>
        </div>
      </div>

      {/* Nokta navigasyon */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 10, zIndex: 3,
      }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => git(i)} style={{
            width: i === aktif ? 28 : 8, height: 8, borderRadius: 100,
            background: i === aktif ? '#6366f1' : 'rgba(255,255,255,.4)',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'all .3s ease',
          }} />
        ))}
      </div>

      {/* Ok butonları */}
      {[
        { dir: 'prev', label: '‹', idx: (aktif - 1 + SLIDES.length) % SLIDES.length, pos: { left: 16 } },
        { dir: 'next', label: '›', idx: (aktif + 1) % SLIDES.length, pos: { right: 16 } },
      ].map(({ label, idx, pos }) => (
        <button key={label} onClick={() => git(idx)} style={{
          position: 'absolute', top: '50%', transform: 'translateY(-50%)',
          ...pos, zIndex: 3,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,.15)',
          color: '#fff', fontSize: 22, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s',
        }}>{label}</button>
      ))}

      <style>{`
        @keyframes sliderPulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @media(max-width:640px) {
          .slider-arrows { display: none !important; }
        }
      `}</style>
    </section>
  )
}
