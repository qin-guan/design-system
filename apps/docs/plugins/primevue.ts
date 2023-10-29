import PrimeVue from 'primevue/config'
import button from '~/pt/button'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    unstyled: true,
    pt: {
      button,
    },
  })
})
