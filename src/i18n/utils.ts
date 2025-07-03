import type { LanguageCode, LanguageStringsNode, DefinedStrings } from './ui'
import { ui, defaultLang, defaultStrings } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function setUrlLang(url: URL, lang: string): string {
  const [, , ...rest] = url.pathname.split('/');
  return `/${lang}/${rest.join('/')}`
}

function applyStringsNode(base: LanguageStringsNode, add: Partial<LanguageStringsNode>): LanguageStringsNode {
  if (typeof base === 'string' && typeof add === 'string') {
    return add ?? base
  }

  if (typeof base === 'string' || typeof add === 'string') {
    throw new Error(`Type mismatch between base '${base}' and add '${add}'`)
  }

  const out: LanguageStringsNode = {...base};
  for (const key of Object.keys(base)) {
    if (add === undefined) {
      continue
    }
    const baseValue = base[key]
    const addValue = add[key]
    if (typeof baseValue === 'object' && typeof addValue === 'object') {
      out[key] = applyStringsNode(baseValue, addValue)
    } else {
      out[key] = addValue ?? baseValue
    }
  }
  return out
}

export function useLang(lang: LanguageCode): DefinedStrings {
  const base = defaultStrings
  const target = ui[lang]
  return applyStringsNode(base, target) as DefinedStrings // FIXME: questionable forcing of types
}

export function useLangFromUrl(url: URL): DefinedStrings {
  const lang = getLangFromUrl(url)
  return useLang(lang)
}
