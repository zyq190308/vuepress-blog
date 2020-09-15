# dotenv 管理环境变量

不知何时开始，不管是 vue-cli，还是 create-react-app 脚手架，你会发现文档里都出现了.env 这个文件，官方都推荐用这种方式来管理不同环境下的环境变量，今天我们开始自己一步步实现这个功能。

## 安装

dotenv 是管理环境变量的库，dotenv-expand 是增强的插件（覆盖已存在的全局环境变量）。

```bash
npm i -D webpack webpack-cli webpack-dev-server dotenv html-webpack-plugin
```

安装完后，先大致看一下项目目录结构

```
.
├── .env
├── .env.development
├── .env.production
├── dist
│   ├── index.html
│   └── main.c81cad317a55a81b522f.js
├── index.html
├── package.json
├── src
│   └── main.js
└── webpack.config.js
```

## webpack 配置文件

这里是打包的配置文件，从这里我们可以通过设置不同的环境变量来读取环境变量。
从 webpack4.x 开始，通过设置<code>mode:'developmet'|'production'</code>，就可以读取到 <code>process.env.NODE_ENV</code>的值，我们就可以根据这个值来新建如上目录的几个配置文件，然后通过<code>dotenv</code>读取配置文件就可以自动把我们需要的变量注入到<code>process.env.NODE_ENV</code>中，然后通过<code>webpack.DefinePlugin</code>注入到 web 环境。

```js
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 这里设置NODE_ENV，是因为这里不同环境的环境变量暂时还读不到(设置process.env.NODE_ENV = 'production'就读取.env.production)
process.env.NODE_ENV = 'development'

const NODE_ENV = process.env.NODE_ENV

// 根据环境来读取配置文件（本地环境和对应的环境）
const dotenvFiles = [`.env.${NODE_ENV}.local`, `.env.${NODE_ENV}`].filter(
  Boolean
)

// 遍历文件注入所有环境变量（这里就把配置文件的变量注入到process.env中了，只是node环境可访问）
dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require('dotenv').config({
      path: dotenvFile
    })
  }
})

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js'
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  // 这里的东西必须加（防止dotenv依赖的node模块找不到报错）
  node: {
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new webpack.DefinePlugin({
      // 如果需要web环境也能访问，必须用这个插件注入
      'process.env': JSON.stringify(process.env)
    })
  ]
}
```

## 其他配置文件

```json
// package.json
{
  "name": "dotenv-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --color --progress"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "dotenv": "^8.2.0",
    "html-webpack-plugin": "^4.4.1"
  }
}
```

.env

```
BASE_URL=https://api.development.com
```

.env.development

```
BASE_URL=https://api1.development.com
```

.env.production

```
BASE_URL=https://api2.development.com
```

```js
// main.js
console.log('接口地址', process.env.BASE_URL)
```

通过修改 webpack.config.js 中 NODE_ENV 的值，就可以根据不同的值读取不同的文件。
eg：<code>process.env.NODE_ENV = 'development'</code>读的就是<code>.env.development</code>，
<code>process.env.NODE_ENV = 'production'</code>读的就是<code>.env.production</code>

<Vssue />
