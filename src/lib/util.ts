import { i18n } from 'astro:config/client'
import { getEntry, render } from 'astro:content'
import { getLangFromUrl } from '../i18n/utils'

/**
 * Common get static paths function that just returns an entry for each language
 */
export function getStaticPaths() {
  return i18n!.locales.map((locale) => ({
   params: { lang: locale } 
  }))
}

/**
 * Wrapper for getEntry
 */
export async function getAndRender(url: URL, slug: string) {
  const locale = getLangFromUrl(url)
  const entry = await getEntry(locale, slug)
  if (entry === undefined) {
    throw new Error(`Could not find entry '${slug}' in collection '${locale}'`)
  }
  return await getEntry(locale, slug)!.then(entry => render(entry))
}
