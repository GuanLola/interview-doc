## 把一系列state更新加入队列

设置组件 state 会把一次重新渲染加入队列。但有时你可能会希望在下次渲染加入队列之前对`state`的值执行多次操作。为此，了解React
如何批量更新 state 会很有帮助。

- 什么是”批处理“以及 React 如何使用它来处理多个 state 更新。

- 如何连续多次对同一 state 变量进行更新。

## React 会对 state更新进行批处理

在下面的示例中，你可能会认为点击”+3“按钮会使计数器递增三次，因为它调用了`setNumber(number + 1)`三次：

```js
// App.js
import { useState } from 'react'
;
export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>+3</button>
    </>
  )
}
```

但是，你可能还记得上一节中的内容，[`每一次渲染的state值都是固定的`](https://zh-hans.react.dev/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)，因此无论你调用多少次`setNUmebr(1)`，在第一次渲染的事件处理函数内部的`number`值总是`0`:
```js
setNumber(0 + 1);
setNumber(0 + 1);
setNumber(0 + 1);
```
但是这里还有另外一个影响因素需要讨论。`React会等到事件处理函数中的`所有代码都运行完毕在处理你的state更新。这就是重新渲染只会发生在所有这些`setNumber()`调用之后的原因。

这可能会让你想起餐厅里帮你点菜的服务员。服务员不会在你说第一道菜的时候就跑到厨房！相反，他们会让你把菜点完，让你修改彩票，甚至会帮桌上的其他人点菜。

```js
setColor('blue');
setColor('pink');
setColor('orange');

// copy that
setColor('blue')
```
这让你可能更新多个 state 变量 -- 甚至来自多个组件的state变量 -- 而不是触发太多的[`重新渲染`](https://zh-hans.react.dev/learn/render-and-commit#re-renders-when-state-updates)。但这也意味着只有在你的事件处理函数及其中任何代码执行完成 之后，UI才会更新。这种特性也就是`批处理`，它会使你的 React 应用运行得更快。它还会帮你避免处理只更新饿一部分 state 变量的令人困惑的”半成品“渲染。

`React不会跨 多个需要可以触发的时间（如点击）进行批处理` -- 每次点击都是单独处理的。请放心，React 只会在一般来说安全的情况下才进行批处理。这可以确保，例如，如果第一次点击按钮会禁用表单，那么第二次点击就不会再次提交它。

## 在下次渲染前多次更新同一个 state

这是一个不常见的用例，但是如果你想在下次渲染之前多次更新同一个 state，你可以像`setNumber(n => n + 1)`这样传入一个根据队列中的前一个 state 计算下一个 state 的函数，而不是像`setNumber(number + 1)`这样传入下一个`state`值。这是一种告诉 React 用 state 值做某事 而不是仅仅替换它的办法。

现在尝试递增计数器：

```js
// App.js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1);
        setNumber(n => n + 1);
        setNumber(n => n + 1);
      }}>
        +3
      </button>
    </>
  )
}
```

在这里，`n => n + 1`被称为 `更新函数`。当你将它传递给一个 state 设置函数时：

1、React 会将此函数加入队列，以便在事件处理函数中的所有其他代码运行后进行处理。

2、在下一次渲染期间，React会遍历队列并给你更新之后的最终`state`。

```js
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```
下面是 React 在执行事件处理函数时处理这几行代码的过程：

1、`setNumber(n => n + 1): n => n + 1`是一个函数。React 将它加入队列。

2、`setNumber(n => n + 1): n => n + 1`是一个函数。React 将它加入对类。

3、`setNUmber(n => n + 1): n =<> n + 1`是一个函数。React 将它加入队列。

当你在下次渲染期间调用 `useState`时，React 会遍历队列。之前的`number state`的值是`0`，所以这就是 React 作为参数 `n` 传递给第一个更新函数的值。然后 React 会获取你上一个更新函数的返回值，并将其作为 n 传递给下一个更新函数，以此类推：

| 更新队列 | n | 返回值 |
| --- | --- | --- |
| n => n + 1 | 0 | 0 + 1 = 1 |
| n => n + 1 | 1 | 1 + 1 = 2 |
| n => n + 1 | 2 | 2 + 1 = 3 |

React 会保存 `3` 为最终结果并从`useState` 中返回。

这就是为什么在上弥漫的示例中点击`"+3"`正确地将值增加”+3“。

## 如果你在替换 state 后更新 state 会发生什么

这个事件处理函数会怎么样？你认为`number`在下一次渲染中的值是什么？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNUmber(n => n + 1);
}}>

