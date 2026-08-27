// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  nitro:{
    preset: 'cloudflare-pages',
  },
  modules:[
    "@nuxt/image",
    'nitro-cloudflare-dev'
  ],
  css:[
    '@/assets/css/main.css'
  ],
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Zhen Chinese | Master the Language',
      meta: [
        { name: 'description', content: 'An immersive approach to Mandarin. High-fidelity UI, precision motion, and cinematic video.' }
      ],
    }
  }
})
