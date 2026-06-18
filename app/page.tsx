import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import SiteNav from '@/components/site/SiteNav'
import SiteFooter from '@/components/site/SiteFooter'
import HeroSlider from '@/components/site/HeroSlider'
import SiteFloating from '@/components/site/SiteFloating'

export const dynamic = 'force-dynamic'
export const metadata = {
  title: 'Aktif OSGB | Afyonkarahisar İş Sağlığı ve Güvenliği',
  description: '2014\'ten bu yana Afyonkarahisar\'da yetkili OSGB hizmetleri. İşyeri hekimliği, iş güvenliği uzmanlığı, mobil sağlık taraması, eğitimler.'
}

async function getData() {
  const client = createClient()
  const [ayarlar, hizmetler, egitimler, yazilar] = await Promise.all([
    client.from('site_ayarlar').select('anahtar,deger').then(r => {
      const a: Record<string,string> = {}
      ;(r.data||[]).forEach((x:any)=>{ a[x.anahtar]=x.deger }); return a
    }),
    client.from('site_hizmetler').select('*').eq('aktif',true).order('sira').then(r=>r.data||[]),
    client.from('site_egitimler').select('*').eq('aktif',true).order('sira').limit(4).then(r=>r.data||[]),
    client.from('site_yazilar').select('*').eq('yayinda',true).order('yayinlandi_at',{ascending:false}).limit(3).then(r=>r.data||[]),
  ])
  return { ayarlar, hizmetler, egitimler, yazilar }
}

const SARI = '#f5c200'

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,194,0,.12)', border:'1px solid rgba(245,194,0,.35)', borderRadius:100, padding:'5px 16px', fontSize:11, fontWeight:800, color:'#a07800', textTransform:'uppercase', letterSpacing:2, marginBottom:18 }}>
      {text}
    </div>
  )
}

