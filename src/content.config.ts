import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'
import { i18n } from 'astro:config/client'
import { parse as parseCsv } from 'csv-parse/sync'

type CategoryDefinitionSchema = z.infer<typeof categoryDefinitionSchema>
type ProductSchema = z.infer<typeof productDefinitionSchema>

const categoryDefinitionSchema = z.object({
  slug: z.string(),
  position: z.number(),
  priceCategories: z.number(),
})

/**
 * A product definition
 */
const productDefinitionSchema = z.object({
  slug: z.string(),
  category: z.string(),
  position: z.number(),
  price: z.array(z.number()),
  spice: z.number()
})

/**
 * Generic schema for localisation entries about products and categories.
 */
const l10nEntrySchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
})

/**
 * Parse product definitions from csv text.
 */
function parseProductDefinitions(text: string) {
  const res = parseCsv(text, {
    columns: true,
    skipEmptyLines: true
  })
  for (const entry of res) {
    entry.position = Number.parseInt(entry.position)
    entry.price = entry.price.split(";").map((priceString: string) => Number.parseInt(priceString))
  }

  return res
}

/**
 * Parse category definitions from csv text.
 */
function parseCategoryDefinitions(text: string) {
  const res = parseCsv(text, {
    columns: true,
    skipEmptyLines: true,
  })
  for (const entry of res) {
    entry.position = Number.parseInt(entry.position)
    entry.priceCategories = Number.parseInt(entry.priceCategories)
  }

  return res
}

/**
 * Parse generic localisation file for products and categories.
 */
function parseL10nCsv(text: string) {
  const res = parseCsv(text, {
    columns: true,
    skipEmptyLines: true
  })
  return res
}

function defineCollectionsByLocale(locale: string) {
  return {
    [`${locale}Md`]: defineCollection({
      loader: glob({
        pattern: '**/*.md',
        base: `./src/content/l10n/${locale}`
      }),
    }),

    [`${locale}Food`]: defineCollection({
      schema: l10nEntrySchema,
      loader: file(`./src/content/l10n/${locale}/products/food.csv`, {
        parser: parseL10nCsv
      })
    }),

    [`${locale}Drinks`]: defineCollection({
      schema: l10nEntrySchema,
      loader: file(`./src/content/l10n/${locale}/products/drinks.csv`, {
        parser: parseL10nCsv
      })
    }),
  }
}

const [foodCategoryDefinitions, drinksCategoryDefinitions] = ['food', 'drinks'].map(group => defineCollection({
  schema: categoryDefinitionSchema,
  loader: file(`src/content/categories/${group}.csv`,
    { parser: parseCategoryDefinitions }
  )
}))

const [foodProductDefinitions, drinksProductDefinitions] = ['food', 'drinks'].map(group => defineCollection({
  schema: productDefinitionSchema,
  loader: file(`src/content/products/${group}.csv`,
    { parser: parseProductDefinitions }
  )
}))

export const collections = {
  ...defineCollectionsByLocale('sv'),
  ...defineCollectionsByLocale('en'),
  foodCategoryDefinitions,
  drinksCategoryDefinitions,
  foodProductDefinitions,
  drinksProductDefinitions,
}
