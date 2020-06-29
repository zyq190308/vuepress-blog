# Vue中'>>>'的用法

[相关链接](https://github.com/vuejs/vue-loader/releases/tag/v12.2.0)

## v-html样式问题
[官方建议](https://cn.vuejs.org/v2/api/#v-html)
一般情况下，直接在父元素如下设置是不起作用的
```vue{6}
<template>
  <div class="test" v-html="txts"></div>
</template>

<style lang="scss" scoped>
.test .num{
  color: purple;
}
</style>
```
正确写法是：
```vue{6}
<template>
  <div class="test" v-html="txts"></div>
</template>

<style lang="scss" scoped>
.test >>> .num{
  color: purple;
}
</style>
```

## 组件库样式重写问题
在scoped下直接重写组件库样式是无效的，通常我们是在Vue文件里再添加一个style标签不加scoped，但这样不够优雅，用'>>>'写更好。

```vue{18}
<template>
  <div class='wrap'>
    <el-input v-model="input" placeholder="请输入内容"></el-input>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        input: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
.wrap >>> .el-input__inner {
  border: 1px solid #000;
}
</style>

```




