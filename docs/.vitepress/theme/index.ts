// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import Theme from 'vitepress/theme'
import PrimeVue from 'primevue/config';

import 'virtual:uno.css'

import './style.css'
import './variables.css'

import button from '../../pt/button'

export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.use(PrimeVue, {
      unstyled: true,
      pt: {
        button
      }
    })
  }
}
