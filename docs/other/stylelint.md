# stylelint

stylelint和eslint类似，只不过这个是用来检查css的规范的。

## 安装
```bash
npm install stylelint stylelint-config-standard --save-dev
```
## 配置
stylelint是负责解析的，stylelint-config-standard就是一套成熟的css解析规则，安装完后，在项目根目录新建配置文件。如下：
```json
{
  // .stylelintrc 文件名
  "extends": "stylelint-config-standard", // 定义好的一些规则
  "rules": {}, // 一些自定义规则
  "ignoreFiles": [] // 跳过解析的文件
}
```
## 检查
commandline 检查
```bash
# --fix可以自动修复，要看效果可以去掉
npx stylelint test.css --fix
```
代码提交检查，不清楚可以看看我的eslint配置。
```json
{
  "lint-staged": {
    "src/**/*.{vue,js}": [
      "eslint",
      "git add"
    ],
    "src/**/*.{vue,scss}": [
      "stylelint",
      "git add"
    ]
  }
}
```

