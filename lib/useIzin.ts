'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { getIzin, type IzinKey, type ModulIzin } from '@/lib/izinler'

export function useIzin(modul: IzinKey): ModulIzin & { yukleniyor: boolean } {
  const [sonuc, setSonuc] = useState<ModulIzin & { yukleniyor: boolean }>({
    goruntur: true,
    duzenle: true,
    dosya_yukle: true,
    sil: true,
    yukleniyor: true,
  })

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setSonuc({ goruntur: false, duzenle: false, dosya_yukle: false, sil: false, yukleniyor: false })
        return
      }
      const { data: p } = await sb
        .from('personeller')
        .select('rol, izinler')
        .eq('id', data.user.id)
        .single()

      if (!p) {
        setSonuc({ goruntur: true, duzenle: false, dosya_yukle: false, sil: false, yukleniyor: false })
        return
      }

      const izin = getIzin(modul, p.rol, p.izinler || {})
      setSonuc({ ...izin, yukleniyor: false })
    })
  }, [modul])

  return sonuc
}
