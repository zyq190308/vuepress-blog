# 从零搭建vue集成环境

这篇博客主要记录怎么一步步从零开始完整的搭建一个可运行的vue集成环境。

## 初始化
下面的bash命令依次执行，一个基本的webpack环境安装就完成了。

```bash
mkdir custom-webapck-vue # 创建项目文件夹
cd custom-webpack-vue
mkdir src # 源码文件夹
npm init -y # 初始化package.json
npm install webpack webpack-cli -D # 安装webpack依赖(4开始要安装俩个包，4之前只需要安装webpack一个)
```


## 配置文件

webpack解析配置的时候有一个默认解析的文件，叫webpack.config.js，里面就是配置一些打包的配置。
在项目根目录下新建一个webpack.confg.js,main.js文件，基本内容如下：
```js
// src/main.js
console.log('Hello Webpack!')
```
```js
// webpack.config.js
const path = require('path')

module.exports = {
  mode: 'production', // 默认打包环境(ps:production) 内置development和production
  entry: {
    app: './main.js' // 打包的入口文件
  },
  output: {
    filename: '[name].[chunkhash:8].js', // 打包后的文件名
    path: path.resolve(__dirname, 'dist') // 打包后的路径
  }
}

```
然后命令行运行：
```sh
# 我们都知道npm包分为本地包和全局包，npm 5.2开始支持npx，原来我们要运行一个本地包，需要诸如这样node-modules/.bin/mocha --version使用，有了npx，就可以npx mocha --version直接用了。
npx webpack
```
此时你会看到在dist目录下生成了一个js文件，就是上面entry里配置的内容。webpack4+默认情况下在没有配置mode的情况下，会默认是已production打包，所以看到的是压缩后的js文件。
然后试着把mode改成'development'，此时文件就是正常没被压缩的，但此时又发现每次打包会生成一个版本的文件，这时候我们需要清除dist文件夹的插件, CleanWepackPlugin，安装

```sh
npm install clean-webpack-plugin -D
```

然后在webpack.config.js配置plugins：
```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  // ... 基础配置同上
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```
然后再次打包，发现打包只生成当前打包的文件了。

为了使用js新语法，我们需要安装babel：
```sh
npm install @babel/core @babel/preset-env babel-loader -D
```
然后在根目录新建babel.config.js，配置文件如下：
```js
// babel.config.js

module.exports = {
  presets: [
    '@babel/preset-env'
  ]
}
```
```js
// webpack.config.js
module.exports = {
  // ...
  // 基础配置同上
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/ // 忽略解析的文件夹
        include: /src/ // 指定解析的文件夹
      }
    ]
  }
}
```
配置了这些之后会把一些高级语法装换成es5语法，但是有些高级函数是不包含在内的，比如Promise，这时候安装：
```sh
npm install @babel/polyfill -S
```
然后在babel.config.js中配置如下：
```js
// babel.config.js

module.exports = {
  presets: [
    [
      '@babel/env',
      { 
        targets: {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        useBuiltIns: 'usage',
        corejs: 2
      },
    ]
  ]
}
```
说了这么多，需要引入HTML了，我们在根目录新建index.html，一般为了把js注入HTML，我们用的是HtmlWepackPlugin，安装：
```
npm install html-webpack-plugin -D
```
然后在webpack.config.js配置如下：
```js

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // 基础配置省略
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html' 
    })
    /** 
     * 等价于
        new HtmlWebpackPlugin({
          template: 'index.html',
          chunks: ['app']
        })
     * */ 
  ]
}
```
配好后打包，你会发现打包的主入口js自动注入HTML中了。

现在我们要加点样式，也就是css之流。
我们在src下新建一个assets目录，然后新建一个style.less，要解析less，
我们需要less，less-loader，css-loader，style-loader，安装
```sh
# 如果是sass，把less-loader换成sass-loader， less换成node-sass或者dart-sass
npm install less less-loader css-loader style-loader -D
```
然后在main.js引入style.css
```js
// main.js
import './assets/style.less'
```
然后在webpack.config.js中配置解析的loader，如下：
```js
// webpack.config.js

module.exports = {
  // 基础配置省略
  {
    test: /\.less$/,
    use: [
      'style-loader',
      'css-loader',
      'less-loader'
    ]
  }
}
```
配置之后打包之后样式正常识别。

现在我们来看看Vue，要解析Vue文件，当然也是和其他文件一样，需要vue-loader。
这是[vue-loader](https://vue-loader.vuejs.org/zh/)的官方文档。

解析Vue文件需要的配置如下：
```sh
npm install vue-loader vue-template-compiler -D
```

然后安装Vue系列：
```sh
npm install vue vue-router -S
```
然后做以下配置，
新建App.vue，router.js，views/Home.vue，然后内容以及配置如下：

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  plugins: [
    new VueLoaderPlugin()
  ]
}
```

```js
// main.js

import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
```

```html
<!-- App.vue -->
<template>
  <div>
    <router-view />
  </div>
</template>

<script>
  export default {
    data () {
      return {}
    }
  }
</script>

<style lang="less" scoped>
</style>

```


```js
// router.js

import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'

Vue.use(VueRouter)

export default new VueRouter({
  mode: 'hash',
  routes: [{
    path: '/',
    component: Home
  }]
})
```

```html
<!-- Home.vue -->
<template>
  <div>
    {{ msg }}
  </div>
</template>

<script>
  export default {
    data () {
      return {
        msg: 'i am from home page'
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
```

最后打包，发现一个Vue基本环境已经出来了。





