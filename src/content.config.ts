import { defineCollection, getCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'
import { i18n } from 'astro:config/client'
import { parse as parseCsv } from 'csv-parse/sync'

function defineCollectionByLocale(locale: string) {
  return defineCollection({
    loader: glob({
      pattern: '**/*.md',
      base: `./src/content/${locale}`
    }),
  })
}

export const translations = Object.fromEntries(i18n!.locales.map(locale => [
  locale,
  defineCollectionByLocale(locale as string)
]))

export const jsonCollections = Object.fromEntries(i18n!.locales.map(locale => [
  defineCollection({
    loader: glob({
      pattern: '*.json',
      base: `./src/content/${locale}`,
    }),
  })
])
)

const alcohol = defineCollection({
  loader: file('src/content/alcohol.csv', { parser: (text) => {
    const res = parseCsv(text, {
      columns: true,
      skipEmptyLines: true
    })
    for (const entry of res) {
      entry.priceGlass = Number.parseInt(entry.priceGlass) || null
      entry.priceBottle = Number.parseInt(entry.priceBottle) || null
    }
    return res
  }}),
  schema: z.object({
    slug: z.string(),
    category: z.string(),
    priceGlass: z.nullable(z.number()),
    priceBottle: z.nullable(z.number()),
  })
})

export const collections = {
  alcohol,
  ...translations,
}

console.log("Collections:", collections)
console.log('Alcohol:', getCollection('alcohol'))
