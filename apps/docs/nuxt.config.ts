// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-primevue',
    '@nuxtjs/tailwindcss',
  ],
  css: [
    '~/theme/root.css',
  ],
  primevue: {
    usePrimeVue: false,
    components: {
      prefix: 'Prime',
      include: '*',
    },
  },
})