export default async function AnaSayfa() {
  const { ayarlar, hizmetler, egitimler, yazilar } = await getData()

  return (
    <div style={{ background:'#f8f9fb', minHeight:'100vh', color:'#1a1a2e', fontFamily:"'Inter',-apple-system,system-ui,sans-serif" }}>
      <SiteNav />
      <HeroSlider />

      {/* STATS BAR */}
      <div style={{ background:'linear-gradient(135deg,#f5c200 0%,#e6a800 100%)', padding:'28px 32px' }}>
        <div className="site-stats-grid" style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 }}>
          {[
            { num:'500+', lbl:'Çalışılan Firma', icon:'🏭' },
            { num:'9+', lbl:'Yıllık Deneyim', icon:'📅' },
            { num:'1200+', lbl:'Verilen Eğitim', icon:'🎓' },
            { num:'6331', lbl:'Sayılı Kanun Kapsamı', icon:'📋' },
          ].map(({ num, lbl, icon }) => (
            <div key={lbl} style={{ textAlign:'center' }}>
              <div style={{ fontSize:11, marginBottom:4 }}>{icon}</div>
              <div style={{ fontSize:'clamp(22px,3vw,32px)', fontWeight:900, color:'#1a1a2e', letterSpacing:-1 }}>{num}</div>
              <div style={{ fontSize:11, color:'rgba(0,0,0,.55)', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HİZMETLER */}
      <section style={{ padding:'80px 32px', maxWidth:1280, margin:'0 auto' }}>
        <SectionLabel text="Hizmetlerimiz" />
        <h2 style={{ fontSize:'clamp(28px,4vw,44px)', fontWeight:900, color:'#1a1a2e', marginBottom:12, letterSpacing:-1, lineHeight:1.1 }}>
          Kapsamlı OSGB <span style={{ color:SARI }}>Çözümleri</span>
        </h2>
        <p style={{ fontSize:16, color:'#6b7280', maxWidth:520, lineHeight:1.7, marginBottom:48 }}>
          6331 sayılı Kanun kapsamında ihtiyacınız olan tüm iş sağlığı ve güvenliği hizmetleri tek çatı altında.
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
          {hizmetler.map((h:any) => (
            <div key={h.id} style={{
              background:'#ffffff',
              border:'1px solid #e5e7eb',
              borderRadius:16, padding:28,
              transition:'all .2s',
              boxShadow:'0 1px 4px rgba(0,0,0,.06)'
            }}>
              <div style={{ fontSize:32, marginBottom:14 }}>{h.ikon||'🛡️'}</div>
              <h3 style={{ fontSize:17, fontWeight:700, color:'#1a1a2e', marginBottom:8 }}>{h.baslik}</h3>
              <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.7 }}>{h.aciklama}</p>
              {h.slug && (
                <a href={`/hizmetlerimiz#${h.slug}`} style={{ display:'inline-flex', alignItems:'center', gap:6, marginTop:16, fontSize:13, color:'#a07800', fontWeight:600, textDecoration:'none' }}>
                  Detaylar →
                </a>
              )}
            </div>
          ))}
          {hizmetler.length === 0 && [
            { ikon:'🛡️', baslik:'İş Güvenliği Uzmanlığı', aciklama:'Risklerin tespiti, önleme planları ve yasal uyumluluk denetimleri.' },
            { ikon:'🏥', baslik:'İşyeri Hekimliği', aciklama:'Periyodik muayene, sağlık gözetimi ve iş kazası raporlaması.' },
            { ikon:'📋', baslik:'Risk Değerlendirme', aciklama:'Tehlike tanımlama, risk puanlama ve kontrol önlemleri.' },
            { ikon:'🎓', baslik:'Eğitim & Tatbikat', aciklama:'Yangın, ilk yardım ve ISG farkındalık eğitimleri.' },
            { ikon:'🚑', baslik:'Mobil Sağlık Taraması', aciklama:'İşyerine gelen mobil ekiplerle kapsamlı sağlık taraması.' },
            { ikon:'📊', baslik:'Raporlama & Takip', aciklama:'Yasal raporlar, ISG panosu ve düzeltici faaliyet takibi.' },
          ].map((h:any) => (
            <div key={h.baslik} style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:16, padding:28, boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
              <div style={{ fontSize:32, marginBottom:14 }}>{h.ikon}</div>
              <h3 style={{ fontSize:17, fontWeight:700, color:'#1a1a2e', marginBottom:8 }}>{h.baslik}</h3>
              <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.7 }}>{h.aciklama}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign:'center', marginTop:40 }}>
          <a href="/hizmetlerimiz" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'14px 32px', borderRadius:10, background:SARI, color:'#1a1a2e', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 16px rgba(245,194,0,.3)' }}>
            Tüm Hizmetleri Gör →
          </a>
        </div>
      </section>

      {/* EĞİTİMLER */}
      {egitimler.length > 0 && (
        <section style={{ padding:'80px 32px', background:'#f3f4f6' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <SectionLabel text="Eğitimlerimiz" />
            <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:'#1a1a2e', marginBottom:48, letterSpacing:-1 }}>
              Sertifikalı ISG <span style={{ color:SARI }}>Eğitimleri</span>
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
              {egitimler.map((e:any) => (
                <div key={e.id} style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:14, padding:'22px 24px', boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
                  <div style={{ fontSize:28, marginBottom:12 }}>{e.ikon||'📚'}</div>
                  <h3 style={{ fontSize:15, fontWeight:700, color:'#1a1a2e', marginBottom:6 }}>{e.baslik}</h3>
                  <p style={{ fontSize:12, color:'#6b7280', lineHeight:1.6 }}>{e.aciklama}</p>
                  {e.sure && <div style={{ marginTop:12, fontSize:11, color:'#a07800', fontWeight:700, background:'rgba(245,194,0,.1)', padding:'3px 10px', borderRadius:100, display:'inline-block' }}>⏱ {e.sure}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEDEN BİZ */}
      <section style={{ padding:'80px 32px', maxWidth:1280, margin:'0 auto' }}>
        <SectionLabel text="Neden Aktif OSGB?" />
        <h2 style={{ fontSize:'clamp(26px,4vw,40px)', fontWeight:900, color:'#1a1a2e', marginBottom:48, letterSpacing:-1 }}>
          Güvenilir ve <span style={{ color:SARI }}>Deneyimli</span> Ekip
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:20 }}>
          {[
            { ikon:'✅', baslik:'Yasal Uyumluluk', aciklama:'6331 sayılı Kanun ve alt mevzuata tam uyum. Yetkili OSGB belgesi.' },
            { ikon:'⚡', baslik:'Hızlı Müdahale', aciklama:'Acil durumlarda 24 saat içinde yerinde destek.' },
            { ikon:'📱', baslik:'Dijital Takip', aciklama:'Online portal ile tüm evrak ve raporlarınıza anlık erişim.' },
            { ikon:'🤝', baslik:'Uzman Kadro', aciklama:'Sertifikalı iş güvenliği uzmanları ve işyeri hekimleri.' },
          ].map(item => (
            <div key={item.baslik} style={{ display:'flex', gap:16, alignItems:'flex-start', padding:24, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:14, boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
              <div style={{ fontSize:28, flexShrink:0 }}>{item.ikon}</div>
              <div>
                <h3 style={{ fontSize:15, fontWeight:700, color:'#1a1a2e', marginBottom:6 }}>{item.baslik}</h3>
                <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.6 }}>{item.aciklama}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* YAZILAR */}
      {yazilar.length > 0 && (
        <section style={{ padding:'80px 32px', background:'#f3f4f6' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <SectionLabel text="Blog & Haberler" />
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40, flexWrap:'wrap', gap:16 }}>
              <h2 style={{ fontSize:'clamp(24px,3vw,36px)', fontWeight:900, color:'#1a1a2e', letterSpacing:-1 }}>
                ISG <span style={{ color:SARI }}>Yazılarımız</span>
              </h2>
              <a href="/yazilarimiz" style={{ fontSize:13, color:'#a07800', fontWeight:700, textDecoration:'none' }}>Tümünü Gör →</a>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:20 }}>
              {yazilar.map((y:any) => (
                <a key={y.id} href={`/yazilarimiz/${y.slug}`} style={{ textDecoration:'none', display:'block', background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.06)', transition:'box-shadow .2s' }}>
                  {y.kapak_url && <img src={y.kapak_url} alt={y.baslik} style={{ width:'100%', height:180, objectFit:'cover', display:'block' }} />}
                  <div style={{ padding:20 }}>
                    <p style={{ fontSize:11, color:'#a07800', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>{y.kategori||'ISG'}</p>
                    <h3 style={{ fontSize:16, fontWeight:700, color:'#1a1a2e', lineHeight:1.4, marginBottom:8 }}>{y.baslik}</h3>
                    <p style={{ fontSize:13, color:'#6b7280', lineHeight:1.6 }}>{y.ozet?.slice(0,100)}...</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ background:'#1a1a2e', padding:'72px 32px', textAlign:'center' }}>
        <h2 style={{ fontSize:'clamp(26px,4vw,42px)', fontWeight:900, color:'#ffffff', marginBottom:16, letterSpacing:-1 }}>
          İş Güvenliğinizi <span style={{ color:SARI }}>Profesyonellere</span> Bırakın
        </h2>
        <p style={{ fontSize:16, color:'#9098b1', maxWidth:480, margin:'0 auto 36px', lineHeight:1.7 }}>
          Ücretsiz ön değerlendirme için hemen bizimle iletişime geçin.
        </p>
        <div className="site-footer-cta" style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <a href="/iletisim" style={{ padding:'14px 32px', borderRadius:10, background:SARI, color:'#1a1a2e', fontSize:14, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 16px rgba(245,194,0,.3)' }}>
            Teklif Al →
          </a>
          <a href="https://wa.me/905531696867" target="_blank" rel="noopener noreferrer" style={{ padding:'14px 32px', borderRadius:10, background:'rgba(255,255,255,.08)', color:'#ffffff', fontSize:14, fontWeight:700, textDecoration:'none', border:'1px solid rgba(255,255,255,.15)' }}>
            💬 WhatsApp
          </a>
        </div>
      </section>

      <SiteFooter />
      <SiteFloating />
    </div>
  )
}
