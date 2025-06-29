import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'
import { i18n } from 'astro:config/client'

function defineCollectionByLocale(locale: string) {
  return defineCollection({
    loader: glob({
      pattern: '*.md',
      base: `./src/content/${locale}`
    }),
    // schema: z.object({
    //   id: z.string(),
    // })
  })
}

export const collections = Object.fromEntries(i18n!.locales.map(locale => [
  locale,
  defineCollectionByLocale(locale as string)
]))
