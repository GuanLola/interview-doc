## `Suspense`

## 实验性功能

`<Suspense> 是一项实验性功能。它不一定会最终成为稳定功能，并且在稳定之前相关 API 也可能会发生变化。`

`<Suspense> 是一个内置组件，用来在组件树中协调对异步依赖的处理。它让我们可以在组件树上层等待下层的多个嵌套异步依赖项解析完成，并可以在等待时渲染一个加载状态。`

## `异步依赖`

`要了解 <Suspense> 所解决的问题和它是如何与异步依赖进行交互的`，我们需要想象这样一种`组件层级结构`：

```js
<Suspense>
└─ <Dashboard>
   ├─ <Profile>
   │  └─ <FriendStatus>（组件有异步的 setup()）
   └─ <Content>
      ├─ <ActivityFeed> （异步组件）
      └─ <Stats>（异步组件）
```


在这个组件树中有多个嵌套组件，要渲染出它们，首先得解析一些异步资源。`如果没有 <Suspense>，则它们每个都需要处理自己的加载、报错和完成状态。在最坏的情况下，我们可能会在页面上看到三个旋转的加载态，在不同的时间显示出内容。`

`有了 <Suspense> 组件后，我们就可以在等待整个多层级组件树中的各个异步依赖获取结果时，在顶层展示出加载中或加载失败的状态。`

`<Suspense> 可以等待的异步依赖有两种`：

1、带有异步 setup() 钩子的组件。这也包含了使用 <script setup> 时有顶层 await 表达式的组件。

2、异步组件。

## `async setup()​`

`组合式 API 中组件的 setup() 钩子可以是异步的：`

```js
export default {
  async setup() {
    const res = await fetch(...)
    const posts = await res.json()
    return {
      posts
    }
  }
}
```
`如果使用 <script setup>，那么顶层 await 表达式会自动让该组件成为一个异步依赖`：

```js
<script setup>
const res = await fetch(...)
const posts = await res.json()
</script>

<template>
  {{ posts }}
</template>
```
## 异步组件

异步组件默认就是“suspensible”的。`这意味着如果组件关系链上有一个 <Suspense>，那么这个异步组件就会被当作这个 <Suspense> 的一个异步依赖。`在这种情况下，`加载状态是由 <Suspense> 控制，而该组件自己的加载、报错、延时和超时等选项都将被忽略`。

异步组件也可以通过在选项中指定 suspensible: false 表明不用 Suspense 控制，并让组件始终自己控制其加载状态。

## 加载中状态

`<Suspense> 组件有两个插槽：#default 和 #fallback`。两个插槽都只允许一个直接子节点。在可能的时候都将显示默认插槽中的节点。否则将显示后备插槽中的节点。

```vue
<Suspense>
  <!-- 具有深层异步依赖的组件 -->
  <Dashboard />

  <!-- 在 #fallback 插槽中显示 “正在加载中” -->
  <template #fallback>
    Loading...
  </template>
</Suspense>
```
`在初始渲染时，<Suspense> 将在内存中渲染其默认的插槽内容`。如果在这个过程中遇到任何异步依赖，则会进入挂起状态。在挂起状态期间，展示的是后备内容。`当所有遇到的异步依赖都完成后，<Suspense> 会进入完成状态，并将展示出默认插槽的内容。`

`如果在初次渲染时没有遇到异步依赖，<Suspense> 会直接进入完成状态。`

`进入完成状态后，只有当默认插槽的根节点被替换时，<Suspense> 才会回到挂起状态`。组件树中新的更深层次的异步依赖不会造成 <Suspense> 回退到挂起状态。

发生回退时，后备内容不会立即展示出来。`相反，<Suspense> 在等待新内容和异步依赖完成时，会展示之前 #default 插槽的内容`。这个行为可以通过一个 timeout prop 进行配置：`在等待渲染新内容耗时超过 timeout 之后，<Suspense> 将会切换为展示后备内容`。若 timeout 值为 0 将导致在替换默认内容时立即显示后备内容。

