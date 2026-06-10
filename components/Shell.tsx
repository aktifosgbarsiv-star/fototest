'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import MobileTopbar from './MobileTopbar'

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/giris') return <>{children}</>
  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      {/* Sadece desktop'ta görünür */}
      <Sidebar />
      <main style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        {/* Sadece mobilde görünür */}
        <MobileTopbar />
        {children}
      </main>
    </div>
  )
}
