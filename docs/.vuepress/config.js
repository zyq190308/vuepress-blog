module.exports = {
  title: '大前端',
  description: 'frontend doc',
  themeConfig: {
    sidebar: 'auto',
    // activeHeaderLinks: false, // url中hash禁用
    // displayAllHeaders: true,
    nav: [
      { text: 'vue', link: '/vue/' },
      { text: 'react', link: '/react/'},
      { text: 'angular', link: '/angular/'}
    ],
    sidebar: {
      '/react/': [
        '',
        '/react/main'
      ],
      '/angular/': [
        '',
        '/angular/main'
      ],
      '/': [
        '/vue/',
        '/vue/main'
      ],
    }
  }
}