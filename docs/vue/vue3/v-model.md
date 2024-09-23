## 用

用宏: `defineModel()`

<!-- Child.vue -->
```vue
<script setup>
const model = defineModel()

function update() {
  model.value++
}
</script>

<template>
  <div>Parent bound v-model is: {{ model }}</div>
  <button @click="update">Increment</button>
</template>
```
-----------------------

父组件可以用`v-model`绑定一个值：

<!-- Parent.vue -->
```vue
<Child v-model="countModel" />
```

`defineModel()`返回的值是一个`ref`。
可以像别的`ref`一样被访问以及修改。

不过 它能起到 在父组件和当前变量 之间的双向绑定的作用：

- 它的`.value`和父组件的`v-model`的值同步；
- 当它被子组件变更了，会触发父组件绑定的值一起更新。

这意味着你也可以用`v-model`把这个`ref`绑定到一个原生`input`元素上，
在提供相同的`v-model`用法的同时轻松包装原生`input`元素：

```vue
<script setup>
const model = defineModel()
</script>

<template>
  <input v-model="model" />
</template
```
## 原理

是个 便利 宏。内容如下：

- 名为`modelValue`的`prop`。
本地`ref`的值跟这个`prop`同步。

- 有个`update:modelValue`事件。
本地`ref`值发生改变时触发。

<!-- Child.vue -->
```vue
<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="emit('update:modelValue', $event.target.value)"
  />
</template>
```
父组件`v-model="foo"`被编译为：
<!-- Parent.vue -->
```vue
<Child
  :modelValue="foo"
  @update:modelValue="$event => (foo = $event)"
/>
```

就是大白话，`defineModel`声明了一个`prop`。

可以定义传的东西，就是`prop`的选项：
```vue
// v-model必须填
const model = defineModel({ required: true })

// model默认值取0
const model = defineModel({ default: 0 })
```

-----------

给 `defineModel` 设置了 `default` 值.
但是父组件的`prop`没有任何值。
就会导致父子不一致。

父的`myRef`是`undefined`。
子的是1。

```vue
// 子
const model = defineModel({ default； 1 })

// 父
const myRef = ref()

<Child v-model="myRef"></Child>
```
-----------

`v-model`的参数。

```vue
<MyComponent v-model:title="bookTitle" />
```
在子组件中。
通过字符串作为第一个参数传递给`defineModel()`去支持相应的参数：

```js
// MyComponent.vue
<script>
const title = defineModel('title')
</script>

<template>
  <input type="text" v-model="title" />
</template>
```

prop如果要设置其他的东西就是这样写:
```js
const title = defineModel('title', { required: true })
```

## 多个`v-model`绑定

利用刚才在`v-model`的参数学到的。
指定参数。
事件名。
这两个。

可以在单个组件实例上创建多个`v-model`双向绑定。

组件上 每个`v-model`都会同步不同的`prop`,
不需要配其他选项。
```js
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```

```js
<script setup>
const firstName = defineModel('firstName')
const lastName = defineModel('lastName')
</script>

<template>
  <input type="text" v-model="firstName" />
  <input type="text" v-model="lastName" />
</template>
```
------------

## 修饰符

`v-model`一些内置修饰符。比如：
`.trim`。
`.number`。
`.lazy`。

要定义组件`v-model`支持自定义的修饰符。

创建一个自定义的修饰符`capitalize`。
自动将`v-model`绑定输入的字符串值第一个字母转为大写：
```js
<MyComponent v-model.capitalize="myText" />
```
解构`defineModel()`的返回值。
可以在子组件中访问添加到组件`v-model`的修饰符:
```js
<script setup>
const [model, modifiers] = defineModel()
console.log(modifiers) // { capitalize: true }
</script>

<template>
  <input type="text" v-model="model" />
</template>
```
给`defineModel()`做`get`和`set`这两选项。
通过这种方式去处理值。

利用`set`选项去应用`capitalize`（首字母大写）修饰符：

```js
<script setup>
const [model, modifiers] = defineModel({
  set(value) {
    if (modifiers.capitalize) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    return value
  }
})
</script>

<template>
  <input type="text" v-model="model" />
</template>
```

多个参的修饰符的情况。

```js
<UserName
  v-model:first-name.capitalize="first"
  v-model:last-name.uppercase="last"
/>

<script setup>
const [firstName, firstNameModifiers] = defineModel('firstName')
const [lastName, lastNameModifiers] = defineModel('lastName')

console.log(fistNameModifiers) // { capitalize: true }
console.log(lastNameModifiers) // { uppercase: true }
</script>
```


