// lib/izinler.ts
// Merkezi izin sistemi — middleware'e dokunmaz, sayfa içi kontrol için kullanılır

export type IzinKey =
  | 'firmalar' | 'koordinasyon' | 'saglik' | 'ziyaretler'
  | 'teklifler' | 'tahsilat' | 'arsiv' | 'taramalar'
  | 'hekim' | 'malzemeler' | 'tedarikciler' | 'raporlar'
  | 'fatura' | 'idari' | 'personeller' | 'site'

export interface ModulIzin {
  goruntur: boolean
  duzenle: boolean
}

export type IzinMap = Partial<Record<IzinKey, ModulIzin>>

const ROL_DEFAULTS: Record<string, IzinMap> = {
  yonetici: {
    firmalar:    { goruntur: true,  duzenle: true },
    koordinasyon:{ goruntur: true,  duzenle: true },
    saglik:      { goruntur: true,  duzenle: true },
    ziyaretler:  { goruntur: true,  duzenle: true },
    teklifler:   { goruntur: true,  duzenle: true },
    tahsilat:    { goruntur: true,  duzenle: true },
    arsiv:       { goruntur: true,  duzenle: true },
    taramalar:   { goruntur: true,  duzenle: true },
    hekim:       { goruntur: true,  duzenle: true },
    malzemeler:  { goruntur: true,  duzenle: true },
    tedarikciler:{ goruntur: true,  duzenle: true },
    raporlar:    { goruntur: true,  duzenle: true },
    fatura:      { goruntur: true,  duzenle: true },
    idari:       { goruntur: true,  duzenle: true },
    personeller: { goruntur: true,  duzenle: true },
    site:        { goruntur: true,  duzenle: true },
  },
  operasyon: {
    firmalar:    { goruntur: true,  duzenle: true },
    koordinasyon:{ goruntur: true,  duzenle: true },
    saglik:      { goruntur: true,  duzenle: true },
    ziyaretler:  { goruntur: true,  duzenle: true },
    arsiv:       { goruntur: true,  duzenle: true },
    taramalar:   { goruntur: true,  duzenle: true },
    teklifler:   { goruntur: false, duzenle: false },
    tahsilat:    { goruntur: false, duzenle: false },
    hekim:       { goruntur: false, duzenle: false },
    malzemeler:  { goruntur: false, duzenle: false },
    tedarikciler:{ goruntur: false, duzenle: false },
    raporlar:    { goruntur: false, duzenle: false },
    fatura:      { goruntur: false, duzenle: false },
    idari:       { goruntur: false, duzenle: false },
    personeller: { goruntur: false, duzenle: false },
    site:        { goruntur: false, duzenle: false },
  },
  hekim: {
    firmalar:    { goruntur: false, duzenle: false },
    koordinasyon:{ goruntur: true,  duzenle: false },
    saglik:      { goruntur: true,  duzenle: true },
    ziyaretler:  { goruntur: false, duzenle: false },
    teklifler:   { goruntur: false, duzenle: false },
    tahsilat:    { goruntur: false, duzenle: false },
    arsiv:       { goruntur: false, duzenle: false },
    taramalar:   { goruntur: false, duzenle: false },
    hekim:       { goruntur: true,  duzenle: true },
    malzemeler:  { goruntur: false, duzenle: false },
    tedarikciler:{ goruntur: false, duzenle: false },
    raporlar:    { goruntur: false, duzenle: false },
    fatura:      { goruntur: false, duzenle: false },
    idari:       { goruntur: false, duzenle: false },
    personeller: { goruntur: false, duzenle: false },
    site:        { goruntur: false, duzenle: false },
  },
  satis: {
    firmalar:    { goruntur: true,  duzenle: false },
    koordinasyon:{ goruntur: true,  duzenle: true },
    saglik:      { goruntur: true,  duzenle: false },
    ziyaretler:  { goruntur: true,  duzenle: true },
    teklifler:   { goruntur: true,  duzenle: true },
    tahsilat:    { goruntur: true,  duzenle: false },
    arsiv:       { goruntur: false, duzenle: false },
    taramalar:   { goruntur: true,  duzenle: true },
    hekim:       { goruntur: false, duzenle: false },
    malzemeler:  { goruntur: false, duzenle: false },
    tedarikciler:{ goruntur: false, duzenle: false },
    raporlar:    { goruntur: false, duzenle: false },
    fatura:      { goruntur: false, duzenle: false },
    idari:       { goruntur: false, duzenle: false },
    personeller: { goruntur: false, duzenle: false },
    site:        { goruntur: false, duzenle: false },
  },
  muhasebe: {
    firmalar:    { goruntur: true,  duzenle: false },
    koordinasyon:{ goruntur: true,  duzenle: false },
    saglik:      { goruntur: true,  duzenle: false },
    ziyaretler:  { goruntur: true,  duzenle: false },
    teklifler:   { goruntur: true,  duzenle: false },
    tahsilat:    { goruntur: true,  duzenle: true },
    arsiv:       { goruntur: false, duzenle: false },
    taramalar:   { goruntur: true,  duzenle: false },
    hekim:       { goruntur: false, duzenle: false },
    malzemeler:  { goruntur: false, duzenle: false },
    tedarikciler:{ goruntur: false, duzenle: false },
    raporlar:    { goruntur: false, duzenle: false },
    fatura:      { goruntur: false, duzenle: false },
    idari:       { goruntur: false, duzenle: false },
    personeller: { goruntur: false, duzenle: false },
    site:        { goruntur: false, duzenle: false },
  },
  saha: {
    firmalar:    { goruntur: false, duzenle: false },
    koordinasyon:{ goruntur: true,  duzenle: true },
    saglik:      { goruntur: false, duzenle: false },
    ziyaretler:  { goruntur: true,  duzenle: true },
    teklifler:   { goruntur: false, duzenle: false },
    tahsilat:    { goruntur: false, duzenle: false },
    arsiv:       { goruntur: true,  duzenle: false },
    taramalar:   { goruntur: false, duzenle: false },
    hekim:       { goruntur: false, duzenle: false },
    malzemeler:  { goruntur: false, duzenle: false },
    tedarikciler:{ goruntur: false, duzenle: false },
    raporlar:    { goruntur: false, duzenle: false },
    fatura:      { goruntur: false, duzenle: false },
    idari:       { goruntur: false, duzenle: false },
    personeller: { goruntur: false, duzenle: false },
    site:        { goruntur: false, duzenle: false },
  },
}

