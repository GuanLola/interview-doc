## state 如同一张快照

也许 state 变量看起来和一般的可读写的 JavaScript 变量类似。但`state`在其表现出的特性上更像是一张快照。设置它不会更改你已有的 state 变量，但会触发重新渲染。

## 你将会学习到

- 设置 state 如何导致重新渲染

- state 在何时以何种方式更新

- 为什么 state 不在设置后立即更新

- 事件处理函数如何获取 state 的一张“快照”

## 设置 state 会触发渲染

你可能会认为你的用户界面会直接对点击之类的用户输入做出响应并发生变化。在 React 中，它的工作方式与这种思维模型略有不同。在上一页中，你看到了来自 React 的 [`设置 state 请求重新渲染`](https://zh-hans.react.dev/learn/render-and-commit#step-1-trigger-a-render)。这以为这要使界面对输入做出反应，你需要设置其 state。

在这个例子中，当你按下“send”时， `setIsSent(true)`会通知 React 重新渲染 UI:

```js
// App.js
import { useState } from 'react';

export default function Form() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('Hi!');

  if (iseSent) {
    return <h1>Your message is on its way!</h1>
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      setIsSent(true);
      sendMessage(message)
    }}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  )
}
```

当你单击按钮时会发生以下情况：

1、执行`onSubmit`事件处理函数。

2、`setIsSent(true)`将`isSent`设置为`true`并排列一个新的渲染。

3、React 根据新的 `isSent` 值重新渲染组件。

让我们仔细看看 state 和渲染之间的关系。

## 渲染会及时生成一张快照

["正在渲染"](https://zh-hans.react.dev/learn/render-and-commit#step-2-react-renders-your-components)就意味着 React 正在调用你的组件 ———— 一个函数。你从该函数返回的 JSX 就像是在某个时间点上 UI的快照。它的 props、事件处理函数和内部变量都是`根据当前渲染时的state`被计算出来的。

与照片或电影画面，你返回的UI “快照” 是可交互的。它其中包括类似事件处理函数的逻辑，这些逻辑用语指定如何对输入作出相应。React 随后会更新屏幕来匹配这张快照，并绑定事件处理函数。因此，按下按钮就会触发你 JSX 中的点击事件处理函数。因此，按下按钮就会触发你 JSX 中的点击事件处理函数。

当 React 重新渲染一个组件时：

1、React 会再次调用你的函数。

2、函数会返回新的 JSX 快照。

3、React 会更新界面以匹配返回的快照。

Form - sent - dom树 - 渲染到浏览器上

React执行函数 - 计算快照 - 更新DOM树

作为一个组件的记忆，state 不同于在你的函数返回之后就会消失的普通变量。`state`实际上“活”在React本身中 -- 就像被摆在一个架子上！-- 位于你的函数之外。当 React 调用你的组件时，它会为特定的那一次渲染提供一张 state 快照。你的组件会在其 JSX 中返回一张包含一整套新的 props 和事件处理函数的 UI 快照，其中所有的值都是 `根据那一次渲染中state的值`被计算出来的！

React收到`setUpdate`通知 - React更新`state`的值 - React 向组件内传入一张 state 的快照

这里有个向你展示其运行原理的小例子。在这个例子中，你可能会以为点击“+3”按钮会调用`setNumber(number + 1)`三次从而使计数器递增三次。

看看你点击“+3”按钮时会发生什么：

```js
// App.js

export default function Counter() {

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        {/* setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1); // 这种是不行的 */}
        setNumber(number => number + 1);
        setNumber(number => number + 1);
        setNumber(number => number + 1); // 这种 正确
      }}>+3</button>
    </>
  )
}
```
请注意，每次点击只会让`number`递增一次！

`设置state只会为下一次渲染变更state的值。`在第一次渲染期间，`number`为`0`。这也就解释了为什么在`那次渲染中的`onClick 处理函数中，即便在调用了 `setNumber(number + 1)`之后，`number`的值也仍然是`0`:

```js
<button onClick={() => {
  setNumber(number + 1);
  setNumber(number + 1);
  setNumber(number + 1);
}}>+3</button>
```
以下是这个按钮的点击事件处理函数通知 React 要做的事情：

1、`setNumber(number + 1)`:`number`是`0`所以`setNumber(0 + 1)`。
  - React准备在下一次渲染时将`number`更改为`1`。

2、`setNumber(number + 1)`: `number`是`0`所以`setNumber(0 + 1)`。
  - React 准备在下一次渲染时将`number`更改为`1`。

3、`setNumber(number + 1)`：`number`是`0`所以`setNumber(0 + 1)`。
  - React 准备在下一次渲染时将`number`更改为`1`。

尽管你调用了三次`setNumber(number + 1)`，但在`这次的渲染的`事件处理函数中`number`会一直是`0`，所以你会三次将`state`设置成`1`。这就是为什么在你的事件处理函数执行完以后，React 重新渲染的组件中的`number`等于`1`而不是`3`。

你还可以通过在心里把`state`变量替换成它们在你代码中的值来想象这个过程。由于`这次渲染`中的state变量`number`是`0`，其事件处理函数看起来会像这样：

```js
<button onClick={() => {
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
}}>+3</button>
```
对于下一次渲染来说，`number`是`1`，因此`那次渲染中的`点击事件处理函数看起来像这样：

```js
<button onClick={() => {
  setNumber(1 + 1);
  setNumber(1 + 1);
  setNumber(1 + 1);
}}>+3</button>
```
这就是为什么再次点击按钮会将计数器设置为`2`，下次点击时会设为`3`，依次类推。

## 随时间变化的state

好的，刚才那些很有意思。试着猜猜点击这个按钮会发出什么警告：

```js
// App.js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        alert(number);
      }}>+5</button>
    </>
  )
}
```
惊讶吗？你如果使用替代法，就能看到被传入提示框的state“快照”。
```js
setNumber(0 + 5);
setTimeout(() => {
  alert(0);
}, 3000);
```
到提示框运行时，`React`中存储的`state`可能已经发生了更改，但它是使用用户与之交互时状态的快照进行调度的！

`一个state变量的值永远不会在一次渲染的内部发生变化`，即使其事件处理函数的代码是异步的。在`那次渲染的`onClick内部，`number`的值即使在调用`setNumber(number + 5)`之后也还是`0`。它的值在React通过调用你的组件“获取UI的快照”时就被“固定”了。

这里有个示例能够说明上述特性会使你的事件处理函数更不同意出现计时错误。下面是一个会在五秒延迟之后发送一条消息的表单。想象以下场景：

1、你按下“发送”按钮，向Alice发送“你好”

2、在五秒延迟结束之前，将“To”字段的值更改为“Bob”。

你觉得`alert会显示什么？它是会显示“你向Alice说了你好”`还是会显示“你向Bob说了你好”？根据你已经学到的只是猜一猜，然后动手试一试：

```js
// App.js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('你好');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`你向${to} 说了${message}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}
        >
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">发送</button>
    </form>
  )
}
```
`React会使state的值始终“固定”在一次渲染的各个事件处理函数内部`。你无需担心代码运行时`state`是否发生了变化。

但是，万一你想在重新渲染之前读取最新的 state 怎么办？你应该使用[状态更新函数](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates)，下一页将会介绍！

## 摘要

- 设置 state 请求一次新的渲染。

- React 将 state 存储在组件之外，就像在架子上一样。

- 当你调用`useState`时，`React`会为你提供该次渲染的一张state快照。

- 变量和事件处理函数不会在重渲染中“存活”。每个渲染都有自己的事件处理函数。

- 每个渲染（以及其中的函数）始终“看到”的是React提供给这个渲染的state快照。

- 你可以在心中替换事件处理函数中的state，类似于替换渲染的JSX。

- 过去创建的事件处理函数拥有的是创建它们的那次渲染中的 state 值。

## 尝试一些挑战

`实现红绿灯组件`

以下是一个人行道红绿灯组件，在按下按钮时会切换状态：

向`click`事件处理函数添加一个`alert`。当灯为红色并显示“Stop”时，单击按钮应显示“Walk is next”。

把`alert`方法放在`setWalk`方法之前或之后有区别吗？

无论你是将它放在`setWalk`调用之前还是之后都不会有区别。那次渲染的`walk`的值是固定的。调用`setWalk`只会为 下次 渲染对它进行变更，而不会影响来自上次渲染的事件处理函数。

这一行代码乍看下似乎有违直觉：

```js
alert(walk ? 'Stop is next', 'Walk is next');
```
但如果你将其读作“如果交通等显示” 现在就走吧，则消息应显示”接下来是停“。就容易理解了。你事件处理函数中的`walk`变量与所渲染的`walk`值是一致的，并且不会发生改变。

你可以用替代法来验证这是否正确。当`walk`为`true`时，你会得到：

```js
<button onClick={() => {
  setWalk(false);
  alert('Stop is next');
}}>
  Change to Stop
</button>

<h1 style={{color: 'darkgreen'}}>Walk</h1>
```
因此，单击”Change to Stop“就会入队一次将`walk`设置为`false`的渲染，并弹出显示”Stop is next“的提示框。