'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, HeartPulse, FileText,
  Wallet, ClipboardList, CalendarDays, Menu, X
} from 'lucide-react'

const LINKS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/firmalar', label: 'Firmalar', icon: Building2 },
  { href: '/saglik', label: 'Sağlık Tarama', icon: HeartPulse },
  { href: '/teklifler', label: 'Satış Teklifleri', icon: FileText },
  { href: '/tahsilat', label: 'Tahsilat', icon: Wallet },
  { href: '/koordinasyon', label: 'İSG Koordinasyon', icon: CalendarDays },
  { href: '/idari', label: 'İdari İşler', icon: ClipboardList },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [acik, setAcik] = useState(false)

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

      {/* MOBİL ÜST BAR */}
      <div className="mobile-bar" style={{ position:'sticky', top:0, zIndex:200, alignItems:'center', gap:12, padding:'14px 18px', background:'rgba(10,10,15,0.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--border)' }}>
        <button onClick={() => setAcik(true)} style={{ background:'none', border:'none', color:'var(--text)', cursor:'pointer', display:'flex' }}><Menu size={22} /></button>
        <span style={{ fontFamily:'Sora, sans-serif', fontWeight:600, fontSize:16 }}>OSGB<span style={{ color:'var(--accent)' }}>.</span></span>
      </div>

      {acik && <div className="overlay" onClick={() => setAcik(false)} />}

      <aside className={`sidebar ${acik ? 'acik' : ''}`}>
        <div style={{ padding:'24px 22px 20px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontFamily:'Sora, sans-serif', fontWeight:700, fontSize:20, letterSpacing:-0.5 }}>
              OSGB<span style={{ color:'var(--accent)' }}>.</span>
            </span>
            <button onClick={() => setAcik(false)} style={{ background:'none', border:'none', color:'var(--text-dim)', cursor:'pointer', display:'none' }} className="kapat"><X size={20} /></button>
          </div>
          <div style={{ fontSize:12, color:'var(--text-faint)', marginTop:4 }}>Operasyon Sistemi</div>
        </div>

        <nav style={{ flex:1, padding:'12px 12px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
          {LINKS.map(l => {
            const aktif = pathname === l.href
            const Icon = l.icon
            return (
              <Link key={l.href} href={l.href} onClick={() => setAcik(false)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:10, textDecoration:'none',
                  background: aktif ? 'var(--accent-soft)' : 'transparent',
                  color: aktif ? 'var(--accent)' : 'var(--text-dim)',
                  fontSize:14, fontWeight: aktif ? 600 : 500, transition:'all .12s' }}>
                <Icon size={18} />
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding:'16px 22px', borderTop:'1px solid var(--border)', fontSize:12, color:'var(--text-faint)' }}>
          2026 · v1.0
        </div>
      </aside>
    </>
  )
}
