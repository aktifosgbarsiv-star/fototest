'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/giris') return <>{children}</>
  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar />
      <main style={{ flex:1, minWidth:0 }}>{children}</main>
    </div>
  )
}
