import SiteNav from '@/components/site/SiteNav'
import SiteFooter from '@/components/site/SiteFooter'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'

async function getAyarlar() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data } = await sb.from('site_ayarlar').select('anahtar,deger')
  const a: Record<string,string> = {}
  ;(data||[]).forEach((r:any) => { a[r.anahtar]=r.deger })
  return a
}

export default async function Kurumsal() {
  const a = await getAyarlar()
  const s = (k: string, fb = '') => a[k] || fb
  return (
    <div style={{ background: '#08080f', minHeight: '100vh', color: '#e8e8f0', fontFamily: "'Inter',-apple-system,system-ui,sans-serif" }}>
      <SiteNav />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 20, height: 2, background: '#6366f1', borderRadius: 2, display: 'inline-block' }} />Kurumsal
        </div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, letterSpacing: -1.5, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>Hakkımızda</h1>
        <p style={{ fontSize: 18, color: '#6b6b88', maxWidth: 640, lineHeight: 1.7, marginBottom: 64 }}>
          {s('aciklama', '2014\'ten bu yana iş sağlığı ve güvenliği alanında profesyonel hizmet sunuyoruz.')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,.05)', borderRadius: 20, overflow: 'hidden', marginBottom: 60 }}>
          {[{ num: s('stat_kurum','500')+'+', label: 'Çalışılan Kurum' }, { num: s('stat_yil','10')+'+', label: 'Yıllık Deneyim' }, { num: s('stat_egitim','1200')+'+', label: 'Verilen Eğitim' }].map(({ num, label }) => (
            <div key={label} style={{ background: '#0e0e1c', padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 44, fontWeight: 800, color: '#6366f1', letterSpacing: -2, lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 12, color: '#6b6b88', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24 }}>
          <div style={{ borderRadius: 20, padding: 36, background: 'rgba(99,102,241,.08)', border: '1px solid rgba(99,102,241,.15)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#8080f8', marginBottom: 16 }}>Vizyonumuz</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Sektörde Uzman Kuruluş</h2>
            <p style={{ fontSize: 14, color: '#7070a0', lineHeight: 1.7 }}>Ülkemizde iş sağlığı ve güvenliği kültürü oluşturmak adına profesyonel, çözüm odaklı ve verdiğimiz tüm hizmetlerde yeni ufuklar açarak sektörde uzman bir kuruluş olmak.</p>
          </div>
          <div style={{ borderRadius: 20, padding: 36, background: 'rgba(52,211,153,.06)', border: '1px solid rgba(52,211,153,.12)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: '#34d399', marginBottom: 16 }}>Misyonumuz</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Etik ve Güvenilir Hizmet</h2>
            <p style={{ fontSize: 14, color: '#7070a0', lineHeight: 1.7 }}>Deneyimli ve uzman kadromuzla etik ilkelerimizden vazgeçmeden, güvenilir ve yüksek ahlak düzeyinde iş sağlığı ve güvenliği alanında işyerlerinde sağlıklı ve güvenli çalışma ortamı sağlamak.</p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
