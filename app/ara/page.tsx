'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { Search, HeartPulse, Building2, FileText, X } from 'lucide-react'

export default function GlobalArama() {
  const [query, setQuery] = useState('')
  const [hastalar, setHastalar] = useState<any[]>([])
  const [firmalar, setFirmalar] = useState<any[]>([])
  const [teklifler, setTeklifler] = useState<any[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [aramaDone, setAramaDone] = useState(false)
  const debounceRef = useRef<any>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sb = createClient()

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query || query.trim().length < 2) {
      setHastalar([]); setFirmalar([]); setTeklifler([]); setAramaDone(false)
      return
    }
    debounceRef.current = setTimeout(() => ara(query.trim()), 350)
    return () => clearTimeout(debounceRef.current)
  }, [query])

  async function ara(q: string) {
    setYukleniyor(true)
    const [hRes, fRes, tRes] = await Promise.all([
      sb.from('hasta_kayitlari')
        .select('id, tarih, ad_soyad, dogum_tarihi, firma, ucret, odeme_sekli')
        .or(`ad_soyad.ilike.%${q}%,firma.ilike.%${q}%,telefon.ilike.%${q}%`)
        .order('tarih', { ascending: false })
        .limit(20),
      sb.from('firmalar')
        .select('id, unvan, tehlike_sinifi, bolge, sgk_sicil, yetkili, telefon')
        .ilike('unvan', `%${q}%`)
        .eq('aktif', true)
        .limit(10),
      sb.from('teklifler')
        .select('id, musteri_unvan, surec_durumu, tur, teklif_tarihi')
        .ilike('musteri_unvan', `%${q}%`)
        .limit(10),
    ])
    setHastalar(hRes.data || [])
    setFirmalar(fRes.data || [])
    setTeklifler(tRes.data || [])
    setAramaDone(true)
    setYukleniyor(false)
  }

  const tl = (n: number) => new Intl.NumberFormat('tr-TR').format(n) + ' ₺'
  const toplamSonuc = hastalar.length + firmalar.length + teklifler.length
  const DURUM_RENK: any = { Beklemede: 'var(--amber)', Görüşülüyor: 'var(--blue)', Olumlu: 'var(--green)', Olumsuz: 'var(--red)' }
  const TEHLIKE_RENK: any = { 'Az Tehlikeli': 'var(--green)', 'Tehlikeli': 'var(--amber)', 'Çok Tehlikeli': 'var(--red)' }

  return (
    <div className="page-wrap" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Sora,sans-serif', fontSize: 28, fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>
        Global Arama
      </h1>

      {/* Arama kutusu */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={20} style={{ position: 'absolute', left: 16, top: 14, color: 'var(--text-faint)' }} />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Hasta adı, firma, telefon ara..."
          style={{ width: '100%', paddingLeft: 48, paddingRight: 40, fontSize: 16, height: 48, borderRadius: 12 }}
        />
        {query && (
          <button onClick={() => setQuery('')}
            style={{ position: 'absolute', right: 12, top: 13, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-faint)', padding: 2 }}>
            <X size={18} />
          </button>
        )}
      </div>

      {yukleniyor && (
        <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: 40 }}>Aranıyor...</div>
      )}

      {!yukleniyor && aramaDone && toplamSonuc === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: 40 }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.3 }}>🔍</div>
          <div>"{query}" için sonuç bulunamadı</div>
        </div>
      )}

      {!yukleniyor && !aramaDone && (
        <div style={{ textAlign: 'center', color: 'var(--text-faint)', padding: 40, fontSize: 14 }}>
          En az 2 karakter yazın
        </div>
      )}

      {/* HASTALAR */}
      {hastalar.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <HeartPulse size={16} color="var(--green)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Hasta Kayıtları ({hastalar.length})
            </span>
          </div>
          <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
            {hastalar.map((h, i) => (
              <div key={h.id} style={{
                padding: '12px 16px',
                borderBottom: i < hastalar.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{h.ad_soyad}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                    {h.firma || '—'} · {h.tarih ? new Date(h.tarih + 'T00:00:00').toLocaleDateString('tr-TR') : '—'}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{tl(Number(h.ucret) || 0)}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{h.odeme_sekli}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FİRMALAR */}
      {firmalar.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Building2 size={16} color="var(--accent)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Firmalar ({firmalar.length})
            </span>
          </div>
          <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
            {firmalar.map((f, i) => (
              <div key={f.id} style={{
                padding: '12px 16px',
                borderBottom: i < firmalar.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{f.unvan}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                      {[f.bolge, f.yetkili, f.telefon].filter(Boolean).join(' · ')}
                    </div>
                    {f.sgk_sicil && (
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 2, fontFamily: 'monospace' }}>
                        {f.sgk_sicil}
                      </div>
                    )}
                  </div>
                  {f.tehlike_sinifi && (
                    <span style={{ fontSize: 11, background: `${TEHLIKE_RENK[f.tehlike_sinifi]}22`, color: TEHLIKE_RENK[f.tehlike_sinifi], padding: '2px 8px', borderRadius: 5, flexShrink: 0 }}>
                      {f.tehlike_sinifi}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TEKLİFLER */}
      {teklifler.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <FileText size={16} color="var(--amber)" />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Teklifler ({teklifler.length})
            </span>
          </div>
          <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
            {teklifler.map((t, i) => (
              <div key={t.id} style={{
                padding: '12px 16px',
                borderBottom: i < teklifler.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.musteri_unvan}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 2 }}>
                    {t.tur} · {t.teklif_tarihi ? new Date(t.teklif_tarihi + 'T00:00:00').toLocaleDateString('tr-TR') : '—'}
                  </div>
                </div>
                <span style={{ fontSize: 11, background: `${DURUM_RENK[t.surec_durumu]}22`, color: DURUM_RENK[t.surec_durumu], padding: '2px 8px', borderRadius: 5 }}>
                  {t.surec_durumu}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
