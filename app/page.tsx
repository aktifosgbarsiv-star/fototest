import Link from 'next/link'
import { createClient as createServerSupabase } from '@supabase/supabase-js'
import SiteNav from '@/components/site/SiteNav'
import SiteFooter from '@/components/site/SiteFooter'
import HeroSlider from '@/components/site/HeroSlider'

export const dynamic = 'force-dynamic'

async function getAyarlar() {
  const sb = createServerSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await sb.from('site_ayarlar').select('anahtar, deger')
  const ayarlar: Record<string, string> = {}
  ;(data || []).forEach((r: any) => { ayarlar[r.anahtar] = r.deger })
  return ayarlar
}

async function getHizmetler() {
  const sb = createServerSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await sb.from('site_hizmetler').select('*').eq('aktif', true).order('sira')
  return data || []
}

async function getEgitimler() {
  const sb = createServerSupabase(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data } = await sb.from('site_egitimler').select('*').eq('aktif', true).order('sira')
  return data || []
}

export default async function AnaSayfa() {
  const [ayarlar, hizmetler, egitimler] = await Promise.all([getAyarlar(), getHizmetler(), getEgitimler()])

  const s = (k: string, fallback = '') => ayarlar[k] || fallback

  return (
    <div style={{ background: '#08080f', minHeight: '100vh', color: '#e8e8f0', fontFamily: "'Inter', -apple-system, system-ui, sans-serif" }}>
      <SiteNav />

      <HeroSlider />

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(255,255,255,.05)', borderTop: '1px solid rgba(255,255,255,.05)', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
        {[
          { num: s('stat_kurum', '500') + '+', label: 'Çalışılan Kurum' },
          { num: s('stat_yil', '10') + '+', label: 'Yıllık Deneyim' },
          { num: s('stat_egitim', '1200') + '+', label: 'Verilen Eğitim' },
        ].map(({ num, label }) => (
          <div key={label} style={{ background: '#08080f', padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, fontWeight: 800, color: '#6366f1', letterSpacing: -2, lineHeight: 1 }}>{num}</div>
            <div style={{ fontSize: 12, color: '#6b6b88', marginTop: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* HİZMETLER */}
      <section style={{ padding: '80px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 20, height: 2, background: '#6366f1', borderRadius: 2, display: 'inline-block' }} />
          Hizmetlerimiz
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, color: '#fff', marginBottom: 12 }}>Kapsamlı OSGB Çözümleri</h2>
        <p style={{ fontSize: 16, color: '#6b6b88', maxWidth: 520, lineHeight: 1.6, marginBottom: 48 }}>
          İş sağlığı ve güvenliği alanında ihtiyacınız olan tüm hizmetleri tek çatı altında sunuyoruz.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {hizmetler.map((h: any) => (
            <div key={h.id} style={{
              background: '#0e0e1c', border: '1px solid rgba(255,255,255,.06)',
              borderRadius: 16, padding: 28,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, marginBottom: 16,
              }}>{h.ikon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e0e0f0', marginBottom: 8 }}>{h.baslik}</h3>
              <p style={{ fontSize: 13, color: '#5d5d7a', lineHeight: 1.6 }}>{h.aciklama}</p>
              {h.etiketler && <div style={{ marginTop: 16, fontSize: 11, color: '#7c7cf0', fontWeight: 600 }}>→ {h.etiketler}</div>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/hizmetlerimiz" style={{
            padding: '12px 28px', borderRadius: 10,
            border: '1px solid rgba(99,102,241,.3)', color: '#a5b4fc',
            fontSize: 14, fontWeight: 600, textDecoration: 'none',
          }}>Tüm Hizmetleri Gör →</Link>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,.15), transparent)', margin: '0 32px' }} />

      {/* EĞİTİMLER */}
      <section style={{ padding: '80px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 20, height: 2, background: '#6366f1', borderRadius: 2, display: 'inline-block' }} />
          Eğitimler
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, color: '#fff', marginBottom: 12 }}>Sertifikalı Eğitim Programları</h2>
        <p style={{ fontSize: 16, color: '#6b6b88', maxWidth: 520, lineHeight: 1.6, marginBottom: 48 }}>
          Çalışanlarınızın güvenliğini artırmak için akredite eğitim hizmetleri.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {egitimler.map((e: any, i: number) => (
            <div key={e.id} style={{
              background: '#0e0e1c', border: '1px solid rgba(255,255,255,.06)',
              borderRadius: 16, padding: '28px 32px',
              display: 'flex', alignItems: 'flex-start', gap: 20,
            }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: 'rgba(99,102,241,.2)', lineHeight: 1, letterSpacing: -2, flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#e0e0f0', marginBottom: 6 }}>{e.baslik}</h3>
                <p style={{ fontSize: 13, color: '#5d5d7a', lineHeight: 1.6 }}>{e.aciklama}</p>
                {e.sure && <div style={{ marginTop: 12, fontSize: 11, color: '#6b6b88', fontWeight: 600 }}>⏱ {e.sure} {e.sertifika ? '· Sertifikalı' : ''}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,.15), transparent)', margin: '0 32px' }} />

      {/* VİZYON MİSYON */}
      <section style={{ padding: '80px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <div style={{ borderRadius: 20, padding: 36, background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.15)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#8080f8', marginBottom: 16 }}>Vizyonumuz</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: -0.5 }}>Sektörde Uzman Kuruluş</h3>
            <p style={{ fontSize: 14, color: '#7070a0', lineHeight: 1.7 }}>Ülkemizde iş sağlığı ve güvenliği kültürü oluşturmak adına profesyonel, çözüm odaklı ve verdiğimiz tüm hizmetlerde yeni ufuklar açarak sektörde uzman bir kuruluş olmak.</p>
          </div>
          <div style={{ borderRadius: 20, padding: 36, background: 'rgba(52,211,153,.06)', border: '1px solid rgba(52,211,153,.12)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#34d399', marginBottom: 16 }}>Misyonumuz</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: -0.5 }}>Etik ve Güvenilir Hizmet</h3>
            <p style={{ fontSize: 14, color: '#7070a0', lineHeight: 1.7 }}>Deneyimli ve uzman kadromuzla etik ilkelerimizden vazgeçmeden, güvenilir ve yüksek ahlak düzeyinde iş sağlığı ve güvenliği alanında işyerlerinde sağlıklı ve güvenli çalışma ortamı sağlamak.</p>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,.15), transparent)', margin: '0 32px' }} />

      {/* CTA */}
      <section style={{ padding: '80px 32px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: -1, marginBottom: 16 }}>
          İşyeriniz için teklif alın
        </h2>
        <p style={{ fontSize: 16, color: '#6b6b88', marginBottom: 36 }}>Uzmanlarımız en kısa sürede size dönecektir.</p>
        <Link href="/iletisim" style={{
          padding: '16px 40px', borderRadius: 12, background: '#6366f1', color: '#fff',
          fontSize: 16, fontWeight: 700, textDecoration: 'none',
        }}>Ücretsiz Teklif Al →</Link>
      </section>

      <SiteFooter />
    </div>
  )
}
