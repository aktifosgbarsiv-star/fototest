import SiteNav from '@/components/site/SiteNav'
import SiteFooter from '@/components/site/SiteFooter'
import { createClient } from '@supabase/supabase-js'
export const dynamic = 'force-dynamic'

async function getReferanslar() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data } = await sb.from('site_referanslar').select('*').eq('aktif', true).order('sira')
  return data || []
}

export default async function Referanslar() {
  const referanslar = await getReferanslar()
  return (
    <div style={{ background: '#08080f', minHeight: '100vh', color: '#e8e8f0', fontFamily: "'Inter',-apple-system,system-ui,sans-serif" }}>
      <SiteNav />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 20, height: 2, background: '#6366f1', borderRadius: 2, display: 'inline-block' }} />Referanslar
        </div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, letterSpacing: -1.5, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>Güven Duyulan Markalar</h1>
        <p style={{ fontSize: 18, color: '#6b6b88', maxWidth: 560, lineHeight: 1.7, marginBottom: 64 }}>
          Yüzlerce kuruma verdiğimiz kesintisiz hizmetle güven inşa ettik.
        </p>
        {referanslar.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#4a4a68' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏢</div>
            <p>Referans bilgileri panelden eklenebilir.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
            {referanslar.map((r: any) => (
              <div key={r.id} style={{ background: '#0e0e1c', border: '1px solid rgba(255,255,255,.06)', borderRadius: 16, padding: '28px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#c0c0e0' }}>{r.firma_adi}</div>
                {r.sektor && <div style={{ fontSize: 12, color: '#5d5d7a', marginTop: 6 }}>{r.sektor}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
