export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  modules: [
    '@pinia/nuxt',
    '@nuxt/content',
    '@bootstrap-vue-next/nuxt',
  ],

  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    'bootstrap-vue-next/dist/bootstrap-vue-next.css',
  ],

  app: {
    baseURL: process.env.DEPLOY_ENV === 'WITH_SUBFOLDER' ? '/gov-id-finder-2/' : '/',
    head: {
      title: 'Government Organisation ID Finder',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Find government organisation identifiers by country.' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      baseURL: 'https://codeforiati.org/gov-id-finder-data',
    },
  },

})
