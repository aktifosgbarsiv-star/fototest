'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Search, X, Building2 } from 'lucide-react'

const TEHLIKE_RENK: any = { 'Az Tehlikeli':'var(--green)', 'Tehlikeli':'var(--amber)', 'Çok Tehlikeli':'var(--red)' }

export default function Firmalar() {
  const [firmalar, setFirmalar] = useState<any[]>([])
  const [arama, setArama] = useState('')
  const [modal, setModal] = useState(false)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [form, setForm] = useState<any>(bosForm())

  function bosForm() {
    return { unvan:'', yetkili:'', telefon:'', bolge:'', tehlike_sinifi:'Az Tehlikeli', sgk_sicil:'', calisan_sayisi:'', gorevli_igu:'', gorevli_ih:'', gorevli_dsp:'', ziyaret_periyodu:'', faaliyet:'' }
  }

  const sb = createClient()
  useEffect(() => { yukle() }, [])

  async function yukle() {
    const { data } = await sb.from('firmalar').select('*').order('unvan')
    setFirmalar(data || [])
    setYukleniyor(false)
  }

  async function kaydet() {
    if (!form.unvan) return
    await sb.from('firmalar').insert({ ...form, calisan_sayisi: Number(form.calisan_sayisi)||null })
    setModal(false); setForm(bosForm()); yukle()
  }

  const filtreli = firmalar.filter(f =>
    f.unvan?.toLowerCase().includes(arama.toLowerCase()) ||
    f.bolge?.toLowerCase().includes(arama.toLowerCase())
  )

  return (
    <div style={{ padding:'32px 28px', maxWidth:1400, margin:'0 auto' }} className="fade-in">
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:700, letterSpacing:-0.5 }}>Firmalar</h1>
          <p style={{ color:'var(--text-dim)', fontSize:14, marginTop:4 }}>{filtreli.length} firma</p>
        </div>
        <button className="btn" onClick={()=>setModal(true)}><Plus size={18} /> Yeni Firma</button>
      </div>

      <div style={{ position:'relative', marginBottom:20, maxWidth:360 }}>
        <Search size={17} style={{ position:'absolute', left:14, top:12, color:'var(--text-faint)' }} />
        <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="Firma veya bölge ara..." style={{ paddingLeft:40 }} />
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table>
            <thead>
              <tr><th>Ünvan</th><th>Bölge</th><th>Tehlike</th><th>Çalışan</th><th>İGU</th><th>İH</th><th>Periyot</th></tr>
            </thead>
            <tbody>
              {yukleniyor ? <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text-faint)', padding:40 }}>Yükleniyor...</td></tr> :
               filtreli.length === 0 ? <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text-faint)', padding:40 }}>Firma yok — ilk firmayı ekle</td></tr> :
               filtreli.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight:500 }}>{f.unvan}<div style={{ fontSize:12, color:'var(--text-faint)' }}>{f.yetkili} {f.telefon?`· ${f.telefon}`:''}</div></td>
                  <td style={{ color:'var(--text-dim)' }}>{f.bolge||'—'}</td>
                  <td>{f.tehlike_sinifi && <span className="badge" style={{ background:`${TEHLIKE_RENK[f.tehlike_sinifi]}22`, color:TEHLIKE_RENK[f.tehlike_sinifi] }}>{f.tehlike_sinifi}</span>}</td>
                  <td>{f.calisan_sayisi||'—'}</td>
                  <td style={{ color:'var(--text-dim)', fontSize:13 }}>{f.gorevli_igu||'—'}</td>
                  <td style={{ color:'var(--text-dim)', fontSize:13 }}>{f.gorevli_ih||'—'}</td>
                  <td style={{ color:'var(--text-dim)', fontSize:13 }}>{f.ziyaret_periyodu||'—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div style={ovl} onClick={()=>setModal(false)}>
          <div className="card" style={modalBox} onClick={e=>e.stopPropagation()}>
            <div style={modalHead}><h2 style={modalTitle}><Building2 size={20} color="var(--blue)" /> Yeni Firma</h2><button onClick={()=>setModal(false)} style={xBtn}><X size={22} /></button></div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div style={{ gridColumn:'1/3' }}><label style={lbl}>Ünvan *</label><input value={form.unvan} onChange={e=>setForm({...form, unvan:e.target.value})} /></div>
              <div><label style={lbl}>Yetkili</label><input value={form.yetkili} onChange={e=>setForm({...form, yetkili:e.target.value})} /></div>
              <div><label style={lbl}>Telefon</label><input value={form.telefon} onChange={e=>setForm({...form, telefon:e.target.value})} /></div>
              <div><label style={lbl}>Bölge</label><input value={form.bolge} onChange={e=>setForm({...form, bolge:e.target.value})} placeholder="Merkez / Sandıklı" /></div>
              <div><label style={lbl}>Tehlike Sınıfı</label><select value={form.tehlike_sinifi} onChange={e=>setForm({...form, tehlike_sinifi:e.target.value})}><option>Az Tehlikeli</option><option>Tehlikeli</option><option>Çok Tehlikeli</option></select></div>
              <div><label style={lbl}>SGK Sicil No</label><input value={form.sgk_sicil} onChange={e=>setForm({...form, sgk_sicil:e.target.value})} /></div>
              <div><label style={lbl}>Çalışan Sayısı</label><input type="number" value={form.calisan_sayisi} onChange={e=>setForm({...form, calisan_sayisi:e.target.value})} /></div>
              <div><label style={lbl}>Görevli İGU</label><input value={form.gorevli_igu} onChange={e=>setForm({...form, gorevli_igu:e.target.value})} /></div>
              <div><label style={lbl}>Görevli İH</label><input value={form.gorevli_ih} onChange={e=>setForm({...form, gorevli_ih:e.target.value})} /></div>
              <div><label style={lbl}>Görevli DSP</label><input value={form.gorevli_dsp} onChange={e=>setForm({...form, gorevli_dsp:e.target.value})} /></div>
              <div><label style={lbl}>Ziyaret Periyodu</label><input value={form.ziyaret_periyodu} onChange={e=>setForm({...form, ziyaret_periyodu:e.target.value})} placeholder="Aylık" /></div>
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
const modalBox: any = { width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', padding:28 }
const modalHead: any = { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }
const modalTitle: any = { fontFamily:'Sora, sans-serif', fontSize:20, fontWeight:600, display:'flex', alignItems:'center', gap:10 }
const xBtn: any = { background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }
