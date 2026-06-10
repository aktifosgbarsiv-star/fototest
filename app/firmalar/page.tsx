'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Search, X, Building2, Trash2, Pencil } from 'lucide-react'

const TEHLIKE_RENK: any = { 'Az Tehlikeli':'var(--green)', 'Tehlikeli':'var(--amber)', 'Çok Tehlikeli':'var(--red)' }
const TEHLIKE = ['Az Tehlikeli','Tehlikeli','Çok Tehlikeli']

export default function Firmalar() {
  const [firmalar, setFirmalar] = useState<any[]>([])
  const [arama, setArama] = useState('')
  const [modal, setModal] = useState(false)
  const [duzenle, setDuzenle] = useState<any>(null)
  const [detay, setDetay] = useState<any>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState('')
  const [form, setForm] = useState<any>(bosForm())

  function bosForm() {
    return { unvan:'', yetkili:'', telefon:'', adres:'', bolge:'', tehlike_sinifi:'Az Tehlikeli', sgk_sicil:'', calisan_sayisi:'', gorevli_igu:'', gorevli_ih:'', gorevli_dsp:'', ziyaret_periyodu:'', faaliyet:'' }
  }

  const sb = createClient()
  useEffect(() => { yukle() }, [])

  async function yukle() {
    const { data, error } = await sb.from('firmalar').select('*').order('unvan')
    if (error) { setHata('Veriler yüklenemedi.'); return }
    setFirmalar(data || [])
    setYukleniyor(false)
  }

  async function kaydet() {
    if (!form.unvan) return
    setHata('')
    if (duzenle) {
      const { error } = await sb.from('firmalar').update({ ...form, calisan_sayisi: Number(form.calisan_sayisi)||null }).eq('id', duzenle.id)
      if (error) { setHata('Güncelleme hatası: ' + error.message); return }
      setDuzenle(null)
    } else {
      const { error } = await sb.from('firmalar').insert({ ...form, calisan_sayisi: Number(form.calisan_sayisi)||null })
      if (error) { setHata('Kayıt hatası: ' + error.message); return }
      setModal(false)
    }
    setForm(bosForm()); yukle()
  }

  async function sil(id: string) {
    if (!confirm('Bu firmayı silmek istiyor musunuz?')) return
    await sb.from('firmalar').delete().eq('id', id)
    yukle()
  }

  function duzenleAc(f: any) {
    setDuzenle(f)
    setForm({ ...bosForm(), ...f, calisan_sayisi: f.calisan_sayisi?.toString()||'' })
  }

  const filtreli = firmalar.filter(f =>
    f.unvan?.toLowerCase().includes(arama.toLowerCase()) ||
    f.bolge?.toLowerCase().includes(arama.toLowerCase()) ||
    f.faaliyet?.toLowerCase().includes(arama.toLowerCase())
  )

  return (
    <div className="page-pad fade-in" style={{ padding:'32px 28px', maxWidth:1400, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:700, letterSpacing:-0.5 }}>Firmalar</h1>
          <p style={{ color:'var(--text-dim)', fontSize:14, marginTop:4 }}>{filtreli.length} firma</p>
        </div>
        <button className="btn" onClick={()=>{ setDuzenle(null); setForm(bosForm()); setModal(true) }}><Plus size={18} /> Yeni Firma</button>
      </div>

      {hata && <div style={{ background:'var(--red-soft)', color:'var(--red)', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>{hata}</div>}

      <div style={{ position:'relative', marginBottom:20, maxWidth:360 }}>
        <Search size={17} style={{ position:'absolute', left:14, top:12, color:'var(--text-faint)' }} />
        <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="Firma, bölge veya faaliyet ara..." style={{ paddingLeft:40 }} />
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table>
            <thead>
              <tr><th>Ünvan</th><th>Bölge</th><th>Faaliyet</th><th>Tehlike</th><th>Çalışan</th><th>İGU</th><th>İH</th><th>Periyot</th><th></th></tr>
            </thead>
            <tbody>
              {yukleniyor ? (
                <tr><td colSpan={9} style={{ textAlign:'center', color:'var(--text-faint)', padding:40 }}>Yükleniyor...</td></tr>
              ) : filtreli.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign:'center', color:'var(--text-faint)', padding:40 }}>Firma yok</td></tr>
              ) : filtreli.map(f => (
                <tr key={f.id} style={{ cursor:'pointer' }} onClick={()=>setDetay(f)}>
                  <td style={{ fontWeight:500 }}>
                    {f.unvan}
                    {f.yetkili && <div style={{ fontSize:12, color:'var(--text-faint)' }}>{f.yetkili}</div>}
                  </td>
                  <td style={{ color:'var(--text-dim)' }}>{f.bolge||'—'}</td>
                  <td style={{ color:'var(--text-dim)', fontSize:13 }}>{f.faaliyet||'—'}</td>
                  <td>
                    <span className="badge" style={{ background:`${TEHLIKE_RENK[f.tehlike_sinifi]}22`, color:TEHLIKE_RENK[f.tehlike_sinifi] }}>
                      {f.tehlike_sinifi}
                    </span>
                  </td>
                  <td style={{ color:'var(--text-dim)' }}>{f.calisan_sayisi||'—'}</td>
                  <td style={{ color:'var(--text-dim)', fontSize:13 }}>{f.gorevli_igu||'—'}</td>
                  <td style={{ color:'var(--text-dim)', fontSize:13 }}>{f.gorevli_ih||'—'}</td>
                  <td style={{ color:'var(--text-dim)', fontSize:13 }}>{f.ziyaret_periyodu||'—'}</td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div style={{ display:'flex', gap:4 }}>
                      <button onClick={()=>duzenleAc(f)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', padding:4 }}><Pencil size={14} /></button>
                      <button onClick={()=>sil(f.id)} style={{ background:'none', border:'none', color:'var(--text-faint)', cursor:'pointer', padding:4 }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAY MODAL */}
      {detay && (
        <div style={ovl} onClick={()=>setDetay(null)}>
          <div className="card" style={{ ...modalBox, maxWidth:480 }} onClick={e=>e.stopPropagation()}>
            <div style={modalHead}>
              <h2 style={modalTitle}><Building2 size={20} color="var(--blue)" /> Firma Detayı</h2>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <button onClick={()=>{ setDetay(null); duzenleAc(detay) }} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', color:'var(--text-dim)', borderRadius:8, padding:'6px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:6, fontSize:13 }}><Pencil size={14}/> Düzenle</button>
                <button onClick={()=>setDetay(null)} style={xBtn}><X size={22} /></button>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                ['Ünvan', detay.unvan],
                ['Yetkili', detay.yetkili||'—'],
                ['Telefon', detay.telefon||'—'],
                ['Adres', detay.adres||'—'],
                ['Bölge', detay.bolge||'—'],
                ['Faaliyet', detay.faaliyet||'—'],
                ['Tehlike Sınıfı', detay.tehlike_sinifi],
                ['SGK Sicil', detay.sgk_sicil||'—'],
                ['Çalışan Sayısı', detay.calisan_sayisi||'—'],
                ['İSG Uzmanı', detay.gorevli_igu||'—'],
                ['İş Hekimi', detay.gorevli_ih||'—'],
                ['DSP', detay.gorevli_dsp||'—'],
                ['Ziyaret Periyodu', detay.ziyaret_periyodu||'—'],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', gap:12, fontSize:14 }}>
                  <span style={{ color:'var(--text-dim)', minWidth:120 }}>{k}</span>
                  <span style={{ fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* EKLE / DÜZENLE MODAL */}
      {(modal || duzenle) && (
        <div className="modal-wrap" style={ovl} onClick={()=>{ setModal(false); setDuzenle(null) }}>
          <div className="card modal-box" style={modalBox} onClick={e=>e.stopPropagation()}>
            <div style={modalHead}>
              <h2 style={modalTitle}><Building2 size={20} color="var(--blue)" /> {duzenle ? 'Firma Düzenle' : 'Yeni Firma'}</h2>
              <button onClick={()=>{ setModal(false); setDuzenle(null) }} style={xBtn}><X size={22} /></button>
            </div>
            <div className="modal-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div style={{ gridColumn:'1/3' }}><label style={lbl}>Ünvan *</label><input value={form.unvan} onChange={e=>setForm({...form, unvan:e.target.value})} placeholder="Firma adı" /></div>
              <div><label style={lbl}>Yetkili</label><input value={form.yetkili} onChange={e=>setForm({...form, yetkili:e.target.value})} /></div>
              <div><label style={lbl}>Telefon</label><input value={form.telefon} onChange={e=>setForm({...form, telefon:e.target.value})} /></div>
              <div style={{ gridColumn:'1/3' }}><label style={lbl}>Adres</label><input value={form.adres} onChange={e=>setForm({...form, adres:e.target.value})} /></div>
              <div><label style={lbl}>Bölge</label><input value={form.bolge} onChange={e=>setForm({...form, bolge:e.target.value})} placeholder="İlçe / İl" /></div>
              <div><label style={lbl}>Faaliyet Alanı</label><input value={form.faaliyet} onChange={e=>setForm({...form, faaliyet:e.target.value})} placeholder="Mermer üretimi" /></div>
              <div><label style={lbl}>Tehlike Sınıfı</label>
                <select value={form.tehlike_sinifi} onChange={e=>setForm({...form, tehlike_sinifi:e.target.value})}>
                  {TEHLIKE.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Çalışan Sayısı</label><input type="number" value={form.calisan_sayisi} onChange={e=>setForm({...form, calisan_sayisi:e.target.value})} /></div>
              <div><label style={lbl}>SGK Sicil No</label><input value={form.sgk_sicil} onChange={e=>setForm({...form, sgk_sicil:e.target.value})} /></div>
              <div><label style={lbl}>Ziyaret Periyodu</label><input value={form.ziyaret_periyodu} onChange={e=>setForm({...form, ziyaret_periyodu:e.target.value})} placeholder="Aylık / 3 Aylık" /></div>
              <div><label style={lbl}>İSG Uzmanı</label><input value={form.gorevli_igu} onChange={e=>setForm({...form, gorevli_igu:e.target.value})} /></div>
              <div><label style={lbl}>İş Hekimi</label><input value={form.gorevli_ih} onChange={e=>setForm({...form, gorevli_ih:e.target.value})} /></div>
              <div><label style={lbl}>DSP</label><input value={form.gorevli_dsp} onChange={e=>setForm({...form, gorevli_dsp:e.target.value})} /></div>
            </div>
            {hata && <div style={{ background:'var(--red-soft)', color:'var(--red)', padding:'10px 14px', borderRadius:8, fontSize:13, marginTop:12 }}>{hata}</div>}
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button className="btn-ghost btn" style={{ flex:1, justifyContent:'center' }} onClick={()=>{ setModal(false); setDuzenle(null) }}>İptal</button>
              <button className="btn" style={{ flex:1, justifyContent:'center' }} onClick={kaydet}>{duzenle ? 'Güncelle' : 'Kaydet'}</button>
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
