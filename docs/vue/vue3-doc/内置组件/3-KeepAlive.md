## `KeepAlive`

<KeepAlive> 是一个内置组件，它的功能是`在多个组件间动态切换时缓存被移除的组件实例`。

## 基本使用

在组件基础章节中，我们已经介绍了通过`特殊的 <component> 元素来实现动态组件`的用法：

```js
<component :is="activeComponent" />
```
默认情况下，一个组件实例在被替换掉后会被销毁。这会导致它丢失其中所有已变化的状态——当这个组件再一次被显示时，会创建一个只带有初始状态的新实例。

在下面的例子中，你会看到两个有状态的组件——A 有一个计数器，而 B 有一个通过 v-model 同步 input 框输入内容的文字展示。尝试先更改一下任意一个组件的状态，然后切走，再切回来：

你会发现在切回来之后，之前已更改的状态都被重置了。

在切换时创建新的组件实例通常是有意义的，但在这个例子中，我们的确想要组件能在被“切走”的时候保留它们的状态。要解决这个问题，我们`可以用 <KeepAlive> 内置组件将这些动态组件包装起来`：

```js
<!-- 非活跃的组件将会被缓存！ -->
<KeepAlive>
  <component :is="activeComponent" />
</KeepAlive>
```

```js
// App.vue
<script setup>
import { shallowRef } from 'vue'
import CompA from './CompA.vue'
import CompB from './CompB.vue'

const current = shallowRef(CompA)
</script>

<template>
  <div class="demo">
    <label><input type="radio" v-model="current" :value="CompA" /> A</label>
    <label><input type="radio" v-model="current" :value="CompB" /> B</label>
    <KeepAlive>
      <component :is="current"></component>
    </KeepAlive>
  </div>
</template>
```

```vue
// CompA.vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <p>Current component: A</p>
  <span>count: {{ count }}</span>
  <button @click="count++">+</button>
</template>
```

```vue
// CompB.vue
<script setup>
import { ref } from 'vue'
const msg = ref('')
</script>

<template>
  <p>Current component: B</p>
  <span>Message is: {{ msg }}</span>
  <input v-model="msg">
</template>
```
## TIP

在 `DOM 内模板`中使用时，它应该被写为`<keep-alive>`。

## `包含/排除`

`<KeepAlive> 默认会缓存内部的所有组件实例`，但我们`可以通过 include 和 exclude prop 来定制该行为`。这`两个 prop 的值都可以是一个以英文逗号分隔的字符串、一个正则表达式`，或是`包含这两种类型的一个数组`：

```js
<!-- 以英文逗号分隔的字符串 -->
<KeepAlive include="a,b">
  <component :is="view" />
</KeepAlive>

<!-- 正则表达式 (需使用 `v-bind`) -->
<KeepAlive :include="/a|b/">
  <component :is="view" />
</KeepAlive>

<!-- 数组 (需使用 `v-bind`) -->
<KeepAlive :include="['a', 'b']">
  <component :is="view" />
</KeepAlive>
```

它会根据组件的 name 选项进行匹配，所以组件如果想要条件性地被 KeepAlive 缓存，就必须显式声明一个 name 选项。

## TIP

在 3.2.34 或以上的版本中，使用 <script setup> 的单文件组件会自动根据文件名生成对应的 name 选项，无需再手动声明。

## 最大缓存实例数

我们可以`通过传入 `max prop` 来限制可被缓存的最大组件实例数。<KeepAlive> 的行为在指定了 max 后类似一个 LRU 缓存`：如果缓存的实例数量即将超过指定的那个最大数量，则最久没有被访问的缓存实例将被销毁，以便为新的实例腾出空间。

```js
<KeepAlive :max="10">
  <component :is="activeComponent" />
</KeepAlive>
```

## 缓存实例的生命周期

