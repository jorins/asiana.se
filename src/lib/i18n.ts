import { readFileSync } from 'node:fs'

import defaultAllergens from '../content/l10n/sv/allergens.json'
import defaultAlt from '../content/l10n/sv/alt.json'
import defaultMeta from '../content/l10n/sv/meta.json'
import defaultUi from '../content/l10n/sv/ui.json'

export type LanguageCode = keyof typeof languages

export const languages = {
  sv: 'Svenska',
  en: 'English',
} as const

export const defaultLang: keyof typeof languages = 'sv'

/**
 * Get the language (the first path entry) from a given URL.
 */
export function getLocaleFromUrl(url: URL): LanguageCode {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) {
    return lang as LanguageCode
  }
  return defaultLang;
}

/**
 * Substitute a URL's language for a given one.
 */
export function setUrlLocale(url: URL, lang: string): string {
  const [, , ...rest] = url.pathname.split('/');
  return `/${lang}/${rest.join('/')}`
}

/**
 * An object containing all localisation keys, nested into categories. One
 * category equals one file. The type is extended with a record of anything so
 * that yet to be set values can be used pre-emptively.
 */
type LocalisationValues = {
  allergens: typeof defaultAllergens & Record<string, string | undefined>
  alt: typeof defaultAlt & Record<string, string | undefined>
  meta: typeof defaultMeta & Record<string, string | undefined>
  ui: typeof defaultUi & Record<string, string | undefined>
}

/**
 * The default localisation values, currently hard-coded to be Swedish.
 */
const defaultLocalisationValues: LocalisationValues = {
  allergens: defaultAllergens,
  alt: defaultAlt,
  meta: defaultMeta,
  ui: defaultUi,
}

/**
 * Helper class for accessing localisation values. Strings are accessed using
 * the get method, which will warn you if your localisation is missing a used
 * key, and log a warning if it does not exist in the default localisatio
 * either.
 */
export class Localisation {
  lang: LanguageCode;
  values: LocalisationValues;

  constructor(lang: LanguageCode) {
    const localisedAllergensText = readFileSync(`./src/content/l10n/${lang}/allergens.json`)
    const localisedAltText = readFileSync(`./src/content/l10n/${lang}/alt.json`)
    const localisedMetaText = readFileSync(`./src/content/l10n/${lang}/meta.json`)
    const localisedUiText = readFileSync(`./src/content/l10n/${lang}/ui.json`)

    const localisedAllergens = JSON.parse(localisedAllergensText.toString())
    const localisedAlt = JSON.parse(localisedAltText.toString())
    const localisedMeta = JSON.parse(localisedMetaText.toString())
    const localisedUi = JSON.parse(localisedUiText.toString())

    this.lang = lang
    this.values = {
      allergens: localisedAllergens,
      alt: localisedAlt,
      meta: localisedMeta,
      ui: localisedUi,
    }
  }

  get(cat: keyof typeof this.values, key: string) {
    const defaultCat = defaultLocalisationValues[cat]
    const l10nCat = this.values[cat]

    const def = defaultCat?.[key] ?? null;
    const found = l10nCat?.[key] ?? null;

    if (defaultCat === undefined) {
      console.error(`Missing localisation category '${cat}' in defaults.`)
    }

    if (l10nCat === undefined) {
      console.error(`Missing localisation category '${cat}' in localisation '${this.lang}'.`)
    }

    if (found === null) {
      console.warn(`Missing localisation value in localisation '${this.lang}', category '${cat}', key '${key}'`)
    }

    if (def === null) {
      console.error(`Missing localisation default in '${cat}', key '${key}'`)
    }

    return found ?? def ?? `[${cat}:${key}]`
  }
}
