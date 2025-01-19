import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "QuizApp",
  description: "A VitePress Site",
  base: "/QuizApp/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },

      { text: 'Guide', link: '/guide/configuration' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Configuration', link: '/guide/configuration' },
            { text: 'Api', link: '/guide/api' },
            { text: 'Functionalities', link: '/guide/functionalities' },
            { text: 'Stores', link: '/guide/stores' }

          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Corentin-k' }
    ],
    footer: {
      message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2025-present <a href="https://github.com/Corentin-k">Corentin KERVAGORET</a>'
    },

      search: {
        provider: 'local'
      }
    }

})