## 事件​

`<Suspense> 组件会触发三个事件：pending、resolve 和 fallback`。`pending` 事件是在进入挂起状态时触发。pending 事件是在进入挂起状态时触发。resolve 事件是在 default 插槽完成获取新内容时触发。fallback 事件则是在 fallback 插槽的内容显示时触发。

例如，可以使用这些事件在加载新组件时在之前的 DOM 最上层显示一个加载指示器。

## 错误处理​

`<Suspense> 组件自身目前还不提供错误处理`，不过你可以使用 errorCaptured 选项或者 onErrorCaptured() 钩子，`在使用到 <Suspense> 的父组件中捕获和处理异步错误`。

## 和其他组件结合

我们常常会将 `<Suspense> 和 <Transition>、<KeepAlive> 等组件结合`。要保证这些组件都能正常工作，嵌套的`顺序非常重要`。

`另外，这些组件都通常与 Vue Router 中的 <RouterView> 组件结合使用。`

下面的示例展示了`如何嵌套这些组件，使它们都能按照预期的方式运行`。下面的示例展示了如何嵌套这些组件，使它们都能按照预期的方式运行。

```html
<RouterView v-slot="{ Component }">
  <template v-if="Component">
    <Transition mode="out-in">
      <KeepAlive>
        <Suspense>
          <!-- 主要内容 -->
          <component :is="Component"></component>

          <!-- 加载中状态 -->
          <template #fallback>
            正在加载...
          </template>
        </Suspense>
      </KeepAlive>
    </Transition>
  </template>
</RouterView>
```

`Vue Router 使用动态导入对懒加载组件进行了内置支持。这些与异步组件不同，目前他们不会触发 <Suspense>。但是，它们仍然可以有异步组件作为后代，这些组件可以照常触发 <Suspense>`。

## 嵌套使用

仅在 3.3+ 支持

当我们有多个类似于下方的异步组件 (常见于嵌套或基于布局的路由) 时：

```html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <component :is="DynamicAsyncInner" />
  </component>
</Suspense>
```

`<Suspense> 创建了一个边界`，它将如预期的那样解析树下的所有异步组件。`然而，当我们更改 DynamicAsyncOuter 时，<Suspense> 会正确地等待它，但当我们更改 DynamicAsyncInner 时，嵌套的 DynamicAsyncInner 会呈现为一个空节点，直到它被解析为止 (而不是之前的节点或回退插槽)。`

为了解决这个问题，我们`可以使用嵌套的方法来处理嵌套组件的补丁`，就像这样：

```html
<Suspense>
  <component :is="DynamicAsyncOuter">
    <Suspense suspensible> <!-- 像这样 -->
      <component :is="DynamicAsyncInner" />
    </Suspense>
  </component>
</Suspense>
```
`如果你不设置 suspensible 属性，部的 <Suspense> 将被父级 <Suspense> 视为同步组件。这意味着它将会有自己的回退插槽，如果两个 Dynamic 组件同时被修改，则当子 <Suspense> 加载其自己的依赖关系树时，可能会出现空节点和多个修补周期，这可能不是理想情况。设置后，所有异步依赖项处理都会交给父级 <Suspense> (包括发出的事件)，而内部 <Suspense> 仅充当依赖项解析和修补的另一个边界。`

-----------
Suspense 是 Vue 3 中引入的一个新特性，用于处理异步组件的加载状态。它允许你在异步组件加载完成之前显示一个后备内容（fallback content），比如`加载动画或占位符`。以下是一些真实案例和代码示例，帮助你理解 Suspense 的用法。

## 1. 基本用法

假设你有一个异步组件 AsyncComponent.vue，它在加载数据时需要一些时间。你可以使用 Suspense 来在加载过程中显示一个加载动画。

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);

