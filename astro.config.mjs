// @ts-check
import { defineConfig } from 'astro/config'
import icon from 'astro-icon'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.asiana.se',
  integrations: [
    icon()
  ],
  i18n: {
    locales: ['sv', 'en'],
    defaultLocale: 'sv',
    routing: {
      prefixDefaultLocale: true
    }
  }
});
