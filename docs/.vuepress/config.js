module.exports = {
  title: 'ZYQ的博客',
  description: '专注于记录技术点滴',
  themeConfig: {
    logo: '/img/avatar.jpeg',
    sidebarDepth: 3,
    smoothScroll: true,
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'Vue', link: '/vue/' },
      { text: 'React', link: '/react/' },
      { text: 'JS', link: '/js/' },
      { text: 'CSS', link: '/css/' },
      { text: '其他', link: '/other/' },
      { text: 'Github', link: 'https://github.com/zyq190308' }
    ],
    sidebar: {
      '/vue/': ['', 'communication', 'vue-style-cover', 'vue3'],
      '/react/': ['', 'react'],
      '/js/': [''],
      '/css/': ['', 'scroll'],
      '/other/': [
        '',
        'prettier',
        'mock',
        'stylelint',
        'nginx',
        'protocol',
        'ci'
      ]
    }
  },
  markdown: {
    lineNumbers: true
  },
  plugins: {
    '@vssue/vuepress-plugin-vssue': {
      locale: 'zh',
      platform: 'github',
      owner: 'zyq190308',
      repo: 'vuepress-blog',
      clientId: 'e2c6e1286a945e9a232c',
      clientSecret: '6b55f148e3d92989d70b6b3cc6faebdecab6ba6a'
    }
  }
}
