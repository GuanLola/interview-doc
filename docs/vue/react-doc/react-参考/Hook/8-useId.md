## useId

useId 是一个 React Hook，可以生成传递给无障碍属性的唯一 ID。

```js
const id = useId();
```

## 参考
- useId()

## 用法
- 为无障碍属性生成唯一 ID
- 为多个相关元素生成 ID
- 为所有生成的 ID 指定共享前缀
- 在客户端和服务端上使用相同的 ID 前缀

## 参考

`useId()`

在组件的顶层调用`useId`生成唯一在`ID`：

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
}
```
请看下方更多示例。

## 参数

useId 不带任何参数。

## 返回值

useId 返回一个唯一的字符串 ID，与此特定组件中的 useId 调用相关联。


## 注意事项

- useId 是一个 Hook，因此你只能 在组件的顶层 或自己的 Hook 中调用它。你不能在内部循环或条件判断中调用它。如果需要，可以提取一个新组件并将 state 移到该组件中。

- useId 不应该被用来生成列表中的 key。key 应该由你的数据生成。

## 用法
## 陷阱

不要使用 useId 来生成列表中的 key。key 应该由你的数据生成。

## 为无障碍属性生成唯一 ID

在组件的顶层调用 useId 生成唯一 ID：

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
}
```

你可以将 生成的 ID 传递给不同的属性：

```js
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```
让我们通过一个例子，看看这个什么时候有用。

如 aria-describedby 这样的 HTML 无障碍属性 允许你指定两个标签之间的关系。例如，你可以指定一个元素（比如输入框）由另一个元素（比如段落）描述。

在常规的 HTML 中，你会这样写：

```js
<label>
  密码:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  密码应该包含至少 18 个字符
</p>
```
然而，在 React 中直接编写 ID 并不是一个好的习惯。一个组件可能会在页面上渲染多次，但是 ID 必须是唯一的！不要使用自己编写的 ID，而是使用 useId 生成唯一的 ID。

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        密码:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        密码应该包含至少 18 个字符
      </p>
    </>
  );
}
```
现在，即使 PasswordField 多次出现在屏幕上，生成的 ID 并不会冲突。

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        密码:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        密码应该包含至少 18 个字符
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>输入密码</h2>
      <PasswordField />
      <h2>验证密码</h2>
      <PasswordField />
    </>
  );
}

```

请看这个视频，了解辅助技术所提供的用户体验的差异。

## 陷阱

使用服务端渲染时，useId 需要在服务器和客户端上有相同的组件树。如果你在服务器和客户端上渲染的树不完全匹配，生成的 ID 将不匹配。

## 深入探讨

## 为什么 useId 比递增计数器更好？

你可能想知道为什么使用 useId 比增加全局变量（如 nextId++）更好。

useId 的主要好处是 React 确保它能够与 服务端渲染一起工作。在服务器渲染期间，你的组件生成输出 HTML。随后，在客户端，hydration 会将你的事件处理程序附加到生成的 HTML 上。由于 hydration，客户端必须匹配服务器输出的 HTML。

使用递增计数器很难保证这一点，因为客户端组件被激活处理后的顺序可能与服务器 HTML 的顺序不匹配。调用 useId 可以确保激活正常工作，以及服务器和客户端之间的输出相匹配。

在 React 内部，调用组件的“父路径”生成 useId。这就是为什么如果客户端和服务器的树相同，不管渲染顺序如何，“父路径”始终都匹配。

## 为多个相关元素生成 ID

如果你需要为多个相关元素生成 ID，可以调用 useId 来为它们生成共同的前缀：

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>名字：</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>姓氏：</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```
可以使你避免为每个需要唯一 ID 的元素调用 useId。

## 为所有生成的 ID 指定共享前缀

如果你在单个页面上渲染多个独立的 React 应用程序，请在 `createRoot` 或 `hydrateRoot` 调用中将 identifierPrefix 作为选项传递。这确保了由两个不同应用程序生成的 ID 永远不会冲突，因为使用 useId 生成的每个 ID 都将以你指定的不同前缀开头。

```html
// index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
// index.js
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```
```js
// App.js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('生成的 ID：', passwordHintId)
  return (
    <>
      <label>
        密码:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        密码应该包含至少 18 个字符
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>输入密码</h2>
      <PasswordField />
    </>
  );
}
```
## 在客户端和服务端上使用相同的 ID 前缀

如果你 `在同一页面上渲染多个独立的 React 应用程序`，并且其中一些应用程序是服务端渲染，请确保你在客户端向 hydrateRoot 调用传递的标识符前缀 identifierPrefix 与 你向 服务器 API  （如 renderToPipeableStream ）传递的标识符前缀 identifierPrefix 相同。

```js
// Server
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(
  <App />,
  { identifierPrefix: 'react-app1' }
);
```

```js
// Client
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(
  domNode,
  reactNode,
  { identifierPrefix: 'react-app1' }
);
```
如果页面上只有一个 React 应用程序，则无需传递 identifierPrefix。