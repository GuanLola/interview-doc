## 组件 `v-model`

## 基本用法

`v-model`可以在组件上使用以实现`双向`绑定。

从`Vue 3.4`开始，推荐的实现方式是使用`defineModel()`宏：

```vue
<!-- Child.vue -->
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

父组件可以用`v-model`绑定一个值：

```vue
<!-- Parent.vue -->
<Child v-model="countModel" />
```
`defineModel()`返回的值是一个`ref`。它可以像其它`ref`一样被访问以及修改，