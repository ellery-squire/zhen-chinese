// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: true,
  nitro:{
    preset: 'github-pages',
  },
  modules:[
    "@nuxt/image"
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
      // link: [
      //   // Inter (Technical Sans) & Noto Serif SC (Editorial Chinese)
      //   { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      //   { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      //   { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Noto+Serif+SC:wght@400;700&display=swap' }
      // ]
    }
  }
})
