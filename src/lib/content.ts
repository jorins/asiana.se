/**
 * @module
 * Utilities for accessing content collections in a manner structured around
 * internationalisation.
 */

import { getCollection, getEntry } from 'astro:content'
import { collections as rawCollections } from '../content.config'

class Collection<Key extends keyof typeof rawCollections> {
  key: Key

  constructor(key: Key) {
    this.key = key
  }

  async getCollection() {
    return await getCollection(this.key)
  }

  async getEntry(ident: string) {
    return await getEntry(this.key, ident)
  }
}

const l10nCollections = {
  sv: {
    md: new Collection('svMd'), 
    products: {
      drinks: new Collection('svDrinks'),
      food: new Collection('svFood'),
    },
    categories: {
      drinks: new Collection('svDrinksCategories'),
      food: new Collection('svFoodCategories'),
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
