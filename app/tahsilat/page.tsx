'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Search, X, Wallet, AlertTriangle } from 'lucide-react'

export default function Tahsilat() {
  const [cariler, setCariler] = useState<any[]>([])
  const [arama, setArama] = useState('')
  const [modal, setModal] = useState(false)
  const [tahsilatModal, setTahsilatModal] = useState<any>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [form, setForm] = useState<any>(bosForm())
  const [tForm, setTForm] = useState<any>({ tutar:'', odeme_turu:'Havale', aciklama:'' })

  function bosForm() {
    return { unvan:'', musteri_no:'', telefon:'', sinif:'MERKEZ', acik_bakiye:'', vadesi_gecen_tutar:'', gecen_gun_sayisi:'', cek_senet_bakiyesi:'', son_tahsilat:'' }
  }

  const sb = createClient()
  useEffect(() => { yukle() }, [])

  async function yukle() {
    const { data } = await sb.from('cariler').select('*').order('vadesi_gecen_tutar', { ascending:false })
    setCariler(data || [])
    setYukleniyor(false)
  }

  async function kaydet() {
    if (!form.unvan) return
    await sb.from('cariler').insert({
      ...form,
      acik_bakiye: Number(form.acik_bakiye)||0,
      vadesi_gecen_tutar: Number(form.vadesi_gecen_tutar)||0,
      gecen_gun_sayisi: Number(form.gecen_gun_sayisi)||0,
      cek_senet_bakiyesi: Number(form.cek_senet_bakiyesi)||0,
      son_tahsilat: form.son_tahsilat||null
    })
    setModal(false); setForm(bosForm()); yukle()
  }

  async function tahsilatYap() {
    const tutar = Number(tForm.tutar)||0
    if (!tutar || !tahsilatModal) return
    await sb.from('tahsilatlar').insert({ cari_id:tahsilatModal.id, tutar, odeme_turu:tForm.odeme_turu, aciklama:tForm.aciklama })
    const yeniBakiye = Math.max(0, (Number(tahsilatModal.acik_bakiye)||0) - tutar)
    const yeniVade = Math.max(0, (Number(tahsilatModal.vadesi_gecen_tutar)||0) - tutar)
    await sb.from('cariler').update({ acik_bakiye:yeniBakiye, vadesi_gecen_tutar:yeniVade, son_tahsilat:new Date().toISOString().slice(0,10) }).eq('id', tahsilatModal.id)
    setTahsilatModal(null); setTForm({ tutar:'', odeme_turu:'Havale', aciklama:'' }); yukle()
  }

  const filtreli = cariler.filter(c => c.unvan?.toLowerCase().includes(arama.toLowerCase()))
  const tl = (n:number) => new Intl.NumberFormat('tr-TR', { minimumFractionDigits:2, maximumFractionDigits:2 }).format(n) + ' ₺'
  const toplamAcik = filtreli.reduce((s,c)=>s+(Number(c.acik_bakiye)||0),0)
  const toplamVade = filtreli.reduce((s,c)=>s+(Number(c.vadesi_gecen_tutar)||0),0)

  return (
    <div className="page-pad fade-in" style={{ padding:'32px 28px', maxWidth:1400, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:700, letterSpacing:-0.5 }}>Tahsilat & Cari</h1>
          <p style={{ color:'var(--text-dim)', fontSize:14, marginTop:4 }}>Vade aşım listesi</p>
        </div>
        <button className="btn" onClick={()=>setModal(true)}><Plus size={18} /> Yeni Cari</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontSize:13, color:'var(--text-dim)', marginBottom:6 }}>Toplam Açık Bakiye</div>
          <div style={{ fontFamily:'Sora, sans-serif', fontSize:24, fontWeight:700 }}>{tl(toplamAcik)}</div>
        </div>
        <div className="card" style={{ padding:20, borderColor:'rgba(248,113,113,0.25)' }}>
          <div style={{ fontSize:13, color:'var(--text-dim)', marginBottom:6 }}>Vadesi Geçen</div>
          <div style={{ fontFamily:'Sora, sans-serif', fontSize:24, fontWeight:700, color:'var(--red)' }}>{tl(toplamVade)}</div>
        </div>
      </div>

      <div style={{ position:'relative', marginBottom:20, maxWidth:360 }}>
        <Search size={17} style={{ position:'absolute', left:14, top:12, color:'var(--text-faint)' }} />
        <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="Cari ara..." style={{ paddingLeft:40 }} />
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table>
            <thead>
              <tr><th>İsim / Ünvan</th><th>Sınıf</th><th>Açık Bakiye</th><th>Vadesi Geçen</th><th>Gün</th><th>Son Tahsilat</th><th></th></tr>
            </thead>
            <tbody>
              {yukleniyor ? <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text-faint)', padding:40 }}>Yükleniyor...</td></tr> :
               filtreli.length === 0 ? <tr><td colSpan={7} style={{ textAlign:'center', color:'var(--text-faint)', padding:40 }}>Cari yok</td></tr> :
               filtreli.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight:500 }}>{c.unvan}<div style={{ fontSize:12, color:'var(--text-faint)' }}>{c.telefon}</div></td>
                  <td><span style={{ fontSize:12, color:'var(--text-dim)' }}>{c.sinif}</span></td>
                  <td style={{ fontWeight:600, whiteSpace:'nowrap' }}>{tl(Number(c.acik_bakiye)||0)}</td>
                  <td style={{ whiteSpace:'nowrap' }}>
                    {c.vadesi_gecen_tutar > 0 ? <span style={{ color:'var(--red)', fontWeight:600 }}>{tl(Number(c.vadesi_gecen_tutar))}</span> : <span style={{ color:'var(--text-faint)' }}>—</span>}
                  </td>
                  <td>
                    {c.gecen_gun_sayisi > 0 && (
                      <span className="badge" style={{ background: c.gecen_gun_sayisi>90?'var(--red-soft)':c.gecen_gun_sayisi>30?'var(--amber-soft)':'var(--blue-soft)', color: c.gecen_gun_sayisi>90?'var(--red)':c.gecen_gun_sayisi>30?'var(--amber)':'var(--blue)' }}>
                        {c.gecen_gun_sayisi}g
                      </span>
                    )}
                  </td>
                  <td style={{ color:'var(--text-dim)', whiteSpace:'nowrap' }}>{c.son_tahsilat ? new Date(c.son_tahsilat).toLocaleDateString('tr-TR') : '—'}</td>
                  <td><button className="btn" style={{ padding:'6px 12px', fontSize:12 }} onClick={()=>setTahsilatModal(c)}>Tahsilat</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* YENİ CARİ MODAL */}
      {modal && (
        <div className="modal-wrap" style={ovl} onClick={()=>setModal(false)}>
          <div className="card modal-box" style={modalBox} onClick={e=>e.stopPropagation()}>
            <div style={modalHead}><h2 style={modalTitle}><Wallet size={20} color="var(--accent)" /> Yeni Cari</h2><button onClick={()=>setModal(false)} style={xBtn}><X size={22} /></button></div>
            <div className="modal-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div style={{ gridColumn:'1/3' }}><label style={lbl}>Ünvan *</label><input value={form.unvan} onChange={e=>setForm({...form, unvan:e.target.value})} /></div>
              <div><label style={lbl}>Müşteri No</label><input value={form.musteri_no} onChange={e=>setForm({...form, musteri_no:e.target.value})} /></div>
              <div><label style={lbl}>Telefon</label><input value={form.telefon} onChange={e=>setForm({...form, telefon:e.target.value})} /></div>
              <div><label style={lbl}>Sınıf</label><input value={form.sinif} onChange={e=>setForm({...form, sinif:e.target.value})} placeholder="MERKEZ / SANDIKLI" /></div>
              <div><label style={lbl}>Açık Bakiye</label><input type="number" value={form.acik_bakiye} onChange={e=>setForm({...form, acik_bakiye:e.target.value})} /></div>
              <div><label style={lbl}>Vadesi Geçen</label><input type="number" value={form.vadesi_gecen_tutar} onChange={e=>setForm({...form, vadesi_gecen_tutar:e.target.value})} /></div>
              <div><label style={lbl}>Geçen Gün</label><input type="number" value={form.gecen_gun_sayisi} onChange={e=>setForm({...form, gecen_gun_sayisi:e.target.value})} /></div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button className="btn-ghost btn" style={{ flex:1, justifyContent:'center' }} onClick={()=>setModal(false)}>İptal</button>
              <button className="btn" style={{ flex:1, justifyContent:'center' }} onClick={kaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      {/* TAHSİLAT MODAL */}
      {tahsilatModal && (
        <div className="modal-wrap" style={ovl} onClick={()=>setTahsilatModal(null)}>
          <div className="card" style={{ ...modalBox, maxWidth:420 }} onClick={e=>e.stopPropagation()}>
            <div style={modalHead}><h2 style={modalTitle}><Wallet size={20} color="var(--green)" /> Tahsilat Al</h2><button onClick={()=>setTahsilatModal(null)} style={xBtn}><X size={22} /></button></div>
            <div style={{ background:'var(--surface-2)', borderRadius:10, padding:14, marginBottom:16 }}>
              <div style={{ fontWeight:600 }}>{tahsilatModal.unvan}</div>
              <div style={{ fontSize:13, color:'var(--text-dim)', marginTop:2 }}>Açık bakiye: {tl(Number(tahsilatModal.acik_bakiye)||0)}</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label style={lbl}>Tahsilat Tutarı *</label><input type="number" value={tForm.tutar} onChange={e=>setTForm({...tForm, tutar:e.target.value})} placeholder="0" autoFocus /></div>
              <div><label style={lbl}>Ödeme Türü</label><select value={tForm.odeme_turu} onChange={e=>setTForm({...tForm, odeme_turu:e.target.value})}><option>Nakit</option><option>Havale</option><option>Çek</option><option>Senet</option><option>POS</option></select></div>
              <div><label style={lbl}>Açıklama</label><input value={tForm.aciklama} onChange={e=>setTForm({...tForm, aciklama:e.target.value})} /></div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:20 }}>
              <button className="btn-ghost btn" style={{ flex:1, justifyContent:'center' }} onClick={()=>setTahsilatModal(null)}>İptal</button>
              <button className="btn" style={{ flex:1, justifyContent:'center' }} onClick={tahsilatYap}>Tahsil Et</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
const lbl: any = { display:'block', fontSize:12, color:'var(--text-dim)', marginBottom:6, fontWeight:500 }
const ovl: any = { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', zIndex:400, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }
const modalBox: any = { width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', padding:28 }
const modalHead: any = { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }
const modalTitle: any = { fontFamily:'Sora, sans-serif', fontSize:20, fontWeight:600, display:'flex', alignItems:'center', gap:10 }
const xBtn: any = { background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }
