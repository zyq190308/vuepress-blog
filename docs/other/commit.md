# git commit规范
为了团队更合理，做了一下简单的提交规范。

## commitlint 
commitlint和eslint类似，commitlint是用来规范提交规范的。
一般的提交规范类似：
```bash
type(scope?): subject
```
type 代表提交的类型；scope是可选的，代表提交的范围模块；subject代表这次提交的具体内容。

## 常见的type
- build：代码已构建
- ci：持续集成
- chore：构建或工具变动
- docs：文档
- feat：新功能
- fix：修复bug
- perf：性能
- refactor：重构代码
- revert：回退
- style：格式，不影响代码功能
- test：测试

## 安装
安装cli工具，然后安装@commitlint/config-conventional规范。
```bash
npm install --save-dev @commitlint/{config-conventional,cli}
```

## 提交commit检查
安装husky，监听提交
```bash
npm install husky --save-dev
```
然后在package.json中写入如下：
```json
// package.json
"husky": {
  "hooks": {
    "commit-msg": "commitlint -E HUSKY_GIT_PARAMS",
  }
}
```
至此最简单的提交lint就好了。

## 自定义commilint
在根目录新建配置文件<code>commitlint.config.js</code>

大致结构如下：
```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'], // 这个就是我们上面安装的开源的规范
  rules: {
    'type-enum': [ // 配置的具体规则（这里是提交的type）
			2, // 报错级别 0为disable，1为warning，2为error 就是检查的级别
			'always', // 可选always|never 是否应用
      [ 
        // 枚举的type值，不在下面的都报错，你随便写个helloworld都行
				'build',
				'chore',
				'ci',
				'docs',
				'feat',
				'fix',
				'perf',
				'refactor',
        'revert',
        'style',
        'test',
			]
		]
  }
}
```
上面只是举了一个配置，配置差不多，只是含义不一样，详细配置看：
[详细配置](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)


<Vssue />