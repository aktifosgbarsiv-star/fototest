'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LayoutDashboard, Building2, HeartPulse, FileText, Wallet, ClipboardList, CalendarDays, Menu, X, LogOut, MapPin, Stethoscope } from 'lucide-react'

const ROL_AD: any = { yonetici:'Yönetici', operasyon:'Operasyon', hekim:'Hekim', satis:'Satış', muhasebe:'Muhasebe', saha:'Saha Uzmanı' }

const ERISIM: any = {
  yonetici: ['/','/firmalar','/saglik','/teklifler','/tahsilat','/koordinasyon','/idari','/ziyaretler','/hekim'],
  operasyon: ['/','/firmalar','/koordinasyon','/idari','/ziyaretler'],
  hekim:     ['/','/saglik','/hekim','/koordinasyon'],
  satis:     ['/','/firmalar','/teklifler'],
  muhasebe:  ['/','/tahsilat','/saglik'],
  saha:      ['/','/koordinasyon','/firmalar','/ziyaretler'],
}

const TUM_LINKLER = [
  { href:'/',           label:'Dashboard',       icon:LayoutDashboard },
  { href:'/firmalar',   label:'Firmalar',         icon:Building2 },
  { href:'/saglik',     label:'Sağlık Tarama',    icon:HeartPulse },
  { href:'/hekim',      label:'Hekim Ekranı',     icon:Stethoscope },
  { href:'/teklifler',  label:'Satış Teklifleri', icon:FileText },
  { href:'/tahsilat',   label:'Tahsilat',         icon:Wallet },
  { href:'/ziyaretler', label:'İSG Ziyaretleri',  icon:MapPin },
  { href:'/koordinasyon',label:'Koordinasyon',    icon:CalendarDays },
  { href:'/idari',      label:'İdari İşler',      icon:ClipboardList },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [acik, setAcik] = useState(false)
  const [personel, setPersonel] = useState<any>(null)

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        const { data: p } = await sb.from('personeller').select('*').eq('id', data.user.id).single()
        setPersonel(p || { ad_soyad: data.user.email, rol: 'operasyon' }) // güvenli default: operasyon
      }
    })
  }, [])

  async function cikis() {
    await createClient().auth.signOut()
    router.push('/giris'); router.refresh()
  }

  const rol = personel?.rol || 'operasyon'
  const izinli = ERISIM[rol] || ERISIM.operasyon
  const linkler = TUM_LINKLER.filter(l => izinli.includes(l.href))

  return (
    <>
      <style>{`
        .sidebar { width:248px; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; position:sticky; top:0; height:100vh; flex-shrink:0; }
        .mobile-bar { display:none; }
        @media (max-width:880px) {
          .sidebar { position:fixed; left:0; top:0; z-index:300; transform:translateX(-100%); transition:transform .25s; }
          .sidebar.acik { transform:translateX(0); }
          .mobile-bar { display:flex; }
          .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:299; }
        }
      `}</style>

      <div className="mobile-bar" style={{ position:'sticky', top:0, zIndex:200, alignItems:'center', gap:12, padding:'14px 18px', background:'rgba(10,10,15,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)' }}>
        <button onClick={()=>setAcik(true)} style={{ background:'none', border:'none', color:'var(--text)', cursor:'pointer', display:'flex' }}><Menu size={22} /></button>
        <span style={{ fontFamily:'Sora, sans-serif', fontWeight:600, fontSize:16 }}>OSGB<span style={{ color:'var(--accent)' }}>.</span></span>
      </div>

      {acik && <div className="overlay" onClick={()=>setAcik(false)} />}

      <aside className={`sidebar ${acik ? 'acik' : ''}`}>
        <div style={{ padding:'24px 22px 20px', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontFamily:'Sora, sans-serif', fontWeight:700, fontSize:20, letterSpacing:-0.5 }}>OSGB<span style={{ color:'var(--accent)' }}>.</span></span>
          <div style={{ fontSize:12, color:'var(--text-faint)', marginTop:4 }}>Operasyon Sistemi</div>
        </div>

        <nav style={{ flex:1, padding:'12px 12px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {linkler.map(l => {
            const aktif = pathname === l.href
            const Icon = l.icon
            return (
              <Link key={l.href} href={l.href} onClick={()=>setAcik(false)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:10, textDecoration:'none',
                  background: aktif ? 'var(--accent-soft)' : 'transparent',
                  color: aktif ? 'var(--accent)' : 'var(--text-dim)',
                  fontSize:14, fontWeight: aktif ? 600 : 500, transition:'all .12s' }}>
                <Icon size={18} /> {l.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding:'14px 16px', borderTop:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'var(--accent-soft)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:14, flexShrink:0 }}>
              {(personel?.ad_soyad || '?').charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{personel?.ad_soyad || '...'}</div>
              <div style={{ fontSize:11, color:'var(--text-faint)' }}>{ROL_AD[rol]}</div>
            </div>
          </div>
          <button onClick={cikis} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'var(--surface-2)', border:'1px solid var(--border)', color:'var(--text-dim)', borderRadius:8, padding:'9px', fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
            <LogOut size={15} /> Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  )
}
