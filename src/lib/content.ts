/**
 * @module
 * Utilities for accessing content collections in a manner structured around
 * internationalisation.
 */

import type { LanguageCode } from './i18n'

import { getCollection } from 'astro:content'
import { languages } from './i18n'

type ExpectedL10nCollections = 
  | 'md'
  | 'drinkProducts'
  | 'drinkProducts'
  | 'foodProducts'
  | 'drinkCategories'
  | 'foodCategories'

const l10nCollections: Record<LanguageCode, Record<ExpectedL10nCollections, string>> = {
  sv: {
    md: 'svMd', 
    drinkProducts: 'svDrinkProducts',
    foodProducts: 'svFoodProducts',
    drinkCategories: 'svDrinkCategories',
    foodCategories: 'svFoodCategories',
  },

  en: {
    md: 'enMd',
    drinkProducts: 'enDrinkProducts',
    foodProducts: 'enFoodProducts',
    drinkCategories: 'enDrinkCategories',
    foodCategories: 'enFoodCategories',
  }
}

export const collections = {
  ...l10nCollections,
  foodProducts: 'foodProducts',
  drinkProducts: 'drinkProducts',
} as const
