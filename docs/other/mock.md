# Mock

mock的意思就是模拟，开发中为了在没有接口前快速开发，必要的数据模拟是很有必要的，接下来我会说说我了解的一些mock方法。
[代码地址](https://github.com/zyq190308/mock-demo)，master分支是mock-server,base是mockjs。

## mockjs

mockjs是一个mock的js库，能根据一些规则生成对应的数据。
一般我会在src同级目录下新建一个目录mock，结构差不多类似mock/json/*, mock/index.js,index.js里引入我们需要mock的url和匹配上的json文件，json文件是你mock的数据，然后在项目根目录main.js,根据环境来引入mock/index.js，不过这种的缺点是ajax请求被拦截了，浏览器看不到请求。

mock的json文件(mock/json/mock.json)
```json
{
	"err_code": 0,
	"err_msg": "",
	"payload": {
    "name": "mock",
    "age": 100,
    "like": "play mock"
  }
}
```

mock的index.js(mock/index.js)
```js
// package.json 里环境变量的配置
import Mock from 'mockjs'
Mock.mock('/mock', require('./json/mock.json'))
```

main.js(一般是入口文件)

```json
"scripts": {
  "mock": "NODE_ENV=mock vue-cli-service serve",
}
```
```js
if (process.env.NODE_ENV === 'mock') require('./mock')
```


## mock-server
mock-server顾名思义就是，跑一个真的web服务器来mock数据。

为了方便起见，我一般利用webpack集成好了的webpack-dev-server插件，内部本身就是express，
所以可以把它当做我们的服务器，然后配置如下：
```js
module.exports = {
  devServer: {
    // ....
    before (app) {
     // 这里就是我们需要做mock的地方
    }
  }
}
```
然后其实原理和普通的数据mock差不多一样，新建mock文件夹，然后在文件夹内写一些mock规则或者mock文件，大致如下（需要注意的因为这是配置文件，所以有改动的话需要重跑）:
```js
module.exports = {
  devServer: {
    // ....
    before (app) {
      mockFromFile(app) // 这种mock是直接读取文件
      // mockFromMock(app) // 这种mock是通过规则mock
    }
  }
}

const mockFromFile = (app) => {
  const dir = 'mock'
  const files = fs.readdirSync(path.join(__dirname, dir))
  files.forEach(file => {
    const reqUrl = '/' + file.split('.')[0]
    app.use(reqUrl, function (req, res) {
      res.json(JSON.parse(fs.readFileSync(path.join(dir, file)).toString()))
    })
  })
}

// const mockFromMock = (app) => {
//   app.use('/categary', (req,res) => {
//     res.json(mock.categary)
//   })
// }
```

当然也可以自己重写一个express服务器，或者网上有现成的，比如easy-mock，RAP等等大厂的线上mock-server，但是个人觉得那个不稳定性太差了。


## 代理软件映射本地文件

还有一种方案是用Charles或者fiddler之类的代理软件来映射本地文件来mock
