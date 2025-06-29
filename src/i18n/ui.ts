import type { PartialDeep } from 'type-fest'

export type LanguageCode = keyof typeof languages
export type DefinedStrings = typeof sv
export type LanguageStringsNode = {[key: string]: LanguageStringsNode | string}

export const languages = {
  sv: 'Svenska',
  en: 'English',
}

export const emoji: Record<LanguageCode, string> = {
  sv: '🇸🇪',
  en: '🇬🇧',
}

export const defaultLang: keyof typeof languages = 'sv'

const sv = {
  nav: {
    index: 'Start',
    food: 'Mat',
    drinks: 'Dryck',

    order: 'Se meny & beställ upphämtning',
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
    opening: 'Öppnar om',
    days: 'dagar',
    hours: 'timmar',
    minutes: 'minuter',
    seconds: 'sekunder',
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
