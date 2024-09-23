import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "《开发文档指南》",
  description: "简单、易懂、易用",
  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      },
      {
        text: 'Vue',
        items: [
          { text: '双向绑定', link: '/vue/双向绑定' },
          { text: 'NextTick', link: '/vue/NextTick' },
          { text: 'mixin', link: '/vue/mixin' },
          { text: 'slot', link: '/vue/slot' },
          { text: 'Observable', link: '/vue/Observable' },
          { text: 'key', link: '/vue/key' },
          { text: 'keep-alive', link: '/vue/keep-alive' },
          { text: '修饰符', link: '/vue/修饰符' },
          { text: '自定义指令', link: '/vue/自定义指令' },
          { text: '过滤器', link: '/vue/过滤器' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
