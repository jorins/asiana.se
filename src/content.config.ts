import type { LanguageCode } from './lib/i18n'

import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'
import { parse as parseCsv } from 'csv-parse/sync'

type ProductDefinition = z.infer<typeof productDefinitionSchema>
type CategoryDefinition = z.infer<typeof categoryDefinitionSchema>
type L10nEntry = z.infer<typeof l10nEntrySchema>

type RawCategoryDefintionKey =
  | 'slug'
  | 'position'
  | 'name'
  | 'description'

type RawCategoryDefinition = Record<RawCategoryDefintionKey, string>

type RawProductDefinitionKey =
  | 'slug'
  | 'category'
  | 'position'
  | 'price'
  | 'spice'
  | 'vego'
  | 'allergens'
  | 'name'
  | 'description'

type RawProductDefinition = Record<RawProductDefinitionKey, string>

type RawL10nEntryKey =
  | 'slug'
  | 'name'
  | 'description'

type RawL10nEntry = Record<RawL10nEntryKey, string>

const vegoSchema = z.enum(['none', 'vegetarian', 'vegan'])

const categoryDefinitionSchema = z.object({
  slug: z.string(),
  position: z.number(),
  name: z.string(),
  description: z.nullable(z.string()),
})

const productDefinitionSchema = z.object({
  slug: z.string(),
  category: z.string(),
  position: z.number(),
  price: z.array(z.nullable(z.number())),
  spice: z.number(),
  vego: vegoSchema,
  allergens: z.array(z.string()),
  name: z.string(),
  description: z.nullable(z.string()),
})

/**
 * Generic schema for localisation entries about products and categories.
 */
const l10nEntrySchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.nullable(z.string()),
})

/**
 * Parse product definitions from csv text.
 */
function parseProductDefinitions(text: string): ProductDefinition[] {
  const input: RawProductDefinition[] = parseCsv(text.trim(), {
    columns: true,
    skipEmptyLines: true
  })


  const output: ProductDefinition[] = []
  for (const entry of input) {
    output.push({
      slug: entry.slug,
      position: Number.parseInt(entry.position) || Infinity,
      price: entry.price.split(';').map((priceString: string) => Number.parseInt(priceString) || null),
      spice: Number.parseInt(entry.spice) || 0,
      category: entry.category,
      allergens: entry.allergens.split(';'),
      name: entry.name,
      description: entry.description,
      vego: entry.vego === '' ? 'none' : vegoSchema.parse(entry.vego)
    })
  }

  return output
}

/**
 * Parse category definitions from csv text.
 */
function parseCategoryDefinitions(text: string): CategoryDefinition[] {
  const input: RawCategoryDefinition[] = parseCsv(text.trim(), {
    columns: true,
    skipEmptyLines: true,
  })

  const output: CategoryDefinition[] = []

  for (const entry of input) {
    output.push({
      slug: entry.slug,
      position: Number.parseInt(entry.position) || Infinity,
      name: entry.name,
      description: entry.description || null,
    })
  }

  return output
}

/**
 * Parse generic localisation file for products and categories.
 */
function parseL10nCsv(text: string): L10nEntry[] {
  const input: RawL10nEntry[] = parseCsv(text.trim(), {
    columns: true,
    skipEmptyLines: true
  })
  return input
}

function defineCollectionsByLocale<Locale extends LanguageCode>(locale: Locale) {
  return {
    md: defineCollection({
      loader: glob({
        pattern: '**/*.md',
        base: `./src/content/l10n/${locale}`
      }),
    }),

    food: defineCollection({
      schema: l10nEntrySchema,
      loader: file(`./src/content/l10n/${locale}/products/food.csv`, {
        parser: parseL10nCsv
      })
    }),

    drinks: defineCollection({
      schema: l10nEntrySchema,
      loader: file(`./src/content/l10n/${locale}/products/drinks.csv`, {
        parser: parseL10nCsv
      })
    }),

    foodCategories: defineCollection({
      schema: l10nEntrySchema,
      loader: file(`./src/content/l10n/${locale}/categories/food.csv`, {
        parser: parseL10nCsv
      })
    }),

    drinksCategories: defineCollection({
      schema: l10nEntrySchema,
      loader: file(`./src/content/l10n/${locale}/categories/drinks.csv`, {
        parser: parseL10nCsv
      })
    }),
  }
}

const svCollections = defineCollectionsByLocale('sv')
const enCollections = defineCollectionsByLocale('en')

const foodCategories = defineCollection({
  schema: categoryDefinitionSchema,
  loader: file(`src/content/categories/food.csv`,
    { parser: parseCategoryDefinitions }
  )
})

const drinksCategories = defineCollection({
  schema: categoryDefinitionSchema,
  loader: file(`src/content/categories/drinks.csv`,
    { parser: parseCategoryDefinitions }
  )
})

const food = defineCollection({
  schema: productDefinitionSchema,
  loader: file(`src/content/products/food.csv`,
    { parser: parseProductDefinitions }
  )
})

const drinks = defineCollection({
  schema: productDefinitionSchema,
  loader: file(`src/content/products/drinks.csv`,
    { parser: parseProductDefinitions }
  )
})

export const collections = {
  svMd: svCollections.md,
  svFood: svCollections.food,
  svDrinks: svCollections.drinks,
  svFoodCategories: svCollections.foodCategories,
  svDrinksCategories: svCollections.drinksCategories,

  enMd: enCollections.md,
  enFood: enCollections.food,
  enDrinks: enCollections.drinks,
  enFoodCategories: enCollections.foodCategories,
  enDrinksCategories: enCollections.drinksCategories,

  foodCategories,
  drinksCategories,
  food,
  drinks,
}
