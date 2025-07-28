/**
 * @module
 * Utilities for accessing content collections in a manner structured around
 * internationalisation.
 */

import { getCollection, getEntry } from 'astro:content'
import { collections as rawCollections } from '../content.config'

class Collection<Key extends keyof typeof rawCollections> {
  key: Key

  /**
   * If mock is set, getEntry will always return undefined. This is used for
   * default localisations, where we want the data model to exist but don't
   * want to run getEntry. The actual default localisation text is supposed to
   * be co-located with the data for such collections.
   */
  mock: boolean

  constructor(key: Key, mock?: boolean) {
    this.key = key
    this.mock = mock ?? false
  }

  async getCollection() {
    return await getCollection(this.key)
  }

  async getEntry(ident: string) {
    if (this.mock) {
      return undefined
    }
    return await getEntry(this.key, ident)
  }
}

const l10nCollections = {
  sv: {
    md: new Collection('svMd'), 
    products: {
      drinks: new Collection('svDrinks', true),
      food: new Collection('svFood', true),
    },
    categories: {
      drinks: new Collection('svDrinksCategories', true),
      food: new Collection('svFoodCategories', true),
    },
  },

  en: {
    md: new Collection('enMd'),
    products: {
      food: new Collection('enFood'),
      drinks: new Collection('enDrinks'),
    },
    categories: {
      drinks: new Collection('enDrinksCategories'),
      food: new Collection('enFoodCategories'),
    },
  }
}

export const collections = {
  l10n: l10nCollections,
  products: {
    food: new Collection('food'),
    drinks: new Collection('drinks')
  },
  categories: {
    food: new Collection('foodCategories'),
    drinks: new Collection('drinksCategories')
  },
} as const