export function getIzin(
  modul: IzinKey,
  rol: string,
  kisiselIzinler: IzinMap = {}
): ModulIzin {
  if (kisiselIzinler[modul] !== undefined) {
    return kisiselIzinler[modul]!
  }
  const defaults = ROL_DEFAULTS[rol] || ROL_DEFAULTS.operasyon
  return defaults[modul] || { goruntur: false, duzenle: false }
}

export function getRolDefaults(rol: string): IzinMap {
  return ROL_DEFAULTS[rol] || ROL_DEFAULTS.operasyon
}

export const MODUL_LISTESI: { key: IzinKey; label: string }[] = [
  { key: 'firmalar',     label: 'Firmalar' },
  { key: 'koordinasyon', label: 'Görev Takibi' },
  { key: 'saglik',       label: 'Sağlık Raporu' },
  { key: 'ziyaretler',   label: 'ISG Ziyaretleri' },
  { key: 'teklifler',    label: 'Teklifler' },
  { key: 'tahsilat',     label: 'Tahsilat' },
  { key: 'arsiv',        label: 'Arşiv' },
  { key: 'taramalar',    label: 'Sağlık Taramaları' },
  { key: 'hekim',        label: 'Hekim Ekranı' },
  { key: 'malzemeler',   label: 'Malzemeler' },
  { key: 'tedarikciler', label: 'Tedarikçiler' },
  { key: 'raporlar',     label: 'Raporlar' },
  { key: 'fatura',       label: 'Fatura Takibi' },
  { key: 'idari',        label: 'İdari İşler' },
  { key: 'personeller',  label: 'Personel & Yetkiler' },
  { key: 'site',         label: 'Site Yönetimi' },
]