</button>
```

```js
// App.js
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(n => n + 1);
      }}>
        增加数字
      </button>
    </>
  )
}
```

这是事件处理函数告诉 React 要做的事情：

1、`setNumber(number + 5)`：`number` 为 `0`，所以`setNumber(0 + 5)`。React 将”替换为 5“添加到其队列中。

2、`setNumber(n => n + 1)`：`n => n + 1`是一个更新函数。React 将 该函数 添加到其队列中。

在下一次渲染期间， React会遍历state队列：

| 更新队列 | n | 返回值 |
|---|---|---|
| ”替换成 5“ | 0 (未使用) | 5 |
| n => n + 1 | 5 | 5 + 1 = 6 |

React 会保存 6 为最终结果并从 useState 中返回。

## 注意

你可能已经注意到， `setState(x)`实际上会像`setState(n => x)`一样运行，只是没有使用`n`!

## 如果你在更新 state 后替换 state 会发生什么

让我们再看一个例子。你认为 number 在下一次渲染中的值是什么？

```js
<button onClick={() => {
  setNumber(number + 5);
  setNumber(n => n + 1);
  setNumber(42);
}}>
</button>
```

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
        setNUmber(n => n + 1);
        setNumber(42);
      }}>增加数字</button>
    </>
  )
}
```
以下是 React 在执行事件处理函数时处理这几行代码的过程：

1、`setNumber(number + 5)`： `number` 为 `0`，所以 `setNumber(0 + 5)`。 React 将”替换为 5“添加到其队列中。

2、`setNumber(n => n + 1)`：`n => n + 1`是一个更新函数。React 将该函数添加到其队列中。

3、`setNumber(42)`：React将”替换为 42“添加到其队列中。

在下一次渲染期间，React会遍历 state 队列：

| 更新队列 | n | 返回值 |
|---|---|---|
| ”替换为 5“ | 0（未使用）| 5 |
| n => n + 1 | 5 | 5 + 1 = 6 |
| "替换为 42" | 6（未使用） | 42 |

然后 React 会保存 `42` 为最终结果并从 `useState` 中返回。

总而言之，以下是你可以考虑传递给 `setNumber` state 设置函数的内容：

- 一个更新函数（例如： n => n + 1）会被添加到队列中。

- `任何其他的值`（例如：数字 5）会导致”替换为5“被添加到队列中，已经在队列中的内容会被忽略。

事件处理函数执行完成后，React 将触发重新渲染。在重新渲染期间，React 将处理队列。更新函数会在渲染期间执行，因此 `更新函数必须是 [纯函数](https://zh-hans.react.dev/learn/keeping-components-pure)并且只 返回 结果。`不要尝试从它们内部设置 state 或者执行其他副作用。在严格模式下，React会执行每个更新函数两次（但是丢弃第二个结果）以便帮助你发现错误。

## 命名惯例

通常可以通过相应 state 变量的第一个字母来命名更新函数的参数：

```js
setEnabled(e => !e);
setLastName(ln => ln.reverse());
setFriendCount(fc => fc * 2);
```
如果你喜欢更冗长的代码，另一个常见的惯例是重复使用完整的 state 变量名称，如`setEnabled(enabled => !enabled)`，或使用前缀，如`setEnabled(prevEnabled => !prevEnabled)`。

## 摘要

- 设置 state 不会更改现有渲染中的变量，但是请求一次新的渲染。

