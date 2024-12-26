onToggleComponent

切 父传过来的 props

封hook

并给 onToggleComponent 去 切

---

调 hook 拿 公共状态。

用一个动态组件把窗 弹出来，

并绑 对应状态和事件。

---

多弹窗。

不封hook，就写很多重复的代码。

---

`公共状态`

## 共享状态。

1、props、emit （父与子 共享）。

2、provide、inject （多层组件，多组件）。

3、用状态库，如：`vuex` 和 `pinia`

4、发订阅

---

用`vueuse`的一个创全局状态的 hook ------ `createGlobalState`

## createGlobalState

what is it？
将状态保留在全局范围内，
以便可以跨 `Vue` 实例重用。

## how to use it?

example:

```js
import { } from '@vueuse/core'

// store.js
import { computed, ref } from 'vue'

export const useGlobalState = createGlobalState(
  () => {
    // state
    const count = ref(0)

    // getters
    const doubleCount = computed(() => count.value * 2)

    // actions
    function increment() {
      count.value++
    }

    return { count, doubleCount, increment }
  }
)
```

别的组件 可 通过 调 `useGlobalState`拿`count`、`doubleCount`、`increment`这三个玩意。
从而实现状态共享。

---

`useGlobalState`这个东西的源码：

`vueuse/packages/shared/createGlobalState/index.ts`

```js
// index.ts
import type { AnyFn } from '../utils'
import { effectScope } from 'vue'

/**
 * Keep states in the global scope to be reuseable across Vue instances.
 *
 * @see https://vueuse.org/createGlobalState
 * @param stateFactory A factory function to create the state
 */

export function createGlobalState<Fn extends AnyFn>(
  stateFactory: Fn,
): Fn {
  let initialized = false
  let state: any

  const scope = effectScope(true)

  return ((...args: any[]) => {
    if (!initialized) {
      state = scope.run(() => stateFactory(...args))!
      initialized = true
    }
    return state
  }) as Fn

}
```

## effectScope


what is it?

创一个 effect 域，
可以拿到创的`响应式副作用`（也就是 watch 听的东西 和 computed 算的东西），
拿到这些东西一起处理。

```js
// 类型
function effectScope(detached?: boolean): EffectScope

interface EffectScope {
  run<T>(fn: () => T): T | undefined // 如果作用域不活跃就为 undefined
  stope(): void
}
```

```js
// 示例
const scope = effectScope()

scope.run(() => {
  const doubled = computed(() => counter.value * 2)

  watch(doubled, () => console.log(doubled.value))

  watchEffect(() => console.log('Count: ', doubled.value))

})

// 处理掉当前作用域内的所有 effect
scope.stop()
```

`effectScope`函数会返回一个作用域对象，
对象有 `run`方法、`stop`方法。

1、`run`
接一个`状态工厂函数`。
统一收 内部建的依赖到一个作用域内。

2、`stop`
调`stop`函数 干完 当前作用域内 所有 `effect`。停掉追踪状态变化。

## 想

`effectScope` 的功能 是`1、手动统一收集依赖；2、统一停止追踪依赖变化`。

vueuse 用 vue 的 `effectScope` 去收集依赖，

`createGlobalState`又没有用到 `stop`去停。

想一想：

不用停止追踪，
那
统一收集到一个作用域
有啥用？

直接一个闭包也可以实现同效果。

看看
`闭包`
和
`effectScope`
实现方式的对比：

```js
// createGlobalState (vueuse 源码)

type AnyFn = (...args: any[]) => any
export function createGlobalState<Fn extends AnyFn>(stateFactory: Fn): Fn {
  let initialized = false
  let state: any
  const scope = effectScope(true)

  return ((...args: any[]) => {
    if (!initialized) {
      state = scope.run(() => stateFactory(...args))!
      initialized = true
    }
    return state
  }) as Fn
}
```

## myCreateGlobalState (闭包实现)

```js

function myCreateGlobalState<Fn extends AnyFn>(stateFactory: Fn): Fn {
  const state = stateFactory()
  return (() => state) as Fn
}
```

## 两种实现的使用示例

```js
// vueuse createGlobalState

export const useGlobalState = createGlobalState(() => {
  () => {
    // state
    const count = ref(0)

    // getters
    const doubleCount = computed(() => count.value * 2)

    // actions
    function increment() {
      count.value++
    }

    return { count, doubleCount, increment }
  }
})


// 闭包方式
export const useGlobalState = myCreateGlobalState(
  () => {
    // state
    const count = ref(0)

    // getters
    const doubleCount = computed(() => count.value * 2)

    // actions
    function increment() {
      count.value++
    }

    return { count, doubleCount, increment }
  }
)
```

说话。

`vueuse`通过`vue`的`effectScope`实现了`createGlobalState`。

写来做 全局状态的 仓库的。

给多个组件拿来用的。

但 `effectScope` 的最大用处可能就是 `停止追踪依赖变化`。

`createGlobalState` 拿来全局共用仓库，不用来追踪依赖。

那就没必要用`effectScope`，

简单的闭包石厦就可以。

--------


最近刚入职一家公司，在项目中发现了一个非常巧妙的展示弹窗的方式：
首先我们想想，不管一个弹窗长什么样子，它都会有一个控制显示的 visible，父组件传进来的 props，还有就是 弹窗组件本身，基于这一点我的这位同事把它们封装到一个 hook 当中，并且暴露一个 onToggleComponent 方法切换组件。然后在一个公共组件内调用这个 hook 拿到这些公共状态，再用一个动态组件把这个弹窗显示出来，并且绑定对应的状态与事件。
我还真没这样用过，可能是之前接触到的项目太小，一个页面内也就那几个弹窗，不像现在有十几个弹窗，如果不封装 hook，光这些弹窗的显示逻辑都要占几十行代码了，还都是重复的。不得不说，这种方式确实是妙！👍
细心的 jym 已经发现这其中涉及到一个问题：公共状态
那么在 vue 项目中，当我们有很多组件需要共享状态时，你能想到几种方式？
