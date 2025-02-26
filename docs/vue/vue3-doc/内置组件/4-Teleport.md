## `Teleport`

`<Teleport> 是一个内置组件，它可以将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去`。

## `基本用法`

有时我们可能会遇到这样的场景：一个组件模板的一部分在逻辑上从属于该组件，但从整个应用视图的角度来看，它在`DOM`中应该被渲染在整个`Vue`应用外部的其他地方。

`这类场景最常见的例子就是全屏的模态框`。`理想情况下，我们希望触发模态框的按钮和模态框本身是在同一个组件中，因为它们都与组件的开关状态有关`。但这意味着`该模态框将与按钮一起渲染在应用 DOM 结构里很深的地方`。`这会导致该模态框的 CSS 布局代码很难写`。

试想下面这样的 HTML 结构：

```html
<div class="outer">
  <h3>Tooltips with Vue 3 Teleport</h3>
  <div>
    <MyModal />
  </div>
</div>
```

`接下来我们来看看 <MyModal> 的实现`：

```html
<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">Open Modal</button>

  <div v-if="open" class="modal">
    <p>Hello from the modal!</p>
    <button @click="open = false">Close</button>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 999;
  top: 20%;
  left: 50%;
  width: 300px;
  margin-left: -150px;
}
</style>
```
`这个组件中有一个 <button> 按钮来触发打开模态框，和一个 class 名为 .modal 的 <div>，它包含了模态框的内容和一个用来关闭的按钮。`



