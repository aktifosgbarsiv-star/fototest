import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const USERS = [
  { email: 'taner@aktifosgb.com.tr',  password: 'Aktifosgb2026!', ad_soyad: 'Taner',        rol: 'yonetici'  },
  { email: 'form@aktifosgb.com.tr',   password: 'Aktifosgb2026!', ad_soyad: 'Form',         rol: 'operasyon' },
  { email: 'igu@aktifosgb.com.tr',    password: 'Aktifosgb2026!', ad_soyad: 'Ali İhsan',    rol: 'operasyon' },
  { email: 'igu_1@aktifosgb.com.tr',  password: 'Aktifosgb2026!', ad_soyad: 'Ercan',        rol: 'saha'      },
  { email: 'igu_2@aktifosgb.com.tr',  password: 'Aktifosgb2026!', ad_soyad: 'Dinar',        rol: 'saha'      },
  { email: 'igu_3@aktifosgb.com.tr',  password: 'Aktifosgb2026!', ad_soyad: 'Abdurrahman',  rol: 'saha'      },
  { email: 'igu_4@aktifosgb.com.tr',  password: 'Aktifosgb2026!', ad_soyad: 'Muhterem',     rol: 'saha'      },
  { email: 'igu_5@aktifosgb.com.tr',  password: 'Aktifosgb2026!', ad_soyad: 'Arif Changir', rol: 'saha'      },
  { email: 'igu_6@aktifosgb.com.tr',  password: 'Aktifosgb2026!', ad_soyad: 'IGU 6',        rol: 'saha'      },
  { email: 'satis@aktifosgb.com.tr',  password: 'Aktifosgb2026!', ad_soyad: 'Satis Birimi', rol: 'satis'     },
]

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== 'osgb-admin-2026') {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const results = []
  for (const u of USERS) {
    // Önce varsa sil
    const { data: list } = await admin.auth.admin.listUsers()
    const existing = list?.users?.find((x: any) => x.email === u.email)
    if (existing) {
      await admin.auth.admin.deleteUser(existing.id)
    }

    const { data, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    })

    if (error) {
      results.push({ email: u.email, error: error.message })
      continue
    }

    const uid = data.user.id
    await admin.from('personeller').upsert({
      id: uid, ad_soyad: u.ad_soyad, rol: u.rol, aktif: true
    })
    results.push({ email: u.email, ok: true, id: uid })
  }

  return NextResponse.json(results)
}

export async function POST(req: NextRequest) {
  return GET(req)
}
