import type { PartialDeep } from 'type-fest'

export type LanguageCode = keyof typeof languages
export type DefinedStrings = typeof sv
export type LanguageStringsNode = {[key: string]: LanguageStringsNode | string}

export const languages = {
  sv: 'Svenska',
  en: 'English',
} as const

export const defaultLang: keyof typeof languages = 'sv'

const sv = {
  nav: {
    index: 'Start',
    food: 'Mat',
    drinks: 'Dryck',

    order: 'Se meny & beställ',
    locate: 'Hitta hit',
    showOnMaps: 'Visa på Google Maps',
    readMore: 'Läs mer',
  },

  openingHours: {
    head: 'Öppettider',
    monToFri: 'Måndag till fredag',
    sat: 'Lördag',
    sun: 'Söndag',
  },

  contact: {
    head: 'Kontakt',
    address: 'Adress',
    telephone: 'Telefon',
    mail: 'Mail',
  },

  time: {
    monday: 'Måndag',
    tuesday: 'Tisdag',
    wednesday: 'Onsdag',
    thursday: 'Torsdag',
    fredag: 'Friday',
    saturday: 'Lördag',
    sunday: 'Söndag',

    opening: 'Öppnar om',
    days: 'dagar',
    hours: 'timmar',
    minutes: 'minuter',
    seconds: 'sekunder',
  },

  alcohol: {
    product: 'Dryck',
    priceGlass: 'Glas',
    priceBottle: 'Flaska',
    red_wine: 'Rött vin',
    white_wine: 'Vitt vin',
    cider: 'Cider',
  }
}

const en: PartialDeep<DefinedStrings> = {
  ...sv,
  openingHours: {
    head: 'Opening hours'
  },
}

export const ui: Record<LanguageCode, PartialDeep<DefinedStrings>> = {
  sv,
  en,
}

export const defaultStrings: DefinedStrings = sv
