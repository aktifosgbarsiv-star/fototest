'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Globe, Settings, Layers, Users, Award, FileText, MessageSquare, ExternalLink, Plus, Trash2, Pencil, X, Check } from 'lucide-react'

const SEKMELER = [
  { id: 'ayarlar', label: 'Genel Ayarlar', icon: Settings },
  { id: 'hizmetler', label: 'Hizmetler', icon: Layers },
  { id: 'egitimler', label: 'Eğitimler', icon: Award },
  { id: 'ekip', label: 'Ekip', icon: Users },
  { id: 'referanslar', label: 'Referanslar', icon: Globe },
  { id: 'yazilar', label: 'Yazılar', icon: FileText },
  { id: 'talepler', label: 'Teklif Talepleri', icon: MessageSquare },
]

export default function SiteYonetim() {
  const [sekme, setSekme] = useState('ayarlar')
  const [ayarlar, setAyarlar] = useState<Record<string,string>>({})
  const [hizmetler, setHizmetler] = useState<any[]>([])
  const [egitimler, setEgitimler] = useState<any[]>([])
  const [ekip, setEkip] = useState<any[]>([])
  const [referanslar, setReferanslar] = useState<any[]>([])
  const [yazilar, setYazilar] = useState<any[]>([])
  const [talepler, setTalepler] = useState<any[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [modal, setModal] = useState<any>(null)
  const [form, setForm] = useState<any>({})
  const sb = createClient()

  useEffect(() => { yukle() }, [sekme])

  async function yukle() {
    setYukleniyor(true)
    if (sekme === 'ayarlar') {
      const { data } = await sb.from('site_ayarlar').select('*')
      const a: Record<string,string> = {}
      ;(data||[]).forEach((r:any) => { a[r.anahtar]=r.deger })
      setAyarlar(a)
    } else if (sekme === 'hizmetler') {
      const { data } = await sb.from('site_hizmetler').select('*').order('sira')
      setHizmetler(data||[])
    } else if (sekme === 'egitimler') {
      const { data } = await sb.from('site_egitimler').select('*').order('sira')
      setEgitimler(data||[])
    } else if (sekme === 'ekip') {
      const { data } = await sb.from('site_ekip').select('*').order('sira')
      setEkip(data||[])
    } else if (sekme === 'referanslar') {
      const { data } = await sb.from('site_referanslar').select('*').order('sira')
      setReferanslar(data||[])
    } else if (sekme === 'yazilar') {
      const { data } = await sb.from('site_yazilar').select('*').order('olusturuldu_at', { ascending: false })
      setYazilar(data||[])
    } else if (sekme === 'talepler') {
      const { data } = await sb.from('site_teklif_talepleri').select('*').order('olusturuldu_at', { ascending: false })
      setTalepler(data||[])
    }
    setYukleniyor(false)
  }

  async function ayarKaydet() {
    setKaydediliyor(true)
    const updates = Object.entries(ayarlar).map(([anahtar, deger]) => ({ anahtar, deger }))
    for (const u of updates) {
      await sb.from('site_ayarlar').upsert(u, { onConflict: 'anahtar' })
    }
    setKaydediliyor(false)
  }

  async function sil(tablo: string, id: string) {
    if (!confirm('Silmek istediğinize emin misiniz?')) return
    await sb.from(tablo).delete().eq('id', id)
    yukle()
  }

  async function kaydet(tablo: string) {
    if (form.id) {
      await sb.from(tablo).update(form).eq('id', form.id)
    } else {
      await sb.from(tablo).insert(form)
    }
    setModal(null); setForm({})
    yukle()
  }

  async function talepDurumGuncelle(id: string, durum: string) {
    await sb.from('site_teklif_talepleri').update({ durum }).eq('id', id)
    yukle()
  }

  const card: any = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }
  const inp: any = { width:'100%', marginBottom:14 }
  const lbl = (t: string) => <label style={{ display:'block', fontSize:12, fontWeight:600, color:'var(--text-faint)', textTransform:'uppercase', letterSpacing:.5, marginBottom:6 }}>{t}</label>

  return (
    <div className="page-wrap fade-in">
      {/* Başlık */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h1 className="page-title" style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Globe size={24} color="var(--accent)" /> Web Sitesi Yönetimi
          </h1>
          <p className="page-sub">Tanıtım sitesinin içeriklerini buradan düzenleyebilirsiniz.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--accent)', textDecoration:'none' }}>
          <ExternalLink size={14} /> Siteyi Görüntüle
        </a>
      </div>

      {/* Sekmeler */}
      <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:24, background:'var(--surface)', padding:6, borderRadius:12, border:'1px solid var(--border)' }}>
        {SEKMELER.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setSekme(id)} style={{
            display:'flex', alignItems:'center', gap:6,
            padding:'8px 16px', borderRadius:8, border:'none', cursor:'pointer',
            background: sekme===id ? 'var(--accent)' : 'transparent',
            color: sekme===id ? '#fff' : 'var(--text-dim)',
            fontSize:13, fontWeight:500, fontFamily:'inherit',
          }}>
            <Icon size={14} />{label}
            {id==='talepler' && talepler.filter(t=>t.durum==='Yeni').length > 0 && (
              <span style={{ background:'var(--red)', color:'#fff', borderRadius:100, padding:'1px 6px', fontSize:10, fontWeight:700 }}>
                {talepler.filter(t=>t.durum==='Yeni').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {yukleniyor ? (
        <div style={{ textAlign:'center', padding:60, color:'var(--text-faint)' }}>Yükleniyor...</div>
      ) : (

        <>
        {/* AYARLAR */}
        {sekme === 'ayarlar' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:20, color:'var(--text)' }}>Genel Bilgiler</h3>
              {[['sirket_adi','Şirket Adı'],['slogan','Slogan'],['aciklama','Açıklama']].map(([k,l]) => (
                <div key={k} style={{ marginBottom:14 }}>
                  {lbl(l)}
                  <input value={ayarlar[k]||''} onChange={e=>setAyarlar({...ayarlar,[k]:e.target.value})} />
                </div>
              ))}
              <h3 style={{ fontSize:15, fontWeight:700, margin:'20px 0 14px', color:'var(--text)' }}>İstatistikler</h3>
              {[['stat_kurum','Kurum Sayısı'],['stat_yil','Yıllık Deneyim'],['stat_egitim','Eğitim Sayısı']].map(([k,l]) => (
                <div key={k} style={{ marginBottom:14 }}>
                  {lbl(l)}
                  <input value={ayarlar[k]||''} onChange={e=>setAyarlar({...ayarlar,[k]:e.target.value})} />
                </div>
              ))}
            </div>
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:20, color:'var(--text)' }}>İletişim Bilgileri</h3>
              {[['telefon_1','Telefon 1'],['telefon_2','Telefon 2'],['email','E-Posta'],['adres','Adres'],['calisma_saatleri','Çalışma Saatleri']].map(([k,l]) => (
                <div key={k} style={{ marginBottom:14 }}>
                  {lbl(l)}
                  <input value={ayarlar[k]||''} onChange={e=>setAyarlar({...ayarlar,[k]:e.target.value})} />
                </div>
              ))}
              <h3 style={{ fontSize:15, fontWeight:700, margin:'20px 0 14px', color:'var(--text)' }}>Sosyal Medya</h3>
              {[['facebook','Facebook URL'],['instagram','Instagram URL'],['whatsapp','WhatsApp Link']].map(([k,l]) => (
                <div key={k} style={{ marginBottom:14 }}>
                  {lbl(l)}
                  <input value={ayarlar[k]||''} onChange={e=>setAyarlar({...ayarlar,[k]:e.target.value})} />
                </div>
              ))}
            </div>
            <div style={{ gridColumn:'1/-1' }}>
              <button className="btn" onClick={ayarKaydet} disabled={kaydediliyor}>
                <Check size={16} />{kaydediliyor ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
              </button>
            </div>
          </div>
        )}

        {/* HİZMETLER */}
        {sekme === 'hizmetler' && (
          <div>
            <button className="btn" style={{ marginBottom:20 }} onClick={() => { setForm({ ikon:'🛡️', sira: hizmetler.length+1, aktif:true }); setModal('hizmet') }}>
              <Plus size={16} /> Yeni Hizmet
            </button>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {hizmetler.map(h => (
                <div key={h.id} style={card}>
                  <div style={{ display:'flex', alignItems:'center', gap:14, flex:1 }}>
                    <span style={{ fontSize:24 }}>{h.ikon}</span>
                    <div>
                      <div style={{ fontWeight:600, color:'var(--text)', fontSize:14 }}>{h.baslik}</div>
                      <div style={{ fontSize:12, color:'var(--text-faint)', marginTop:2 }}>{h.aciklama?.slice(0,60)}...</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px' }} onClick={() => { setForm(h); setModal('hizmet') }}><Pencil size={14}/></button>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px', color:'var(--red)' }} onClick={() => sil('site_hizmetler', h.id)}><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EĞİTİMLER */}
        {sekme === 'egitimler' && (
          <div>
            <button className="btn" style={{ marginBottom:20 }} onClick={() => { setForm({ sertifika:true, sira: egitimler.length+1, aktif:true }); setModal('egitim') }}>
              <Plus size={16} /> Yeni Eğitim
            </button>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {egitimler.map(e => (
                <div key={e.id} style={card}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, color:'var(--text)', fontSize:14 }}>{e.baslik}</div>
                    <div style={{ fontSize:12, color:'var(--text-faint)', marginTop:2 }}>{e.sure} {e.sertifika ? '· Sertifikalı' : ''}</div>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px' }} onClick={() => { setForm(e); setModal('egitim') }}><Pencil size={14}/></button>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px', color:'var(--red)' }} onClick={() => sil('site_egitimler', e.id)}><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EKİP */}
        {sekme === 'ekip' && (
          <div>
            <button className="btn" style={{ marginBottom:20 }} onClick={() => { setForm({ aktif:true, sira: ekip.length+1 }); setModal('ekip') }}>
              <Plus size={16} /> Yeni Üye
            </button>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
              {ekip.map(u => (
                <div key={u.id} className="card" style={{ padding:20, textAlign:'center' }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background:'rgba(99,102,241,.15)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:20, fontWeight:800, color:'var(--accent)' }}>
                    {u.ad_soyad?.charAt(0)}
                  </div>
                  <div style={{ fontWeight:700, color:'var(--text)', marginBottom:4 }}>{u.ad_soyad}</div>
                  <div style={{ fontSize:12, color:'var(--accent)', marginBottom:12 }}>{u.unvan}</div>
                  <div style={{ display:'flex', gap:6, justifyContent:'center' }}>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px' }} onClick={() => { setForm(u); setModal('ekip') }}><Pencil size={14}/></button>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px', color:'var(--red)' }} onClick={() => sil('site_ekip', u.id)}><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REFERANSLAR */}
        {sekme === 'referanslar' && (
          <div>
            <button className="btn" style={{ marginBottom:20 }} onClick={() => { setForm({ aktif:true, sira: referanslar.length+1 }); setModal('referans') }}>
              <Plus size={16} /> Yeni Referans
            </button>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
              {referanslar.map(r => (
                <div key={r.id} className="card" style={{ padding:'16px 20px' }}>
                  <div style={{ fontWeight:600, color:'var(--text)', marginBottom:4 }}>{r.firma_adi}</div>
                  <div style={{ fontSize:12, color:'var(--text-faint)' }}>{r.sektor}</div>
                  <div style={{ display:'flex', gap:6, marginTop:12 }}>
                    <button className="btn btn-ghost" style={{ padding:'5px 10px', fontSize:12 }} onClick={() => { setForm(r); setModal('referans') }}><Pencil size={12}/></button>
                    <button className="btn btn-ghost" style={{ padding:'5px 10px', fontSize:12, color:'var(--red)' }} onClick={() => sil('site_referanslar', r.id)}><Trash2 size={12}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YAZILAR */}
        {sekme === 'yazilar' && (
          <div>
            <button className="btn" style={{ marginBottom:20 }} onClick={() => { setForm({ yayinda:false, yazar:'Admin' }); setModal('yazi') }}>
              <Plus size={16} /> Yeni Yazı
            </button>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {yazilar.map(y => (
                <div key={y.id} style={card}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, color:'var(--text)', fontSize:14 }}>{y.baslik}</div>
                    <div style={{ fontSize:12, color:'var(--text-faint)', marginTop:2 }}>{y.yazar} · {y.yayinda ? '🟢 Yayında' : '⚪ Taslak'}</div>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px' }} onClick={() => { setForm(y); setModal('yazi') }}><Pencil size={14}/></button>
                    <button className="btn btn-ghost" style={{ padding:'6px 12px', color:'var(--red)' }} onClick={() => sil('site_yazilar', y.id)}><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TALEPLER */}
        {sekme === 'talepler' && (
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Ad Soyad</th><th>Telefon</th><th>Firma</th><th>Hizmet</th><th>Tehlike Sınıfı</th><th>Tarih</th><th>Durum</th>
                </tr>
              </thead>
              <tbody>
                {talepler.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight:600 }}>{t.ad_soyad}</td>
                    <td>{t.telefon}</td>
                    <td>{t.firma_adi}</td>
                    <td>{t.hizmet_turu}</td>
                    <td>{t.tehlike_sinifi}</td>
                    <td style={{ fontSize:12, color:'var(--text-faint)' }}>{new Date(t.olusturuldu_at).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <select value={t.durum} onChange={e=>talepDurumGuncelle(t.id,e.target.value)} style={{ background:'var(--surface-2)', border:'1px solid var(--border)', borderRadius:6, padding:'4px 8px', color:'var(--text)', fontSize:12 }}>
                        <option>Yeni</option><option>İnceleniyor</option><option>Teklif Gönderildi</option><option>Kapatıldı</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </>
      )}

      {/* MODALLER */}
      {modal && (
        <div className="modal-overlay" onClick={e => { if (e.target===e.currentTarget) { setModal(null); setForm({}) } }}>
          <div className="modal-content">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
              <h3 style={{ fontWeight:700, color:'var(--text)' }}>
                {modal==='hizmet' ? 'Hizmet' : modal==='egitim' ? 'Eğitim' : modal==='ekip' ? 'Ekip Üyesi' : modal==='referans' ? 'Referans' : 'Yazı'} {form.id ? 'Düzenle' : 'Ekle'}
              </h3>
              <button style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer' }} onClick={() => { setModal(null); setForm({}) }}><X size={20}/></button>
            </div>

            {modal === 'hizmet' && (
              <div className="modal-grid">
                <div style={{ gridColumn:'1/-1' }}>{lbl('İkon (emoji)')}<input style={inp} value={form.ikon||''} onChange={e=>setForm({...form,ikon:e.target.value})} /></div>
                <div style={{ gridColumn:'1/-1' }}>{lbl('Başlık')}<input style={inp} value={form.baslik||''} onChange={e=>setForm({...form,baslik:e.target.value})} /></div>
                <div style={{ gridColumn:'1/-1' }}>{lbl('Açıklama')}<textarea value={form.aciklama||''} onChange={e=>setForm({...form,aciklama:e.target.value})} /></div>
                <div style={{ gridColumn:'1/-1' }}>{lbl('Etiketler (· ile ayırın)')}<input style={inp} value={form.etiketler||''} onChange={e=>setForm({...form,etiketler:e.target.value})} /></div>
                <div>{lbl('Sıra')}<input type="number" style={inp} value={form.sira||0} onChange={e=>setForm({...form,sira:+e.target.value})} /></div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:20 }}>
                  <input type="checkbox" checked={!!form.aktif} onChange={e=>setForm({...form,aktif:e.target.checked})} />
                  <label style={{ color:'var(--text-dim)', fontSize:13 }}>Aktif</label>
                </div>
              </div>
            )}

            {modal === 'egitim' && (
              <div className="modal-grid">
                <div style={{ gridColumn:'1/-1' }}>{lbl('Başlık')}<input style={inp} value={form.baslik||''} onChange={e=>setForm({...form,baslik:e.target.value})} /></div>
                <div style={{ gridColumn:'1/-1' }}>{lbl('Açıklama')}<textarea value={form.aciklama||''} onChange={e=>setForm({...form,aciklama:e.target.value})} /></div>
                <div>{lbl('Süre (örn: 8 Saat)')}<input style={inp} value={form.sure||''} onChange={e=>setForm({...form,sure:e.target.value})} /></div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:20 }}>
                  <input type="checkbox" checked={!!form.sertifika} onChange={e=>setForm({...form,sertifika:e.target.checked})} />
                  <label style={{ color:'var(--text-dim)', fontSize:13 }}>Sertifikalı</label>
                </div>
              </div>
            )}

            {modal === 'ekip' && (
              <div className="modal-grid">
                <div style={{ gridColumn:'1/-1' }}>{lbl('Ad Soyad')}<input style={inp} value={form.ad_soyad||''} onChange={e=>setForm({...form,ad_soyad:e.target.value})} /></div>
                <div>{lbl('Ünvan')}<input style={inp} value={form.unvan||''} onChange={e=>setForm({...form,unvan:e.target.value})} /></div>
                <div>{lbl('Uzmanlık')}<input style={inp} value={form.uzmanlik||''} onChange={e=>setForm({...form,uzmanlik:e.target.value})} /></div>
              </div>
            )}

            {modal === 'referans' && (
              <div className="modal-grid">
                <div style={{ gridColumn:'1/-1' }}>{lbl('Firma Adı')}<input style={inp} value={form.firma_adi||''} onChange={e=>setForm({...form,firma_adi:e.target.value})} /></div>
                <div style={{ gridColumn:'1/-1' }}>{lbl('Sektör')}<input style={inp} value={form.sektor||''} onChange={e=>setForm({...form,sektor:e.target.value})} /></div>
              </div>
            )}

            {modal === 'yazi' && (
              <div className="modal-grid">
                <div style={{ gridColumn:'1/-1' }}>{lbl('Başlık')}<input style={inp} value={form.baslik||''} onChange={e=>setForm({...form,baslik:e.target.value})} /></div>
                <div style={{ gridColumn:'1/-1' }}>{lbl('Özet')}<textarea value={form.ozet||''} onChange={e=>setForm({...form,ozet:e.target.value})} /></div>
                <div>{lbl('Yazar')}<input style={inp} value={form.yazar||'Admin'} onChange={e=>setForm({...form,yazar:e.target.value})} /></div>
                <div>{lbl('Yayın Tarihi')}<input type="date" style={inp} value={form.yayinlandi_at?.slice(0,10)||''} onChange={e=>setForm({...form,yayinlandi_at:e.target.value})} /></div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <input type="checkbox" checked={!!form.yayinda} onChange={e=>setForm({...form,yayinda:e.target.checked})} />
                  <label style={{ color:'var(--text-dim)', fontSize:13 }}>Yayında</label>
                </div>
              </div>
            )}

            <div style={{ marginTop:24, display:'flex', gap:10 }}>
              <button className="btn" onClick={() => kaydet(
                modal==='hizmet' ? 'site_hizmetler' :
                modal==='egitim' ? 'site_egitimler' :
                modal==='ekip' ? 'site_ekip' :
                modal==='referans' ? 'site_referanslar' : 'site_yazilar'
              )}>
                <Check size={16} /> Kaydet
              </button>
              <button className="btn btn-ghost" onClick={() => { setModal(null); setForm({}) }}>İptal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