export default {
  components: {
    AsyncComponent
  }
};
</script>
```
2. 结合 async setup 使用

`Vue 3 的 setup 函数可以是一个异步函数。你可以结合 Suspense 来处理异步数据的加载`。

```vue
<template>
  <Suspense>
    <template #default>
      <UserProfile :user="user" />
    </template>
    <template #fallback>
      <div>Loading user profile...</div>
    </template>
  </Suspense>
</template>

<script>
import { ref } from 'vue';
import UserProfile from './UserProfile.vue';

export default {
  components: {
    UserProfile
  },
  async setup() {
    const user = ref(null);

    // 模拟异步数据加载
    const response = await fetch('/api/user');
    user.value = await response.json();

    return {
      user
    };
  }
};
</script>
```
`在这个例子中，setup 函数是异步的，它会等待用户数据加载完成后才渲染 UserProfile 组件。在数据加载期间，Suspense 会显示 "Loading user profile..."`。

3. 多个异步组件

你可以使用 Suspense 来处理多个异步组件的加载状态。

```vue
<template>
  <Suspense>
    <template #default>
      <div>
        <AsyncComponent1 />
        <AsyncComponent2 />
      </div>
    </template>
    <template #fallback>
      <div>Loading components...</div>
    </template>
  </Suspense>
</template>

<script>
import { defineAsyncComponent } from 'vue';

const AsyncComponent1 = defineAsyncComponent(() =>
  import('./AsyncComponent1.vue')
);

const AsyncComponent2 = defineAsyncComponent(() =>
  import('./AsyncComponent2.vue')
);

export default {
  components: {
    AsyncComponent1,
    AsyncComponent2
  }
};
</script>
```
在这个例子中，AsyncComponent1 和 AsyncComponent2 都是异步加载的组件。Suspense 会等待所有组件加载完成后才显示它们，否则会显示 "Loading components..."。

4. 错误处理

Suspense 还可以与 onErrorCaptured 结合使用，以捕获异步组件加载过程中的错误。

```vue
<template>
  <Suspense @error="handleError">
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { defineAsyncComponent, ref } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./AsyncComponent.vue')
);

export default {
  components: {
    AsyncComponent
  },
  setup() {
    const error = ref(null);

    const handleError = (err) => {
      error.value = err;
      console.error('Error loading component:', err);
    };

    return {
      handleError,
      error
    };
  }
};
</script>
```
在这个例子中，如果 AsyncComponent 加载失败，handleError 函数会被调用，并且你可以根据需要处理错误。

5. 嵌套 Suspense

你可以在一个 Suspense 中嵌套另一个 Suspense，以处理更复杂的异步加载场景。

```vue
<template>
  <Suspense>
    <template #default>
      <AsyncComponent1 />
      <Suspense>
        <template #default>
          <AsyncComponent2 />
        </template>
        <template #fallback>
          <div>Loading AsyncComponent2...</div>
        </template>
      </Suspense>
    </template>
    <template #fallback>
      <div>Loading AsyncComponent1...</div>
    </template>
  </Suspense>
</template>

<script>
import { defineAsyncComponent } from 'vue';

const AsyncComponent1 = defineAsyncComponent(() =>
  import('./AsyncComponent1.vue')
);

const AsyncComponent2 = defineAsyncComponent(() =>
  import('./AsyncComponent2.vue')
);

export default {
  components: {
    AsyncComponent1,
    AsyncComponent2
  }
};
</script>
```
在这个例子中，AsyncComponent1 和 AsyncComponent2 分别有自己的加载状态。Suspense 会分别处理它们的加载状态。

总结
Suspense 是 Vue 3 中处理异步组件加载的强大工具。它不仅可以简化异步组件的加载逻辑，还可以通过 fallback 和错误处理机制提升用户体验。通过以上示例，你可以更好地理解如何在项目中使用 Suspense。