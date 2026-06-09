'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, X, ClipboardList, Check } from 'lucide-react'

const KATEGORILER = ['Araç','Ofis','İzin','Proje','Personel','Cihaz','Yazışma','Diğer']
const DURUM_RENK: any = { 'Açık':'var(--blue)', 'Devam':'var(--amber)', 'Tamamlandı':'var(--green)', 'İptal':'var(--text-faint)' }

export default function Idari() {
  const [isler, setIsler] = useState<any[]>([])
  const [filtre, setFiltre] = useState('Hepsi')
  const [modal, setModal] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [form, setForm] = useState<any>({ kategori:'Ofis', baslik:'', detay:'', durum:'Açık', son_tarih:'', sorumlu:'' })

  const sb = createClient()
  useEffect(() => { yukle() }, [])

  async function yukle() {
    const { data } = await sb.from('idari_isler').select('*').order('created_at', { ascending:false })
    setIsler(data || [])
    setYukleniyor(false)
  }

  async function kaydet() {
    if (!form.baslik) return
    await sb.from('idari_isler').insert({ ...form, son_tarih: form.son_tarih||null })
    setModal(false); setForm({ kategori:'Ofis', baslik:'', detay:'', durum:'Açık', son_tarih:'', sorumlu:'' }); yukle()
  }

  async function durumGuncelle(id:string, durum:string) {
    await sb.from('idari_isler').update({ durum }).eq('id', id)
    yukle()
  }

  const filtreli = filtre === 'Hepsi' ? isler : isler.filter(i => i.kategori === filtre)

  return (
    <div className="page-pad fade-in" style={{ padding:'32px 28px', maxWidth:1400, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:700, letterSpacing:-0.5 }}>İdari İşler</h1>
          <p style={{ color:'var(--text-dim)', fontSize:14, marginTop:4 }}>{filtreli.length} kayıt</p>
        </div>
        <button className="btn" onClick={()=>setModal(true)}><Plus size={18} /> Yeni Kayıt</button>
      </div>

      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:20 }}>
        {['Hepsi',...KATEGORILER].map(k => (
          <button key={k} onClick={()=>setFiltre(k)}
            style={{ padding:'8px 14px', borderRadius:8, fontSize:13, cursor:'pointer', fontFamily:'inherit',
              background: filtre===k?'var(--accent-soft)':'var(--surface)',
              border:`1px solid ${filtre===k?'var(--accent)':'var(--border)'}`,
              color: filtre===k?'var(--accent)':'var(--text-dim)' }}>{k}</button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:14 }}>
        {yukleniyor ? <div style={{ color:'var(--text-faint)', padding:40 }}>Yükleniyor...</div> :
         filtreli.length === 0 ? <div style={{ color:'var(--text-faint)', padding:40 }}>Kayıt yok</div> :
         filtreli.map(i => (
          <div key={i.id} className="card" style={{ padding:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <span style={{ fontSize:11, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:0.5 }}>{i.kategori}</span>
                <span style={{ fontWeight:600 }}>{i.baslik}</span>
              </div>
              <span className="badge" style={{ background:`${DURUM_RENK[i.durum]}22`, color:DURUM_RENK[i.durum] }}>{i.durum}</span>
            </div>
            {i.detay && <div style={{ fontSize:13, color:'var(--text-dim)', marginBottom:8 }}>{i.detay}</div>}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12, paddingTop:12, borderTop:'1px solid var(--border)' }}>
              <span style={{ fontSize:12, color:'var(--text-faint)' }}>{i.sorumlu||''} {i.son_tarih?`· ${new Date(i.son_tarih).toLocaleDateString('tr-TR')}`:''}</span>
              <select value={i.durum} onChange={e=>durumGuncelle(i.id, e.target.value)} style={{ width:'auto', padding:'4px 8px', fontSize:12 }}>
                <option>Açık</option><option>Devam</option><option>Tamamlandı</option><option>İptal</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-wrap" style={ovl} onClick={()=>setModal(false)}>
          <div className="card modal-box" style={modalBox} onClick={e=>e.stopPropagation()}>
            <div style={modalHead}><h2 style={modalTitle}><ClipboardList size={20} color="var(--accent)" /> Yeni Kayıt</h2><button onClick={()=>setModal(false)} style={xBtn}><X size={22} /></button></div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label style={lbl}>Kategori</label><select value={form.kategori} onChange={e=>setForm({...form, kategori:e.target.value})}>{KATEGORILER.map(k=><option key={k}>{k}</option>)}</select></div>
              <div><label style={lbl}>Başlık *</label><input value={form.baslik} onChange={e=>setForm({...form, baslik:e.target.value})} placeholder="Araç muayene, ofis malzeme..." /></div>
              <div><label style={lbl}>Detay</label><textarea rows={2} value={form.detay} onChange={e=>setForm({...form, detay:e.target.value})} /></div>
              <div className="modal-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div><label style={lbl}>Sorumlu</label><input value={form.sorumlu} onChange={e=>setForm({...form, sorumlu:e.target.value})} /></div>
                <div><label style={lbl}>Son Tarih</label><input type="date" value={form.son_tarih} onChange={e=>setForm({...form, son_tarih:e.target.value})} /></div>
              </div>
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
