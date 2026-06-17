'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import MobileTopbar from './MobileTopbar'

const PANEL_PATHS = [
  '/dashboard', '/firmalar', '/ara', '/saglik', '/teklifler', '/tahsilat',
  '/koordinasyon', '/idari', '/ziyaretler', '/hekim', '/malzemeler',
  '/tedarikciler', '/taramalar', '/personeller', '/raporlar', '/fatura',
  '/eksik-veriler', '/arsiv', '/site',
]

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  // Sadece panel sayfaları sidebar ile açılır, geri kalan her şey (public + 404) direkt açılır
  const isPanel = PANEL_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  if (!isPanel) return <>{children}</>
  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar />
      <main style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        <MobileTopbar />
        {children}
      </main>
    </div>
  )
}
