// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.asiana.se',
  i18n: {
    locales: ['sv', 'en'],
    defaultLocale: 'sv',
    routing: {
      prefixDefaultLocale: true
    }
  }
});
