'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Search, X, HeartPulse } from 'lucide-react'

const TETKIKLER = ['AKC','ODİO','SFT','EKG','CBC','AST','ALT','ÜRE','KREATİNİN','GLUKOZ','BURUN','BOĞAZ']
const ODEME = ['Cari','İBAN','Peşin','POS']
const ODEME_RENK: any = { Cari:'var(--amber)', İBAN:'var(--blue)', Peşin:'var(--green)', POS:'var(--accent)' }

export default function Saglik() {
  const [kayitlar, setKayitlar] = useState<any[]>([])
  const [arama, setArama] = useState('')
  const [modal, setModal] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [form, setForm] = useState<any>({ tarih:new Date().toISOString().slice(0,10), ad_soyad:'', telefon:'', firma:'', ucret:'', odeme_sekli:'Peşin', tetkikler:{} })

  const sb = createClient()

  useEffect(() => { yukle() }, [])

  async function yukle() {
    const { data } = await sb.from('hasta_kayitlari').select('*').order('tarih', { ascending:false }).limit(200)
    setKayitlar(data || [])
    setYukleniyor(false)
  }

  async function kaydet() {
    if (!form.ad_soyad) return
    await sb.from('hasta_kayitlari').insert({ ...form, ucret: Number(form.ucret)||0 })
    setModal(false)
    setForm({ tarih:new Date().toISOString().slice(0,10), ad_soyad:'', telefon:'', firma:'', ucret:'', odeme_sekli:'Peşin', tetkikler:{} })
    yukle()
  }

  function toggleTetkik(t: string) {
    setForm((f:any) => ({ ...f, tetkikler: { ...f.tetkikler, [t]: !f.tetkikler[t] } }))
  }

  const filtreli = kayitlar.filter(k =>
    k.ad_soyad?.toLowerCase().includes(arama.toLowerCase()) ||
    k.firma?.toLowerCase().includes(arama.toLowerCase())
  )

  const tl = (n:number) => new Intl.NumberFormat('tr-TR').format(n) + ' ₺'
  const toplamCiro = filtreli.reduce((s,k)=>s+(Number(k.ucret)||0),0)

  return (
    <div style={{ padding:'32px 28px', maxWidth:1400, margin:'0 auto' }} className="fade-in">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:700, letterSpacing:-0.5 }}>Sağlık Tarama</h1>
          <p style={{ color:'var(--text-dim)', fontSize:14, marginTop:4 }}>{filtreli.length} kayıt · Toplam {tl(toplamCiro)}</p>
        </div>
        <button className="btn" onClick={() => setModal(true)}><Plus size={18} /> Yeni Kayıt</button>
      </div>

      <div style={{ position:'relative', marginBottom:20, maxWidth:360 }}>
        <Search size={17} style={{ position:'absolute', left:14, top:12, color:'var(--text-faint)' }} />
        <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="Hasta veya firma ara..." style={{ paddingLeft:40 }} />
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Tarih</th><th>Ad Soyad</th><th>Firma</th><th>Ücret</th><th>Ödeme</th><th>Tetkikler</th>
              </tr>
            </thead>
            <tbody>
              {yukleniyor ? (
                <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-faint)', padding:40 }}>Yükleniyor...</td></tr>
              ) : filtreli.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', color:'var(--text-faint)', padding:40 }}>Kayıt yok</td></tr>
              ) : filtreli.map(k => {
                const aktifTetkik = Object.entries(k.tetkikler||{}).filter(([,v])=>v).map(([t])=>t)
                return (
                  <tr key={k.id}>
                    <td style={{ color:'var(--text-dim)', whiteSpace:'nowrap' }}>{new Date(k.tarih).toLocaleDateString('tr-TR')}</td>
                    <td style={{ fontWeight:500 }}>{k.ad_soyad}</td>
                    <td style={{ color:'var(--text-dim)' }}>{k.firma||'—'}</td>
                    <td style={{ fontWeight:600, whiteSpace:'nowrap' }}>{tl(Number(k.ucret)||0)}</td>
                    <td><span className="badge" style={{ background:`${ODEME_RENK[k.odeme_sekli]}22`, color:ODEME_RENK[k.odeme_sekli] }}>{k.odeme_sekli}</span></td>
                    <td>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap', maxWidth:280 }}>
                        {aktifTetkik.length === 0 ? <span style={{ color:'var(--text-faint)' }}>—</span> :
                          aktifTetkik.map(t => <span key={t} style={{ fontSize:10, background:'var(--surface-2)', color:'var(--text-dim)', padding:'2px 7px', borderRadius:5, border:'1px solid var(--border)' }}>{t}</span>)}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={()=>setModal(false)}>
          <div className="card" style={{ width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', padding:28 }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <h2 style={{ fontFamily:'Sora, sans-serif', fontSize:20, fontWeight:600, display:'flex', alignItems:'center', gap:10 }}>
                <HeartPulse size={20} color="var(--green)" /> Yeni Hasta Kaydı
              </h2>
              <button onClick={()=>setModal(false)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }}><X size={22} /></button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <label style={lbl}>Tarih</label>
                <input type="date" value={form.tarih} onChange={e=>setForm({...form, tarih:e.target.value})} />
              </div>
              <div>
                <label style={lbl}>Ad Soyad *</label>
                <input value={form.ad_soyad} onChange={e=>setForm({...form, ad_soyad:e.target.value})} placeholder="Hasta adı" />
              </div>
              <div>
                <label style={lbl}>Telefon</label>
                <input value={form.telefon} onChange={e=>setForm({...form, telefon:e.target.value})} placeholder="05..." />
              </div>
              <div>
                <label style={lbl}>Firma</label>
                <input value={form.firma} onChange={e=>setForm({...form, firma:e.target.value})} placeholder="Çalıştığı firma" />
              </div>
              <div>
                <label style={lbl}>Ücret (₺)</label>
                <input type="number" value={form.ucret} onChange={e=>setForm({...form, ucret:e.target.value})} placeholder="0" />
              </div>
              <div>
                <label style={lbl}>Ödeme Şekli</label>
                <select value={form.odeme_sekli} onChange={e=>setForm({...form, odeme_sekli:e.target.value})}>
                  {ODEME.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <label style={lbl}>Tetkikler</label>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
              {TETKIKLER.map(t => {
                const aktif = form.tetkikler[t]
                return (
                  <button key={t} type="button" onClick={()=>toggleTetkik(t)}
                    style={{ padding:'7px 13px', borderRadius:8, fontSize:13, cursor:'pointer', fontFamily:'inherit', transition:'all .12s',
                      background: aktif ? 'var(--green-soft)' : 'var(--surface-2)',
                      border:`1px solid ${aktif ? 'var(--green)' : 'var(--border)'}`,
                      color: aktif ? 'var(--green)' : 'var(--text-dim)' }}>
                    {t}
                  </button>
                )
              })}
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-ghost btn" style={{ flex:1, justifyContent:'center' }} onClick={()=>setModal(false)}>İptal</button>
              <button className="btn" style={{ flex:1, justifyContent:'center' }} onClick={kaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const lbl: any = { display:'block', fontSize:12, color:'var(--text-dim)', marginBottom:6, fontWeight:500 }
