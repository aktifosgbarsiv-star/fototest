'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { getIzin, type IzinKey, type ModulIzin } from '@/lib/izinler'

/**
 * Mevcut kullanıcının belirtilen modüldeki iznini döner.
 * Supabase'den personel + izinler çeker, getIzin() ile hesaplar.
 */
export function useIzin(modul: IzinKey): ModulIzin & { yukleniyor: boolean } {
  const [sonuc, setSonuc] = useState<ModulIzin & { yukleniyor: boolean }>({
    goruntur: true,
    duzenle: true,
    yukleniyor: true,
  })

  useEffect(() => {
    const sb = createClient()
    sb.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setSonuc({ goruntur: false, duzenle: false, yukleniyor: false })
        return
      }
      const { data: p } = await sb
        .from('personeller')
        .select('rol, izinler')
        .eq('id', data.user.id)
        .single()

      if (!p) {
        setSonuc({ goruntur: true, duzenle: false, yukleniyor: false })
        return
      }

      const izin = getIzin(modul, p.rol, p.izinler || {})
      setSonuc({ ...izin, yukleniyor: false })
    })
  }, [modul])

  return sonuc
}
