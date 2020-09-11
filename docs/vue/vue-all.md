# Vue3 全家桶

[代码仓库](https://github.com/zyq190308/Vue3Demo)

因为 vue-router,vuex 官方文档还不齐全,而且会存在版本不兼容问题。
vue-router4.x 版本在新仓库 vue-router-next,vuex4.x 版本在原有仓库 4.0 分支,然后在 package.json 里面安装最新的版本就不会存在版本问题。
废话不多说,直接安装:

```bash
npm install --save vue-router@4.0.0-beta.9
npm install --save vuex@4.0.0-beta.4
```

项目结构和 vue2.x 结构类似，只是写法有点差点，直接上代码。

## 入口

```js
import { createApp } from 'vue'

import App from './App.vue'
import router from './routers'
import store from './store'

const app = createApp(App)

app
  .use(router)
  .use(store)
  .mount('#root')
```

## routers

路由改成方法创建

```js
// routers/index.js
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
```

## store

store 也改成了方法创建,然后 store 取值方式变了一下。

```js
// store/index.js
import { createStore } from 'vuex'
import { INCREMENT, DECREMENT } from './mutation-types'

const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    [INCREMENT](state) {
      state.count++
    },
    [DECREMENT](state) {
      state.count--
    }
  },
  actions: {
    increment({ commit }) {
      commit('increment')
    },
    decrement({ commit }) {
      commit('decrement')
    }
  }
})

export default store
```

## store,router 基本使用

```vue
<!-- views/home.vue -->
<template>
  Home页
  {{ count }}
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
  <button @click="go">去about页</button>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()

    return {
      count: computed(() => store.state.count),
      increment: () => store.dispatch('increment'),
      decrement: () => store.dispatch('decrement'),
      go: () => router.push('/about')
    }
  }
}
</script>
```

<Vssue />
