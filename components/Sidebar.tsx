'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LayoutDashboard, Building2, HeartPulse, FileText, Wallet, ClipboardList, CalendarDays, Menu, X, LogOut, MapPin, Stethoscope, ChevronRight } from 'lucide-react'

const ROL_AD: any = { yonetici:'Yönetici', operasyon:'Operasyon', hekim:'Hekim', satis:'Satış', muhasebe:'Muhasebe', saha:'Saha Uzmanı' }

const ERISIM: any = {
  yonetici:  ['/','/firmalar','/saglik','/teklifler','/tahsilat','/koordinasyon','/idari','/ziyaretler','/hekim'],
  operasyon: ['/','/firmalar','/koordinasyon','/idari','/ziyaretler'],
  hekim:     ['/','/saglik','/hekim','/koordinasyon'],
  satis:     ['/','/firmalar','/teklifler'],
  muhasebe:  ['/','/tahsilat','/saglik'],
  saha:      ['/','/koordinasyon','/firmalar','/ziyaretler'],
}

const TUM_LINKLER = [
  { href:'/',            label:'Dashboard',        icon:LayoutDashboard },
  { href:'/firmalar',    label:'Firmalar',          icon:Building2 },
  { href:'/saglik',      label:'Sağlık Tarama',     icon:HeartPulse },
  { href:'/hekim',       label:'Hekim Ekranı',      icon:Stethoscope },
  { href:'/teklifler',   label:'Satış Teklifleri',  icon:FileText },
  { href:'/tahsilat',    label:'Tahsilat',           icon:Wallet },
  { href:'/ziyaretler',  label:'İSG Ziyaretleri',   icon:MapPin },
  { href:'/koordinasyon',label:'Koordinasyon',       icon:CalendarDays },
  { href:'/idari',       label:'İdari İşler',        icon:ClipboardList },
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
        setPersonel(p || { ad_soyad: data.user.email, rol: 'operasyon' })
      }
    })
  }, [])

  // Sayfa değişince menüyü kapat
  useEffect(() => { setAcik(false) }, [pathname])

  async function cikis() {
    await createClient().auth.signOut()
    router.push('/giris'); router.refresh()
  }

  const rol = personel?.rol || 'operasyon'
  const izinli = ERISIM[rol] || ERISIM.operasyon
  const linkler = TUM_LINKLER.filter(l => izinli.includes(l.href))
  const aktifSayfa = TUM_LINKLER.find(l => l.href === pathname)

  return (
    <>
      <style>{`
        /* DESKTOP: klasik sidebar */
        .sidebar-desktop {
          width: 232px;
          flex-shrink: 0;
          background: var(--surface);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
        }

        /* MOBİL: sidebar gizli, sadece top bar */
        .mobile-topbar {
          display: none;
        }
        .sidebar-overlay {
          display: none;
        }
        .sidebar-drawer {
          display: none;
        }

        @media (max-width: 768px) {
          .sidebar-desktop { display: none; }

          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 16px;
            height: 56px;
            background: var(--surface);
            border-bottom: 1px solid var(--border);
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .sidebar-overlay {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 200;
          }

          .sidebar-drawer {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            background: var(--surface);
            border-right: 1px solid var(--border);
            z-index: 201;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
          }
          .sidebar-drawer.acik {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="sidebar-desktop">
        <div style={{ padding:'20px 18px 16px', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:19, letterSpacing:-0.5 }}>
            OSGB<span style={{ color:'var(--accent)' }}>.</span>
          </span>
          <div style={{ fontSize:11, color:'var(--text-faint)', marginTop:3 }}>Operasyon Sistemi</div>
        </div>
        <nav style={{ flex:1, padding:'10px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {linkler.map(l => {
            const aktif = pathname === l.href
            const Icon = l.icon
            return (
              <Link key={l.href} href={l.href}
                style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 12px', borderRadius:9, textDecoration:'none',
                  background: aktif ? 'var(--accent-soft)' : 'transparent',
                  color: aktif ? 'var(--accent)' : 'var(--text-dim)',
                  fontSize:13, fontWeight: aktif ? 600 : 500, transition:'all .12s' }}>
                <Icon size={17} /> {l.label}
              </Link>
            )
          })}
        </nav>
        <div style={{ padding:'12px 14px', borderTop:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:9 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'var(--accent-soft)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:13, flexShrink:0 }}>
              {(personel?.ad_soyad||'?').charAt(0).toUpperCase()}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:12, fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{personel?.ad_soyad||'...'}</div>
              <div style={{ fontSize:10, color:'var(--text-faint)' }}>{ROL_AD[rol]}</div>
            </div>
          </div>
          <button onClick={cikis} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:7, background:'var(--surface-2)', border:'1px solid var(--border)', color:'var(--text-dim)', borderRadius:7, padding:'8px', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
            <LogOut size={13} /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* ── MOBİL TOP BAR ── */}
      <div className="mobile-topbar">
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={()=>setAcik(true)} style={{ background:'none', border:'none', color:'var(--text)', cursor:'pointer', display:'flex', padding:4 }}>
            <Menu size={22} />
          </button>
          <span style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:17 }}>
            OSGB<span style={{ color:'var(--accent)' }}>.</span>
          </span>
        </div>
        {aktifSayfa && (
          <span style={{ fontSize:13, color:'var(--text-dim)', fontWeight:500 }}>{aktifSayfa.label}</span>
        )}
        <div style={{ width:32 }} /> {/* boşluk dengesi */}
      </div>

      {/* ── MOBİL DRAWER + OVERLAY ── */}
      {acik && <div className="sidebar-overlay" onClick={()=>setAcik(false)} />}
      <div className={`sidebar-drawer ${acik ? 'acik' : ''}`}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 16px', borderBottom:'1px solid var(--border)' }}>
          <span style={{ fontFamily:'Sora,sans-serif', fontWeight:700, fontSize:18 }}>
            OSGB<span style={{ color:'var(--accent)' }}>.</span>
          </span>
          <button onClick={()=>setAcik(false)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', display:'flex' }}>
            <X size={20} />
          </button>
        </div>

        {/* Kullanıcı */}
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'var(--accent-soft)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:15, flexShrink:0 }}>
            {(personel?.ad_soyad||'?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:14, fontWeight:600 }}>{personel?.ad_soyad||'...'}</div>
            <div style={{ fontSize:11, color:'var(--text-faint)' }}>{ROL_AD[rol]}</div>
          </div>
        </div>

        <nav style={{ flex:1, padding:'10px 10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {linkler.map(l => {
            const aktif = pathname === l.href
            const Icon = l.icon
            return (
              <Link key={l.href} href={l.href}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 14px', borderRadius:10, textDecoration:'none',
                  background: aktif ? 'var(--accent-soft)' : 'transparent',
                  color: aktif ? 'var(--accent)' : 'var(--text-dim)',
                  fontSize:15, fontWeight: aktif ? 600 : 500 }}>
                <Icon size={19} />
                <span style={{ flex:1 }}>{l.label}</span>
                {aktif && <ChevronRight size={15} />}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding:'14px 16px', borderTop:'1px solid var(--border)' }}>
          <button onClick={cikis} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, background:'var(--surface-2)', border:'1px solid var(--border)', color:'var(--text-dim)', borderRadius:9, padding:'11px', fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>
            <LogOut size={15} /> Çıkış Yap
          </button>
        </div>
      </div>
    </>
  )
}
