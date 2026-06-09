'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, X, CalendarDays, Check } from 'lucide-react'

const DURUM_RENK: any = { 'Planlandı':'var(--blue)', 'Tamamlandı':'var(--green)', 'İptal':'var(--red)' }

export default function Koordinasyon() {
  const [gorevler, setGorevler] = useState<any[]>([])
  const [modal, setModal] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [seciliTarih, setSeciliTarih] = useState(new Date().toISOString().slice(0,10))
  const [form, setForm] = useState<any>({ tarih:new Date().toISOString().slice(0,10), uzman:'', firma_adi:'', gorev_turu:'Saha ziyareti', aciklama:'' })

  const sb = createClient()
  useEffect(() => { yukle() }, [])

  async function yukle() {
    const { data } = await sb.from('gorevler').select('*').order('tarih', { ascending:false }).limit(200)
    setGorevler(data || [])
    setYukleniyor(false)
  }

  async function kaydet() {
    if (!form.uzman) return
    await sb.from('gorevler').insert(form)
    setModal(false)
    setForm({ tarih:seciliTarih, uzman:'', firma_adi:'', gorev_turu:'Saha ziyareti', aciklama:'' })
    yukle()
  }

  async function durumGuncelle(id:string, durum:string) {
    await sb.from('gorevler').update({ durum }).eq('id', id)
    yukle()
  }

  const gunlukGorevler = gorevler.filter(g => g.tarih === seciliTarih)
  const uzmanlar = [...new Set(gorevler.map(g=>g.uzman).filter(Boolean))]

  return (
    <div className="page-pad fade-in" style={{ padding:'32px 28px', maxWidth:1400, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:700, letterSpacing:-0.5 }}>İSG Koordinasyon</h1>
          <p style={{ color:'var(--text-dim)', fontSize:14, marginTop:4 }}>Uzman görev takvimi</p>
        </div>
        <button className="btn" onClick={()=>{ setForm({...form, tarih:seciliTarih}); setModal(true) }}><Plus size={18} /> Görev Ekle</button>
      </div>

      <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:24, flexWrap:'wrap' }}>
        <input type="date" value={seciliTarih} onChange={e=>setSeciliTarih(e.target.value)} style={{ maxWidth:180 }} />
        <span style={{ color:'var(--text-dim)', fontSize:14 }}>{new Date(seciliTarih).toLocaleDateString('tr-TR', { weekday:'long', day:'numeric', month:'long' })}</span>
      </div>

      {/* UZMAN BAZLI GÖRÜNÜM */}
      {uzmanlar.length === 0 && gunlukGorevler.length === 0 ? (
        <div className="card" style={{ padding:48, textAlign:'center', color:'var(--text-faint)' }}>
          <CalendarDays size={40} style={{ margin:'0 auto 16px', opacity:0.4 }} />
          Bu tarihte görev yok
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
          {gunlukGorevler.map(g => (
            <div key={g.id} className="card" style={{ padding:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <div style={{ fontWeight:600 }}>{g.uzman}</div>
                  <div style={{ fontSize:13, color:'var(--text-dim)' }}>{g.gorev_turu}</div>
                </div>
                <span className="badge" style={{ background:`${DURUM_RENK[g.durum]}22`, color:DURUM_RENK[g.durum] }}>{g.durum}</span>
              </div>
              {g.firma_adi && <div style={{ fontSize:14, marginBottom:4 }}>{g.firma_adi}</div>}
              {g.aciklama && <div style={{ fontSize:13, color:'var(--text-dim)' }}>{g.aciklama}</div>}
              {g.durum === 'Planlandı' && (
                <button onClick={()=>durumGuncelle(g.id,'Tamamlandı')} style={{ marginTop:12, display:'flex', alignItems:'center', gap:6, background:'var(--green-soft)', color:'var(--green)', border:'none', borderRadius:8, padding:'7px 14px', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
                  <Check size={15} /> Tamamlandı işaretle
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div style={ovl} onClick={()=>setModal(false)}>
          <div className="card" style={modalBox} onClick={e=>e.stopPropagation()}>
            <div style={modalHead}><h2 style={modalTitle}><CalendarDays size={20} color="var(--blue)" /> Görev Ekle</h2><button onClick={()=>setModal(false)} style={xBtn}><X size={22} /></button></div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label style={lbl}>Tarih</label><input type="date" value={form.tarih} onChange={e=>setForm({...form, tarih:e.target.value})} /></div>
              <div><label style={lbl}>Uzman *</label><input value={form.uzman} onChange={e=>setForm({...form, uzman:e.target.value})} placeholder="Uzman adı" list="uzmanlar" /><datalist id="uzmanlar">{uzmanlar.map(u=><option key={u} value={u} />)}</datalist></div>
              <div><label style={lbl}>Firma</label><input value={form.firma_adi} onChange={e=>setForm({...form, firma_adi:e.target.value})} /></div>
              <div><label style={lbl}>Görev Türü</label><select value={form.gorev_turu} onChange={e=>setForm({...form, gorev_turu:e.target.value})}><option>Saha ziyareti</option><option>Risk değerlendirme</option><option>Eğitim</option><option>Ölçüm</option><option>Sağlık taraması</option><option>Diğer</option></select></div>
              <div><label style={lbl}>Açıklama</label><textarea rows={2} value={form.aciklama} onChange={e=>setForm({...form, aciklama:e.target.value})} /></div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
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
const ovl: any = { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }
const modalBox: any = { width:'100%', maxWidth:460, padding:28 }
const modalHead: any = { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }
const modalTitle: any = { fontFamily:'Sora, sans-serif', fontSize:20, fontWeight:600, display:'flex', alignItems:'center', gap:10 }
const xBtn: any = { background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }
