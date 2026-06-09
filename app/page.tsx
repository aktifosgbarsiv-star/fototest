'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Building2, HeartPulse, FileText, Wallet, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, BarChart, Bar, Cell } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState<any>({ firma:0, hasta:0, teklif:0, acikBakiye:0, vadeGecen:0, aylikCiro:0 })
  const [ciroData, setCiroData] = useState<any[]>([])
  const [vadeData, setVadeData] = useState<any[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    const sb = createClient()
    async function yukle() {
      const [firma, hasta, teklif, cariler] = await Promise.all([
        sb.from('firmalar').select('id', { count:'exact', head:true }),
        sb.from('hasta_kayitlari').select('ucret, tarih'),
        sb.from('teklifler').select('id, surec_durumu'),
        sb.from('cariler').select('unvan, acik_bakiye, vadesi_gecen_tutar, gecen_gun_sayisi'),
      ])

      const hastaList = hasta.data || []
      const aylikCiro = hastaList.reduce((s:number,h:any)=>s+(Number(h.ucret)||0),0)
      const acikBakiye = (cariler.data||[]).reduce((s:number,c:any)=>s+(Number(c.acik_bakiye)||0),0)
      const vadeGecen = (cariler.data||[]).reduce((s:number,c:any)=>s+(Number(c.vadesi_gecen_tutar)||0),0)

      setStats({
        firma: firma.count||0,
        hasta: hastaList.length,
        teklif: (teklif.data||[]).filter((t:any)=>t.surec_durumu==='Beklemede').length,
        acikBakiye, vadeGecen, aylikCiro
      })

      // Aylık ciro grafiği (hasta kayıtlarından)
      const aylar: Record<string, number> = {}
      hastaList.forEach((h:any) => {
        if (!h.tarih) return
        const ay = new Date(h.tarih).toLocaleDateString('tr-TR', { month:'short' })
        aylar[ay] = (aylar[ay]||0) + (Number(h.ucret)||0)
      })
      setCiroData(Object.entries(aylar).map(([ay,tutar])=>({ ay, tutar })))

      // En riskli cariler
      const riskli = (cariler.data||[])
        .filter((c:any)=>c.vadesi_gecen_tutar>0)
        .sort((a:any,b:any)=>b.vadesi_gecen_tutar-a.vadesi_gecen_tutar)
        .slice(0,5)
        .map((c:any)=>({ isim: c.unvan?.slice(0,16), tutar: Number(c.vadesi_gecen_tutar), gun: c.gecen_gun_sayisi }))
      setVadeData(riskli)
      setYukleniyor(false)
    }
    yukle()
  }, [])

  const tl = (n:number) => new Intl.NumberFormat('tr-TR', { maximumFractionDigits:0 }).format(n) + ' ₺'

  const kartlar = [
    { label:'Kayıtlı Firma', val: stats.firma, icon: Building2, renk:'var(--blue)', soft:'var(--blue-soft)', href:'/firmalar' },
    { label:'Hasta Kaydı', val: stats.hasta, icon: HeartPulse, renk:'var(--green)', soft:'var(--green-soft)', href:'/saglik' },
    { label:'Bekleyen Teklif', val: stats.teklif, icon: FileText, renk:'var(--amber)', soft:'var(--amber-soft)', href:'/teklifler' },
    { label:'Açık Bakiye', val: tl(stats.acikBakiye), icon: Wallet, renk:'var(--accent)', soft:'var(--accent-soft)', href:'/tahsilat' },
  ]

  return (
    <div style={{ padding:'32px 28px', maxWidth:1400, margin:'0 auto' }} className="fade-in">
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:'Sora, sans-serif', fontSize:28, fontWeight:700, letterSpacing:-0.5 }}>Genel Bakış</h1>
        <p style={{ color:'var(--text-dim)', fontSize:14, marginTop:4 }}>
          {new Date().toLocaleDateString('tr-TR', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
        </p>
      </div>

      {/* METRİK KARTLARI */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16, marginBottom:24 }}>
        {kartlar.map((k,i) => {
          const Icon = k.icon
          return (
            <Link key={k.label} href={k.href} className="card" style={{ padding:22, textDecoration:'none', color:'inherit', position:'relative', overflow:'hidden', animationDelay:`${i*60}ms` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:k.soft, display:'flex', alignItems:'center', justifyContent:'center', color:k.renk }}>
                  <Icon size={21} />
                </div>
                <ArrowUpRight size={18} color="var(--text-faint)" />
              </div>
              <div style={{ fontFamily:'Sora, sans-serif', fontSize:26, fontWeight:700, letterSpacing:-0.5 }}>
                {yukleniyor ? '—' : k.val}
              </div>
              <div style={{ fontSize:13, color:'var(--text-dim)', marginTop:2 }}>{k.label}</div>
            </Link>
          )
        })}
      </div>

      {/* UYARI: VADESİ GEÇEN */}
      {stats.vadeGecen > 0 && (
        <Link href="/tahsilat" className="card" style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', marginBottom:24, textDecoration:'none', color:'inherit', borderColor:'rgba(248,113,113,0.25)', background:'var(--red-soft)' }}>
          <AlertTriangle size={20} color="var(--red)" />
          <div style={{ flex:1 }}>
            <span style={{ fontWeight:600, color:'var(--red)' }}>{tl(stats.vadeGecen)}</span>
            <span style={{ color:'var(--text-dim)', marginLeft:8, fontSize:14 }}>vadesi geçmiş tahsilat var</span>
          </div>
          <ArrowUpRight size={18} color="var(--red)" />
        </Link>
      )}

      {/* GRAFİKLER */}
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16 }} className="grid-resp">
        <style>{`@media(max-width:880px){.grid-resp{grid-template-columns:1fr !important;}}`}</style>

        <div className="card" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h3 style={{ fontFamily:'Sora, sans-serif', fontSize:16, fontWeight:600 }}>Aylık Sağlık Geliri</h3>
            <TrendingUp size={18} color="var(--green)" />
          </div>
          <div style={{ height:240 }}>
            {ciroData.length === 0 ? (
              <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-faint)', fontSize:14 }}>Henüz veri yok</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ciroData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="ay" stroke="#5d5d6b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background:'#1a1a24', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:13 }} labelStyle={{ color:'#9b9ba8' }} formatter={(v:any)=>[tl(v),'Gelir']} />
                  <Area type="monotone" dataKey="tutar" stroke="#6366f1" strokeWidth={2} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="card" style={{ padding:24 }}>
          <h3 style={{ fontFamily:'Sora, sans-serif', fontSize:16, fontWeight:600, marginBottom:20 }}>En Riskli Cariler</h3>
          <div style={{ height:240 }}>
            {vadeData.length === 0 ? (
              <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-faint)', fontSize:14 }}>Risk yok</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vadeData} layout="vertical" margin={{ left:0, right:8 }}>
                  <XAxis type="number" hide />
                  <Tooltip contentStyle={{ background:'#1a1a24', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, fontSize:13 }} formatter={(v:any)=>[tl(v),'Vade Aşımı']} cursor={{ fill:'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="tutar" radius={[0,6,6,0]} barSize={22}>
                    {vadeData.map((d,i)=>(
                      <Cell key={i} fill={d.gun > 90 ? '#f87171' : d.gun > 30 ? '#fbbf24' : '#60a5fa'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
