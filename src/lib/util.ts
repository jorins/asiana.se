import { i18n } from 'astro:config/client'
import { getEntry, render } from 'astro:content'
import { getLocaleFromUrl } from './i18n'

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
export async function getAndRenderMarkdown(url: URL, slug: string) {
  const locale = getLocaleFromUrl(url)
  const collection = locale + 'Md'
  const entry = await getEntry(collection, slug)
  if (entry === undefined) {
    throw new Error(`Could not find entry '${slug}' in collection '${collection}'`)
  }
  return render(entry)
}
