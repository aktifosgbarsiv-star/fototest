'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Plus, Search, X, FileText, Trash2 } from 'lucide-react'

const DURUMLAR = ['Beklemede','Görüşülüyor','Olumlu','Olumsuz']
const DURUM_RENK: any = { Beklemede:'var(--amber)', Görüşülüyor:'var(--blue)', Olumlu:'var(--green)', Olumsuz:'var(--red)' }
const TEHLIKE = ['Az Tehlikeli','Tehlikeli','Çok Tehlikeli']
const ILETIM = ['Whatsapp','Mail','Telefon','Yüz yüze']

export default function Teklifler() {
  const [teklifler, setTeklifler] = useState<any[]>([])
  const [arama, setArama] = useState('')
  const [filtre, setFiltre] = useState('Hepsi')
  const [modal, setModal] = useState(false)
  const [detayModal, setDetayModal] = useState<any>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState('')
  const [form, setForm] = useState<any>(bosForm())

  function bosForm() {
    return {
      musteri_unvan:'', yetkili:'', telefon:'', adres:'',
      firma_detay:'', tehlike_sinifi:'Az Tehlikeli', calisan_sayisi:'',
      teklif_tarihi: new Date().toISOString().slice(0,10),
      teklif_icerigi:'', surec_durumu:'Beklemede',
      surec_notu:'', iletim_turu:'Whatsapp', iletisim_notu:''
    }
  }

  const sb = createClient()
  useEffect(() => { yukle() }, [])

  async function yukle() {
    const { data, error } = await sb.from('teklifler').select('*').order('created_at', { ascending:false })
    if (error) { setHata('Veriler yüklenemedi.'); return }
    setTeklifler(data || [])
    setYukleniyor(false)
  }

  async function kaydet() {
    if (!form.musteri_unvan) return
    setHata('')
    const { error } = await sb.from('teklifler').insert({ ...form, calisan_sayisi: Number(form.calisan_sayisi)||null })
    if (error) { setHata('Kayıt hatası: ' + error.message); return }
    setModal(false); setForm(bosForm()); yukle()
  }

  async function durumGuncelle(id:string, durum:string) {
    await sb.from('teklifler').update({ surec_durumu:durum }).eq('id', id)
    yukle()
  }

  async function sil(id: string) {
    if (!confirm('Bu teklifi silmek istiyor musunuz?')) return
    await sb.from('teklifler').delete().eq('id', id)
    yukle()
  }

  const filtreli = teklifler.filter(t => {
    const aramaOk = t.musteri_unvan?.toLowerCase().includes(arama.toLowerCase()) ||
                    t.yetkili?.toLowerCase().includes(arama.toLowerCase())
    const filtreOk = filtre === 'Hepsi' || t.surec_durumu === filtre
    return aramaOk && filtreOk
  })

  const sayilar = DURUMLAR.reduce((acc:any,d)=>({ ...acc, [d]: teklifler.filter(t=>t.surec_durumu===d).length }), {})

  return (
    <div className="page-pad fade-in" style={{ padding:'32px 28px', maxWidth:1400, margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
        <div>
          <h1 style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:700, letterSpacing:-0.5 }}>Satış Teklifleri</h1>
          <p style={{ color:'var(--text-dim)', fontSize:14, marginTop:4 }}>{filtreli.length} teklif</p>
        </div>
        <button className="btn" onClick={()=>setModal(true)}><Plus size={18} /> Yeni Teklif</button>
      </div>

      {/* DURUM ÖZETİ */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:12, marginBottom:20 }}>
        {DURUMLAR.map(d=>(
          <div key={d} className="card" style={{ padding:'14px 16px', cursor:'pointer', borderColor: filtre===d ? DURUM_RENK[d] : undefined }}
            onClick={()=>setFiltre(filtre===d?'Hepsi':d)}>
            <div style={{ fontSize:22, fontWeight:700, fontFamily:'Sora,sans-serif', color:DURUM_RENK[d] }}>{sayilar[d]}</div>
            <div style={{ fontSize:12, color:'var(--text-dim)', marginTop:2 }}>{d}</div>
          </div>
        ))}
      </div>

      {hata && <div style={{ background:'var(--red-soft)', color:'var(--red)', padding:'10px 14px', borderRadius:8, fontSize:13, marginBottom:16 }}>{hata}</div>}

      <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:20, alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:240, maxWidth:360 }}>
          <Search size={17} style={{ position:'absolute', left:14, top:12, color:'var(--text-faint)' }} />
          <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="Müşteri veya yetkili ara..." style={{ paddingLeft:40 }} />
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['Hepsi',...DURUMLAR].map(d => (
            <button key={d} onClick={()=>setFiltre(d)}
              style={{ padding:'8px 14px', borderRadius:8, fontSize:13, cursor:'pointer', fontFamily:'inherit', transition:'all .12s',
                background: filtre===d ? 'var(--accent-soft)' : 'var(--surface)',
                border:`1px solid ${filtre===d ? 'var(--accent)' : 'var(--border)'}`,
                color: filtre===d ? 'var(--accent)' : 'var(--text-dim)' }}>{d}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:14 }}>
        {yukleniyor ? <div style={{ color:'var(--text-faint)', padding:40 }}>Yükleniyor...</div> :
         filtreli.length === 0 ? <div style={{ color:'var(--text-faint)', padding:40 }}>Teklif yok</div> :
         filtreli.map(t => (
          <div key={t.id} className="card" style={{ padding:20, cursor:'pointer' }} onClick={()=>setDetayModal(t)}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <div style={{ fontWeight:600, fontSize:15, color:'var(--accent)' }}>{t.musteri_unvan}</div>
                {t.yetkili && <div style={{ fontSize:13, color:'var(--text-dim)', marginTop:2 }}>{t.yetkili}</div>}
              </div>
              <span className="badge" style={{ background:`${DURUM_RENK[t.surec_durumu]}22`, color:DURUM_RENK[t.surec_durumu] }}>{t.surec_durumu}</span>
            </div>

            {t.firma_detay && <div style={{ fontSize:13, color:'var(--text-dim)', marginBottom:8 }}>{t.firma_detay}{t.calisan_sayisi?` · ${t.calisan_sayisi} kişi`:''}</div>}
            {t.teklif_icerigi && <div style={{ fontSize:13, marginBottom:8 }}>{t.teklif_icerigi}</div>}
            {t.surec_notu && <div style={{ fontSize:13, color:'var(--text-dim)', fontStyle:'italic', marginBottom:12, paddingLeft:10, borderLeft:'2px solid var(--border)' }}>{t.surec_notu}</div>}

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, marginTop:14, paddingTop:14, borderTop:'1px solid var(--border)' }} onClick={e=>e.stopPropagation()}>
              <div style={{ fontSize:12, color:'var(--text-faint)' }}>
                {t.teklif_tarihi && new Date(t.teklif_tarihi+'T00:00:00').toLocaleDateString('tr-TR')} {t.iletim_turu?`· ${t.iletim_turu}`:''}
              </div>
              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                <select value={t.surec_durumu} onChange={e=>durumGuncelle(t.id, e.target.value)}
                  style={{ width:'auto', padding:'5px 10px', fontSize:12, background:'var(--surface-2)' }}>
                  {DURUMLAR.map(d=><option key={d} value={d}>{d}</option>)}
                </select>
                <button onClick={()=>sil(t.id)} style={{ background:'none', border:'none', color:'var(--text-faint)', cursor:'pointer', padding:4 }}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DETAY MODAL */}
      {detayModal && (
        <div style={ovl} onClick={()=>setDetayModal(null)}>
          <div className="card" style={{ ...modalBox, maxWidth:520 }} onClick={e=>e.stopPropagation()}>
            <div style={modalHead}>
              <h2 style={modalTitle}><FileText size={20} color="var(--amber)" /> Teklif Detayı</h2>
              <button onClick={()=>setDetayModal(null)} style={xBtn}><X size={22} /></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                ['Müşteri', detayModal.musteri_unvan],
                ['Yetkili', detayModal.yetkili||'—'],
                ['Telefon', detayModal.telefon||'—'],
                ['Adres', detayModal.adres||'—'],
                ['Firma Detayı', detayModal.firma_detay||'—'],
                ['Tehlike Sınıfı', detayModal.tehlike_sinifi||'—'],
                ['Çalışan Sayısı', detayModal.calisan_sayisi||'—'],
                ['Teklif Tarihi', detayModal.teklif_tarihi ? new Date(detayModal.teklif_tarihi+'T00:00:00').toLocaleDateString('tr-TR') : '—'],
                ['Teklif İçeriği', detayModal.teklif_icerigi||'—'],
                ['Süreç', detayModal.surec_durumu],
                ['Süreç Notu', detayModal.surec_notu||'—'],
                ['İletim Türü', detayModal.iletim_turu||'—'],
                ['İletişim Notu', detayModal.iletisim_notu||'—'],
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

      {/* YENİ TEKLİF MODAL */}
      {modal && (
        <div className="modal-wrap" style={ovl} onClick={()=>setModal(false)}>
          <div className="card modal-box" style={modalBox} onClick={e=>e.stopPropagation()}>
            <div style={modalHead}>
              <h2 style={modalTitle}><FileText size={20} color="var(--amber)" /> Yeni Teklif</h2>
              <button onClick={()=>setModal(false)} style={xBtn}><X size={22} /></button>
            </div>
            <div className="modal-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div style={{ gridColumn:'1/3' }}><label style={lbl}>Müşteri Ünvanı *</label><input value={form.musteri_unvan} onChange={e=>setForm({...form, musteri_unvan:e.target.value})} placeholder="Firma adı" /></div>
              <div><label style={lbl}>Yetkili</label><input value={form.yetkili} onChange={e=>setForm({...form, yetkili:e.target.value})} /></div>
              <div><label style={lbl}>Telefon</label><input value={form.telefon} onChange={e=>setForm({...form, telefon:e.target.value})} /></div>
              <div style={{ gridColumn:'1/3' }}><label style={lbl}>Adres</label><input value={form.adres} onChange={e=>setForm({...form, adres:e.target.value})} placeholder="İlçe / İl" /></div>
              <div><label style={lbl}>Firma Detayı</label><input value={form.firma_detay} onChange={e=>setForm({...form, firma_detay:e.target.value})} placeholder="Mermer üretimi" /></div>
              <div><label style={lbl}>Çalışan Sayısı</label><input type="number" value={form.calisan_sayisi} onChange={e=>setForm({...form, calisan_sayisi:e.target.value})} /></div>
              <div><label style={lbl}>Tehlike Sınıfı</label>
                <select value={form.tehlike_sinifi} onChange={e=>setForm({...form, tehlike_sinifi:e.target.value})}>
                  {TEHLIKE.map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Teklif Tarihi</label><input type="date" value={form.teklif_tarihi} onChange={e=>setForm({...form, teklif_tarihi:e.target.value})} /></div>
              <div style={{ gridColumn:'1/3' }}><label style={lbl}>Teklif İçeriği</label><input value={form.teklif_icerigi} onChange={e=>setForm({...form, teklif_icerigi:e.target.value})} placeholder="İSG Hizmet Bedeli, Sağlık Raporu..." /></div>
              <div><label style={lbl}>İletim Türü</label>
                <select value={form.iletim_turu} onChange={e=>setForm({...form, iletim_turu:e.target.value})}>
                  {ILETIM.map(i=><option key={i}>{i}</option>)}
                </select>
              </div>
              <div><label style={lbl}>Durum</label>
                <select value={form.surec_durumu} onChange={e=>setForm({...form, surec_durumu:e.target.value})}>
                  {DURUMLAR.map(d=><option key={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/3' }}><label style={lbl}>Süreç Notu</label><textarea rows={2} value={form.surec_notu} onChange={e=>setForm({...form, surec_notu:e.target.value})} placeholder="Görüşme notu..." /></div>
              <div style={{ gridColumn:'1/3' }}><label style={lbl}>İletişim Notu</label><textarea rows={2} value={form.iletisim_notu} onChange={e=>setForm({...form, iletisim_notu:e.target.value})} placeholder="27.03.2026 tarihinde arandı..." /></div>
            </div>
            {hata && <div style={{ background:'var(--red-soft)', color:'var(--red)', padding:'10px 14px', borderRadius:8, fontSize:13, marginTop:12 }}>{hata}</div>}
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