- React 会在事件处理函数执行完成之后处理 state 更新。这被称为`批处理`。

- 要在一个事件中多次更新某些 state，你可以使用`setNumber(n => n + 1)`更新函数。

## 尝试一些挑战

1、修复请求计数器

你正在开发一个艺术市场应用，该应用允许一个用户为一个艺术品同时提交多个订单。每次用户按下”购买“按钮，”等待“计数器应该增加一。三秒后，”等待“计数器应该减少，”完成“计数器应该增加。

但是，”等待“计数器的行为并不符合期间。当你按下”购买“按钮时，它会减少到`-1`（这本应该是不可能的）。如果你快速点击两次，两个计数器似乎都会出现无法预测的行为。

为什么会发生这种情况？修复两个计数器。

```js
// App.js
import { useState } from 'react';

export default function RequestTracker() {
  const [pending, setPending] = useState(0);
  const [completed, setCompleted] = useState(0);

  async function handleClick() {
    setPending(pending => pending + 1);
    await delay(3000);
    setPending(pending => pending - 1);
    setCompleted(completed => completed + 1);
  }

  return (
    <>
      <h3>
        等待：{pending}
      </h3>
      <h3>
        完成：{completed}
      </h3>
      <button onClick={handleClick}>
        购买
      </button>
    </>
  )
}

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
```
2、自己实现状态队列

在这个挑战中，你将从头开始重新实现 React 的一小部分！这并不像听起来那么难。

滚动 `sandbox` 进行预览。请注意，它显示了 `四个测试用例`。它们与你之前在本页上看到过的示例相对应。你的任务是实现`getFinalState`函数，让它为每种情况返回正确的结果。如果你对它进行了正确的实现的话，那么所有四个测试用例都应该会通过。

你将收到两个参数： `baseState`是初始状态（例如： `0`），`queue`是一个既包含数字（例如：`5`）也包含更新函数（例如： `n => n + 1`）的数组，这些数字和数组会按照它们被添加进来的顺序排序。

你的任务是返回最终的`state`，如同页面上的表格展示的那样！

```js
// App.js
import { getFinalState } from './processQueue.js';

function increment(n) {
  return n + 1;
}

increment.toString = () => 'n => n + 1';

function TestCase({ baseState, queue, expected }) {

  const actual = getFinalState(baseState, queue);

  return (
    <>
      <p>初始 state: <b>{baseState}</b></p>
      <p>队列：<b>[{queue.join(', ')}]</b></p>
      <p>预期结果：<b>{expected}</b></p>
      <p style={{
        color: actual === expected ?
        'green' :
        'red'
      }}>
        你的结果：<b>{actual}</b>
        {' '}
        ({ actual === 'expected' ?
          '正确' :
          '错误'
        })
      </p>
    </>
  )
}

export default function App() {
  return (
    <>
      <TestCase
        baseState={0}
        queue={[1, 1, 1]}
        expected={1}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          increment,
          increment,
          increment
        ]}
        expected={3}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
        ]}
        expected={6}
      />
      <hr />
      <TestCase
        baseState={0}
        queue={[
          5,
          increment,
          42
        ]}
        expected={42}
      />
    </>
  );
}
```

```js
// processQueue.js

export function getFinalState(baseState, queue) {
  let finalState = baseState;

  // TODO: 对队列做些什么...

  return finalState;
}

```

如果你没有思路，可以从下面的代码结构开始：

```js
export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // TODO: 调用更新函数
    } else {
      // TODO: 替换 state
    }
  }

  return finalState;
}
```
补全缺失的几行代码！

```js
// processQueue.js

export function getFinalState(baseState, queue) {
  let finalState = baseState;

  for (let update of queue) {
    if (typeof update === 'function') {
      // 调用更新函数
      finalState = update(finalState);
    } else {
      // 替换下一个 state
      finalState = update
    }
  }

  return finalState;
}
```

现在你知道 React 的这一部分是如何运行的了吧！