# Vue组件的通信方式

## 父子组件通信

父传子通过props，子传父通过emit。A是父组件，B是子组件。

### 父传子
```js
// A.vue
<template>
  <div>
    A 组件
    <B froma="父组件的数据"/>
  </div>
</template>

<script>
  import B from './B.vue'
  export default {
    components: {
      B
    }
  }
</script>


// B.vue
<template>
  <div>
    B组件-{{froma}}
  </div>
</template>

<script>
  export default {
    props: ['froma']
  }
</script>
```

### 子传父
```js
// A.vue
<template>
  <div>
    A 组件 - {{fromb}}
    <B @fromb="handleData"/>
  </div>
</template>

<script>
  import B from './B.vue'
  export default {
    data () {
      return {
        fromb: ''
      }
    },
    components: {
      B
    },
    methods: {
      handleData (data) {
        console.log(data)
        this.fromb = data
      }
    }
  }
</script>

// B.vue
<template>
  <div>
    B组件
    <button @click="sendData">发送数据</button>
  </div>
</template>

<script>
  export default {
    methods: {
      sendData () {
        this.$emit('fromb', 'i am from b')
      }
    }
  }
</script>
```

## 多层级组件通信

### $attrs/$listeners
假设我们有A，B，C三个组件，分别是爷子孙。如果我要把数据从A传给C，平时我们再不用vuex的前提下，一般就是通过A->B，然后B->C，中间B只是个中间传递的角色，B还要一个个接收，明显很冗余麻烦，$attrs和$listeners就是解决这个的。$attrs负责属性传递，$listeners负责事件传递。

```js
// A.vue
<template>
  <div>
    A 组件
    <B :msg="msg" @handleClick="handleClick"/>
  </div>
</template>

<script>
  import B from './B.vue'
  export default {
    data () {
      return {
        msg: '数据'
      }
    },
    components: {
      B
    },
    methods: {
      handleClick () {
        alert('clicked')
      }
    }
  }
</script>
```

```js
// B.vue
<template>
  <div>
    B组件
    <C v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<script>
  import C from './C.vue'
  export default {
    components: {
      C
    }
  }
</script>
```

```js
// C.vue
<template>
  <div>
    C组件 {{msg}}
    <button @click="handleClick">点击</button>
  </div>
</template>

<script>
  export default {
    props: ['msg'],
    methods: {
      handleClick () {
        this.$emit('handleClick')
      }
    }
  }
</script>
```

如上，A组件传递了msg变量，监听了handleClick事件，B组件负责承载A传过来的属性和事件，C就能直接获取属性msg和触发handleClick事件。

### provide/inject
这个官方建议是最好用在高阶插件/组件库提供用例，并不推荐直接用于应用程序代码中。

举个例子，有三个组件A，B，C分别代表爷，子，孙，爷提供的数据，它的后代都能收到。

```js {12,33,49}
// A.vue
<template>
  <div>
    A 组件
    <B />
  </div>
</template>

<script>
  import B from './B.vue'
  export default {
    provide: {
      data: '祖先的数据'
    },
    components: {
      B
    }
  }
</script>


// B.vue
<template>
  <div>
    B组件 {{data}}
    <C />
  </div>
</template>

<script>
  import C from './C.vue'
  export default {
    inject: ['data'],
    components: {
      C
    }
  }
</script>

// C.vue
<template>
  <div>
    C组件 {{data}}
  </div>
</template>

<script>
  export default {
    inject: ['data']
  }
</script>
```

## EventBus
在项目不复杂的情况下，这是一种不错的跨组件通信，而无需引入vuex，前提是项目不复杂，开发者少的情况，否则就会很容易出现输数据散落的到处都是。
用法如下：同一层级下新建A.vue，B.vue，C.vue，bus.js

```js
// bus.js
import Vue from 'vue'
export default new Vue()
```
```js
// A.vue
<template>
  <div>
    A 组件
    <B />
    <C />
    <button @click="sendData">发送数据</button>
  </div>
</template>

<script>
  import Bus from './bus.js'
  import B from './B.vue'
  import C from './C.vue'
  export default {
    components: {
      B,
      C
    },
    methods: {
      sendData () {
        Bus.$emit('send', 'hello world')
      }
    }
  }
</script>
```

```js
// B.vue
<template>
  <div>
    B组件 {{data}}
  </div>
</template>

<script>
  import Bus from './bus.js'
  export default {
    data () {
      return {
        data: 'B:'
      }
    },
    mounted() {
      Bus.$on('send', data => {
        this.data += data
      })
    },
  }
</script>
```

```js
// C.vue
<template>
  <div>
    C组件 {{data}}
  </div>
</template>

<script>
  import Bus from './bus.js'
  export default {
    data () {
      return {
        data: 'C:'
      }
    },
    mounted() {
      Bus.$on('send', data => {
        this.data += data
      })
    },
  }
</script>
```


## vuex
这个是终极方案，在项目很大的时候这个是最佳选择，这个就不多赘述了，最佳资料见[官网](https://vuex.vuejs.org/zh/)



