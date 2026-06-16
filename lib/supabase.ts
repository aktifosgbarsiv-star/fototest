import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// Next.js, her sayfa/route'u kendi JS chunk'ına ayırdığı için bu dosya
// tarayıcıda birden fazla modül kopyası olarak yüklenebiliyor. Bu durumda
// @supabase/ssr paketinin kendi içindeki singleton cache'i de işe yaramıyor,
// çünkü her chunk kendi modül değişkenine sahip oluyor. Sidebar, MobileTopbar,
// SiteNav ve sayfa bileşenlerinin her biri "createClient()" çağırdığında
// aynı storage key'e (sb-...-auth-token) bağlı ayrı ayrı GoTrueClient
// örnekleri oluşuyor — konsoldaki "Multiple GoTrueClient instances detected"
// uyarısının sebebi de bu.
//
// Çözüm: tek örneği modül seviyesinde değil, tarayıcının `window`
// nesnesinde tutmak. `window` tüm chunk'lar arasında gerçekten paylaşılan
// tek nesne olduğu için, kaç farklı modül kopyası olursa olsun her
// createClient() çağrısı aynı client'ı döndürür.
declare global {
  interface Window {
    __supabaseBrowserClient__?: SupabaseClient
  }
}

export function createClient() {
  // Sunucu tarafı render (SSR/RSC) sırasında `window` yok — burada cache'leme
  // yapmadan taze bir client döndürmek gerekiyor, yoksa istekler arasında
  // örnek/oturum bilgisi sızabilir.
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  if (!window.__supabaseBrowserClient__) {
    window.__supabaseBrowserClient__ = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  return window.__supabaseBrowserClient__
}
