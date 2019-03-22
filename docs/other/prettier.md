# Prettier

Prettier 也是一个代码格式化的工具。

## 安装

yarn 安装

```shell
yarn add prettier --dev --exact
# or globally
yarn global add prettier
```

npm 安装

```shell
npm install --save-dev --save-exact prettier
# or globally
npm install --global prettier
```

## 配置

在项目根目录新建.prettierrc 文件，此文件是覆盖一些重写配置的位置，prettier 默认会根据你的文件自动来加上一套代码规范。

```json
{
  "trailingComma": "es5", //句尾逗号
  "tabWidth": 4, // tab空格
  "semi": false, // 分号
  "singleQuote": true // 单引号
}
```

## 运行 prettier

1. 直接指定文件
2. githook

### 指定文件

```shell
prettier --write 'src/**/*.{css,js}'
```

### githook

安装依赖

```shell
npm install lint-staged husky --save-dev
```

然后把下面配置配在 package.json:

```json
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "src/**/*.{css,js,vue}": ["prettier --write", "git add"]
  },
```

## 其他

prettier 也有插件，可以实现保存自动格式化，也有忽略文件.prettierignore
