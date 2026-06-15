'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react'

export default function RamakKalaAdmin() {
  const [kayitlar, setKayitlar] = useState<any[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [secili, setSecili] = useState<any>(null)
  const sb = createClient()

  useEffect(() => { yukle() }, [])

  async function yukle() {
    setYukleniyor(true)
    const { data } = await sb.from('site_ramak_kala').select('*').order('olusturuldu_at', { ascending: false })
    setKayitlar(data || [])
    setYukleniyor(false)
  }

  async function durumGuncelle(id: string, durum: string) {
    await sb.from('site_ramak_kala').update({ durum }).eq('id', id)
    yukle()
  }

  const DURUM_RENK: Record<string,string> = { 'Yeni': '#f5c200', 'İnceleniyor': '#60a5fa', 'Tamamlandı': '#34d399' }

  return (
    <div className="page-wrap fade-in">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="page-title" style={{ display:'flex', alignItems:'center', gap:10 }}>
            <AlertTriangle size={22} color="var(--red)" /> Ramak Kala Bildirimleri
          </h1>
          <p className="page-sub">Çalışanlardan gelen ramak kala bildirimleri</p>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {[['Yeni', kayitlar.filter(k=>k.durum==='Yeni').length], ['İnceleniyor', kayitlar.filter(k=>k.durum==='İnceleniyor').length]].map(([d, n]) => (
            <div key={d} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'8px 16px', textAlign:'center' }}>
              <div style={{ fontSize:20, fontWeight:800, color: d==='Yeni' ? 'var(--amber)' : 'var(--blue)' }}>{n as number}</div>
              <div style={{ fontSize:11, color:'var(--text-faint)' }}>{d}</div>
            </div>
          ))}
        </div>
      </div>

      {yukleniyor ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--text-faint)' }}>Yükleniyor...</div>
      ) : kayitlar.length === 0 ? (
        <div style={{ textAlign:'center', padding:80, color:'var(--text-faint)' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
          <p>Henüz bildirim yok.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns: secili ? '1fr 400px' : '1fr', gap:20 }}>
          <div className="card">
            <table>
              <thead>
                <tr><th>Ad Soyad</th><th>Firma</th><th>Bölüm</th><th>Tarih</th><th>Durum</th><th></th></tr>
              </thead>
              <tbody>
                {kayitlar.map(k => (
                  <tr key={k.id} style={{ cursor:'pointer', background: secili?.id===k.id ? 'rgba(245,194,0,.05)' : '' }}>
                    <td style={{ fontWeight:600 }}>{k.ad_soyad}</td>
                    <td>{k.firma_adi}</td>
                    <td>{k.bolum || '—'}</td>
                    <td style={{ fontSize:12, color:'var(--text-faint)' }}>{new Date(k.olusturuldu_at).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <select value={k.durum} onChange={e=>durumGuncelle(k.id,e.target.value)}
                        style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:6, padding:'4px 8px', color: DURUM_RENK[k.durum] || 'var(--text)', fontSize:12 }}>
                        <option>Yeni</option><option>İnceleniyor</option><option>Tamamlandı</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-ghost" style={{ padding:'5px 10px' }} onClick={() => setSecili(secili?.id===k.id ? null : k)}>
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {secili && (
            <div className="card" style={{ padding:24, height:'fit-content' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                <h3 style={{ fontWeight:700, color:'var(--text)' }}>Bildirim Detayı</h3>
                <button style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', fontSize:18 }} onClick={()=>setSecili(null)}>×</button>
              </div>
              {[['Ad Soyad', secili.ad_soyad], ['Telefon', secili.telefon||'—'], ['Firma', secili.firma_adi], ['Bölüm', secili.bolum||'—'], ['Dönüş İstiyor', secili.donus_isteniyor ? 'Evet' : 'Hayır']].map(([l,v]) => (
                <div key={l} style={{ marginBottom:12 }}>
                  <div style={{ fontSize:11, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:14, color:'var(--text)' }}>{v}</div>
                </div>
              ))}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:.5, marginBottom:4 }}>Olay Detayı</div>
                <div style={{ fontSize:14, color:'var(--text)', lineHeight:1.6, background:'var(--surface-2)', borderRadius:8, padding:'12px 14px' }}>{secili.ileti}</div>
              </div>
              <div style={{ fontSize:11, color:'var(--text-faint)', marginTop:16 }}>
                {new Date(secili.olusturuldu_at).toLocaleString('tr-TR')}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
