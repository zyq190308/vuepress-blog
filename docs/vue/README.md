# 从零搭建vue集成环境

这篇博客主要记录怎么一步步从零开始完整的搭建一个可运行的vue集成环境。

## 初始化
下面的bash命令依次执行，一个基本的webpack环境安装就完成了。

```bash
mkdir custom-webpack-vue # 创建项目文件夹
cd custom-webpack-vue
mkdir src # 源码文件夹
npm init -y # 初始化package.json
npm install webpack webpack-cli -D # 安装webpack依赖(4开始要安装俩个包，4之前只需要安装webpack一个)
```


## 基本版 [基本版仓库](https://github.com/zyq190308/custom-webpack-vue/tree/master)

webpack解析配置的时候有一个默认解析的文件，叫webpack.config.js，里面就是配置一些打包的配置。
在项目根目录下新建一个webpack.confg.js,src目录下新建main.js文件，基本内容如下：
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
    app: './src/main.js' // 打包的入口文件
  },
  output: {
    filename: '[name].[chunkhash:8].js', // 打包后的文件名
    path: path.resolve(__dirname, 'dist') // 打包后的路径
  }
}

```
然后命令行运行：
```bash
# 我们都知道npm包分为本地包和全局包，npm 5.2开始支持npx，原来我们要运行一个本地包，需要诸如这样node-modules/.bin/mocha --version使用，有了npx，就可以npx mocha --version直接用了。
npx webpack
```
此时你会看到在dist目录下生成了一个js文件，就是上面entry里配置的内容。webpack4+默认情况下在没有配置mode的情况下，会默认是已production打包，所以看到的是压缩后的js文件。
然后试着把mode改成'development'，此时文件就是正常没被压缩的，但此时又发现每次打包会生成一个版本的文件，这时候我们需要清除dist文件夹的插件, CleanWepackPlugin，安装

```bash
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
```bash
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
```bash
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
```bash
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
```bash
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

如果遇见图片，字体之类的文件，我们还需用到url-loader和file-loader，url-loader依赖于file-loader，主要区别是url-loader会把设置小于某个大小的文件压缩成base64：
```bash
npm install url-loader file-loader -D
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [{
      test: /\.(svg|png|jpg|jpeg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          name: 'imgs/[name].[hash:5].[ext]',
          limit: 1000 // 小于1000byte的会被转成base64
        }
      }]
    }]
  }
}
```

现在我们来看看Vue，要解析Vue文件，当然也是和其他文件一样，需要vue-loader。
这是[vue-loader](https://vue-loader.vuejs.org/zh/)的官方文档。

解析Vue文件需要的配置如下：
```bash
npm install vue-loader vue-template-compiler -D
```

然后安装Vue系列：
```bash
npm install vue vue-router -S
```
然后做以下配置，
新建App.vue，router.js，views/Home.vue，然后内容以及配置如下：

```js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // 基本配置省略
  module: {
    rules: [
      { 
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
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


## 优化 [优化版仓库](https://github.com/zyq190308/custom-webpack-vue/tree/optimize)

首先，我们不在使用npx webpack来构建了，我们用package.json里的scripts脚本来控制，如下：
```json
// package.json
{
  "scripts": {
    "build": "webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```
然后运行npm run build，结果跟原来一致。

在真实项目中，一般也不会只有一种环境，好的做法就是把配置文件区分开，
一般会分为三个配置文件：
1. webpack.base.config.js 公共配置，主要包括开发生产一些通用的loader和plugin等。
2. webpack.dev.config.js  开发配置，主要包括一些开发需要的服务器，代码调试等。
3. webpack.prod.config.js 生产配置，主要包括一些打包优化，代码抽离等。

再讲具体几个配置之前，我们来装一下webpack-merge：
```bash
# 合并配置文件的
npm install webpack-merge -D
```

先看看调整后的webpack.base.config.js：
```js
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(svg|png|jpg|jpeg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'imgs/[name].[hash:5].[ext]',
            limit: 1000
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new VueLoaderPlugin()
  ]
}
```

再看看webpack.dev.config.js，一般开发环境会装一个本地服务器：
```bash
npm install webpack-dev-server -D
```
这个插件会把文件打包到内存中，并且支持热更新和代理等等。


配置如下：
```js
// webpack.dev.config.js

const path = require('path')
const merge = require('webpack-merge');
const baseWebPackConfig = require('./webpack.base.config')

module.exports = merge(baseWebPackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map', // 主要是为了错误调试
  devServer: { // 这是webpack-dev-server的配置项
    contentBase: path.join(__dirname, 'dist'), //文件读取
    compress: true, // 压缩
    port: 9000, // 端口
    hot: true // 热更新
  }
})
```

我们再来看看webpack.prod.config.js，安装下面几个插件：
```bash
npm install mini-css-extract-plugin compression-webpack-plugin optimize-css-assets-webpack-plugin -D
```
mini-css-extract-plugin是把css文件从style头部抽离的插件
compression-webpack-plugin可以对打包的文件做gzip压缩
optimize-css-assets-webpack-plugin是对css做压缩处理
具体配置还是看相关插件的文档，配置太多，就不一一讲了。
```js
// webpack.prod.config.js

const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const merge = require('webpack-merge')
const baseWebPackConfig = require('./webpack.base.config')

module.exports = merge(baseWebPackConfig, {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all'
    }, // 详情看SplitChunkPlugin
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})], // 对css做压缩处理
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:5].css' ,
      chunkFilename: 'css/[id].[contenthash:5].css',
    }), // 主要是把css抽离一个单独的文件
    new CompressionPlugin({
      filename: '[path].gz[query]',
      test: new RegExp(
        '\\.(js|css)$'
      ),
      threshold: 10240,
      minRatio: 0.8
    }) // 对文件做gzip压缩
  ],
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }
    ],
  }
})
```

## 集成Eslint
在Vue中集成eslint，需要核心eslint,webpack中检查的eslint-loader, 检查Vue文件的的插件eslint-plugin-vue,第三方eslint规则库eslint-config-airbnb。
按如下安装
```bash
npm install eslint eslint-loader eslint-plugin-vue -D
npx install-peerdeps --dev eslint-config-airbnb
```
配置
```js
// webpack.dev.config.js
module: {
    rules: [
      { 
        enforce: 'pre',
        test: /\.(js|vue)/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ]
  }
```

根目录下新建.eslintrc文件
```js
{
  "extends": [
    "airbnb",
    "plugin:vue/recommended"
  ]
}
```
到此运行npm run dev就能按照上面配置的规则检查语法了。

你会发现运行后错误太多一个个改太麻烦，方法是有的，就是在git add后利用eslint自动修复错误。
安装插件
```bash
npm install husky lint-staged -D
```
然后在package.json配置如下：
```js
// package.json
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{vue,js}": [
      "eslint --fix",
      "git add"
    ]
  }
```
上面意思就是在你把代码提交到咱存后会自动帮你修复不符合规范的代码，到此eslint集成就OK了。

## 集成Prettier
上面的eslint只是代码错误检查工具，统一代码风格我们可以使用Prettier。
国际惯例，又是一顿装，如下：
```bash
npm i prettier eslint-config-prettier eslint-plugin-prettier --save-dev
```
然后在eslint配置文件配置如下
```js
// .eslintrc
{
  "extends": ["plugin:prettier/recommended"]
}
```
配合上面讲的，在提交代码前就可以自动format代码风格，以及代码检查。
具体Prettier用法，可移步[这里](/other/prettier.html)











