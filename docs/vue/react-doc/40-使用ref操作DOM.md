## 使用ref操作DOM

由于 React 会自动处理更新 DOM 以匹配你的渲染输出，因此你在组件中通常不需要操作DOM。但是，有时你可能需要访问由 React 管理的 DOM元素 -- 例如，让一个节点获得焦点、滚动到它或测量它的尺寸和位置。在 React 中没有内置的办法来做这些事情，所以你需要一个指向 DOM 节点的 ref 来实现。

## 你将会学习到

- 如何使用 `ref` 属性访问由 React 管理的 DOM 节点

- ref JSX 属性 如何 与 useRef Hook 相关联

- 如何访问另一个组件的 DOM 节点

- 在哪些情况下修改 React 管理的 DOM 是安全的

## 获取指向节点的 ref

要访问由 React 管理的 DOM 节点，首先，引入 `uesRef` Hook：

```js
import { useRef } from 'react';
```
然后，在你的组件中使用它声明一个 `ref`：

```js
const myRef = useRef(null);
```

最后，将`ref`作为`ref`属性值传递给想要获取的 DOM 节点的 JSX 标签：

```js
<div ref={myRef}>
```

`useRef` Hook 返回一个对象，该对象有一个名为 `current` 的属性。最初，`myRef.current`是`null`。当`React`为这个`<div>`创建一个 DOM 节点时，React 会把对该节点的引用放入 myRef.current。然后，你可以从[事件处理器](https://zh-hans.react.dev/learn/responding-to-events)访问此 DOM 节点，并使用在其上定义的内置[浏览器 API](https://developer.mozilla.org/en-US/docs/Web/API/Element)。

```js
// 你可以使用任意浏览器 API，例如：

myRef.current.focus();
myRef.current.scrollIntoView();
```

## 示例：使文本输入框获得焦点

在本例中，单击按钮将使输入框获得焦点：

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  )
}
```
要实现这一点：

1、使用`useRef` Hook 声明 `inputRef`。

2、像`<input ref={inputRef}>`这样传递它。这告诉 `React` 将这个`<input>`的`DOM`节点放入`inputRef.current`。

3、在`handleClick`函数中，从`inputRef.current`读取`input DOM`节点并使用`inputRef.current.focus()`调用它的`focus()`。

4、用`onClick`将`handleClick`事件处理器传递给`<button>`。

虽然 `DOM` 操作是 `ref` 最常见的用例，但`useRef` Hook 可用于存储 React 之外的其他内容，例如计时器`ID`。与`state`类似，`ref`能在渲染之间保留。你甚至可以将`ref`视为设置它们时不会触发重新渲染的`state`变量！你可以在[使用Ref引用值](https://zh-hans.react.dev/learn/referencing-values-with-refs)中了解有关`ref`的更多信息。

## 示例：滚动至一个元素

一个组件中可以有多个`ref`。在这个例子中，有一个由三张图片和三个按钮组成的轮播，点击按钮会调用浏览器的`scrollIntoView()`方法，在相应的 DOM 节点上将它们居中显示在视口中：

```js
// App.js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat()  {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    })
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  )
}

```

如何使用`ref`回调管理`ref`列表

在上面的例子中，`ref`的数量是预先确定的。但有时候，你可能需要为列表中的每一项都绑定`ref`，而你又不知道会有多少项。像下面这样做是行不通的：

```js
<ul>
  {items.map(item => {
    // 行不通！
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

请记住：

这是因为`Hook 只能在组件的顶层被调用`。不能在循环语句、条件语句或`map()`函数中调用`useRef`。

一种可能的解决方案是用一个 ref 应用其父元素，然后用 DOM 操作方法如 `querySelectorAll` 来寻找它的子节点。然而，这种方法很脆弱，如果 DOM 结构发生变化，可能会失效或报错。

另一种解决方案是`将函数传递给 ref 属性`。这称为`ref 回调`。当需要设置`ref`时，React 将传入 DOM 节点来调用你的 ref 回调，并在需要清除它时传入`null`。这使你可以维护自己的数组或`Map`，并通过其索引或某种类型的 ID 访问任何 ref。

此示例展示了如何使用此方法滚动到长列表的任意节点：

```js
// App.js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // 首次运行时初始化 Map。
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[9])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                }
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }
  return catList;
}
```

---

ref 给 列表元素 绑定 DOM：

将函数传递给 ref 属性。这称为`ref 回调`。当需要设置 ref 时， React 将传入 DOM 节点来调用你的 ref 回调，并在需要清除它时传入`null`。这使你可以维护自己的数组或[`Map`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)，并通过其索引或某种类型的 ID 访问任何 ref。

此示例展示了如何使用此方法滚动到长列表中的任意节点：

```js
// App.js
import { useState, useRef } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // 首次运行时初始化 Map。
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[9])}>Neo</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }
  return catList;
}
```
在这个例子中，`itemsRef`保存的不是单个 DOM 节点，而是保存了包含列表项 ID 和 DOM 节点的 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)。（[Ref 可以保存任何值！](https://zh-hans.react.dev/learn/referencing-values-with-refs)) 每个列表项上的[ref 回调](https://zh-hans.react.dev/reference/react-dom/components/common#ref-callback)负责更新Map：

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    // 添加到 Map 中
    map.set(cat, node);

    return () => {
      // 从 Map 中移除
      map.delete(cat);
    };
  }}
>
```

这使你可以之后从`Map`读取单个 DOM 节点。

## 注意

启用严格模式后，`ref`回调将开发中运行两次。

阅读更多这将[如何帮助你在ref回调中找到bug](https://zh-hans.react.dev/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development)的细节。

## 访问另一个组件的DOM 节点

## 陷阱

Ref 是一个脱围机制。手动操作 其他 组件的 DOM 节点可能会让代码变得脆弱。

你可以[像其它prop一样](https://zh-hans.react.dev/learn/passing-props-to-a-component)将 ref 从父组件传递给 子组件。

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

在上面这个例子中，父组件创建了一个名为`MyForm`的`ref`，并且将它传递给了`MyInput`子组件。`MyInput`将这个`ref`传递给`<input>`。因为`<input>`是一个[内置组件](https://zh-hans.react.dev/reference/react-dom/components/common)，React会将 ref 的 `.current` 属性设置为 这个 `<input>` DOM 元素。

在`MyForm`中创建的`inputRef`现在指向`MyInput`返回的`<input>` DOM 元素。在`MyForm`中创建的点击处理程序可以访问`inputRef`并且调用`focus()`来将焦点设置在`<input>`上。

```js
// App.js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  )
}
```

## 使用命令句柄暴露一部分 API

在上面的例子中，`MyInput`暴露了原始的`DOM`元素`input`。让父组件可以对其调用`focus()`。然而，这也让父组件能够做其他事情 ———— 例如，改变其 CSS 样式。在一些不常见的情况下，你可能希望限制暴露的功能。你可以用`useImperativeHandle`来做到这一点：

```js
// App.js
import { useRef } from 'react';

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // 只暴露 focus, 没有别的
    focus() {
      realInputRef.current.focus();
    },
  }));

  return <input ref={realInputRef} />;
}


export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>聚焦输入框</button>
    </>
  )
}
```

这里，MyInput 中的 realInputRef 保存了实际的 input DOM 节点。但是，`useImperativeHandle`指示 React 将你自己指定的对象作为父组件的ref值。所以 Form 组件内的 `inputRef.current`将只有 focus 方法。在这种情况下，ref“句柄”不是 DOM 节点，而是你在`useImperativeHandle`调用中创建的自定义对象。

## React 何时添加 refs

在 React 中，每次更新都分为 [两个阶段](https://zh-hans.react.dev/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

- 在 渲染 阶段，React 调用你的组件来确定屏幕上应该显示什么。

- 在 提交 阶段，React 把变更应用于 DOM。

通常，你 [不希望](https://zh-hans.react.dev/learn/referencing-values-with-refs#best-practices-for-refs) 在渲染期间访问 refs。这也适用于 保存 DOM 节点的 refs。在第一次渲染期间， DOM 节点尚未创建，因此 ref.current 将为 null。在渲染更新的过程中， DOM 节点还没有更新。所以读取它们还为时过早。

React 在提交阶段设置 `ref.current`。在更新 DOM 之前，React 将受影响的`ref.current`值设置为`null`。在渲染更新的过程中，DOM节点还没有更新。所以读取它们还为时过早。

React 在提交阶段设置 ref.current。在更新 DOM 之前，React 将受到影响的 ref.current 值设置为 null。更新 DOM 后，React 立即将它们设置到相应的 DOM 节点。

`通常，你将从事件处理访问 refs`。如果你想使用 ref 执行某些操作，你可能需要一个`effect`。我们将在下一页讨论`effect`。

## 用 flushSync 同步更新 state

思考这样的代码，它添加一个新的待办事项，并将屏幕向下滚动到列表的最后一个子项。请注意，处于某种原因，它总是滚动到最后一个子项。请注意，处于某种原因，它总是滚动到最后一个添加 之前 的待办事项：

```js
// App.js
import { useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(initialTodos);

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo ]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        添加
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  )
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: '待办 #' + (i + 1)
  })
}
```
问题出在这两行：

```js
setTodos([ ...todos, newTodo ]);
listRef.current.lastChild.scrollIntoView();
```
在 React 中，[state 更新是排队进行的](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates)。通常，这就是你想要的。但是在这个示例。但是，在这个示例中会导致问题，因为`steTodos`不会立即更新 DOM。因此，当你将列表滚动到最后一个元素时，尚未添加待办事项。这就是滚动总是“落后”一项的原因。

要解决此问题，你可以强制 `React` 同步更新（“刷新”） DOM。为此，从`react-dom`导入`flushSync`并将`state更新包裹`到`flushSync`调用中：

```js
flushSync(() => {
  setTodos([ ...todos, newTodo ]);
});
listRef.current.lastChild.scrollIntoView();
```
在 React 中，[state 更新是排队进行的](https://zh-hans.react.dev/learn/queueing-a-series-of-state-updates)。通常，这就是你想要的。但是，在这个示例中会导致问题，因为`setTodos`不会立即更新 DOM。因此，当你将列表滚动到最后一个元素时，尚未添加待办事项。这就是滚动总是“落后”一项的原因。

要解决此问题，你可以强制 React 同步更新 （“刷新”） DOM。为此，从 `react-dom`导入`flushSync`并将 `state`更新包裹 到 `flushSync` 调用中：

```js
flushSync(() => {
  setTodos([  ...todos, newTodo ]);
});
listRef.current.lastChild.scrollIntoView();
```
这将指示`React`当封装在`flushSync`中的代码执行后，立即同步更新 DOM。 因此，当你尝试滚动到最后一个待办事项时，它已经在 DOM 中了：

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(initialTodos);
  const listRef = useRef(null);

  function handleAdd() {
    const newTodo = { id: nextId++, text};
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo ]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        添加
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  )
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; ) {
  initialTodos.push({
    id: nextId++,
    text: '待办 #' + (i + 1)
  });
}
```

## 使用 refs 操作 DOM 的最佳实践

Refs 是一种脱围机制。你应该只在你必须“跳出 React” 时使用它们。这方面的常见示例包括管理焦点、滚动位置或调用 React 未暴露的浏览器 API。

如果你坚持聚焦和滚动等破坏性操作，应该不会遇到任何问题。但是，如果你尝试手动 修改 DOM，则可能会与 React 所做的更改发生冲突。

为了说明这个问题，这个例子包括一条欢迎消息和两个按钮。第一个按钮使用[条件渲染](https://zh-hans.react.dev/learn/conditional-rendering)和[state](https://zh-hans.react.dev/learn/state-a-components-memory)切换它的显示和隐藏，就像你通常在 React 中所做的那样。第二个按钮使用[remove() DOM API](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/remove)将其从 React 控制之外的 DOM 中强行移除。

尝试按几次”通过 setState 切换“。该消息会消失并再次出现。然后按”从 DOM 中删除“。这将强行删除它。最后，按”通过 setState 切换“：

```js
// App.js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show)
        }}
      >
        通过 setState 切换
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}
      >
        从 DOM 中删除
      </button>

      {show && <p ref={ref}>Hello world</p>}
    </div>
  )
}
```

在你手动删除 DOM 元素后，尝试使用 `setState` 再次显示它会导致崩溃。这是因为你更改了 DOM，而 React 不知道如何继续正确管理它。

`避免更改由 React 管理的 DOM 节点`。对 React 管理的元素进行修改、添加子元素、从中删除子元素会导致不一致的视觉结果，或与上述类似的崩溃。

但是，这并不意味着你完全不能这么做。它需要谨慎。`你可以完全地修改 React 没有理由更新的部分 DOM`。例如，如果某些 `<div>` 在 JSX 中始终为空，React 将没有理由去变动其子列表。因此，在那里手动增删元素是安全的。

## 摘要

- `Refs`是一个通用概念，但大多数情况下你会使用它们来保存 DOM 元素。

- 你通过传递 `<div ref={myRef}>` 指示 React 将 DOM 节点放入 `myRef.current`。

- 通常，你会将 `refs` 用于非破坏性操作，例如聚焦、滚动或测量 DOM 元素。

- 默认情况下，组件不暴露其 DOM 节点。你可以通过使用`forwardRef`并将第二个`ref`参数传递给特定节点来暴露DOM节点。

- 避免更改由 React 管理的 DOM 节点。

- 如果你确实修改了 React 管理的 DOM 节点，请修改 React 没有理由 更新的部分。

## 尝试一些挑战

1、播放和暂停视频

在此示例中，按钮切换 state 变量 以在播放和暂停状态之间切换。然而，为了实际播放或暂停视频，切换状态是不够的。你还需要在`<video>`的 DOM 元素上调用`play()`和`pause()`。向它添加一个`ref`，并使按钮起作用。

```js
// App.js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRe(null);

  function handleClick() {
    setIsPlaying(!isPlaying)
    // TODO: 调用 play() 或 pause()
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? '暂停' : '播放'}
      </button>
      <video width="250" ref={videoRef}>
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

对于额外的挑战，即使用户右键单击视频并使用内置浏览器媒体控件播放，也要使”播放“按钮与视频是否正在播放同步。你可能需要在视频中监听`onPlay`和`onPause`才能做到这一点。

## 答案

声明一个`ref`并将其放在`<video>`元素上。然后根据下一个`state`在事件处理器中调用`ref.current.play()`和`ref.current.pause()`。

```js
// App.js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? '暂停' : '播放'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```
为了处理内置浏览器控件，你可以将`onPlay`和`onPause`处理程序添加到`<video>`元素，并调用它们的`setIsPlaying`。这样，如果用户使用浏览器控件播放视频，状态将相应调整。

## 2、使搜索域获得焦点

做到单击”搜索“按钮时，使搜索域获得焦点。

```js
// App.js
import { useRef } from 'react';

export default function Page() {
 const inputRef = useRef(null);

 function handleSearch() {
   inputRef.current.focus();
 }

 return (
  <>
    <nav>
      <button onClick={handleSearch}>搜索</button>
    </nav>
    <input
      ref={inputRef}
      placeholder="找什么呢？"
    />
  </>
 )
}
```

## 答案

向输入框添加一个 ref，并在 DOM 节点上调用 focus() 以使其获得焦点：

```js
// App.js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);

  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          搜索
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="找什么呢？"
      />
    </>
  )
}
```

## 3、滚动图像轮播

此图像轮播有一个”下一个“按钮，可以切换激活的图像。单击时使图库水平滚动到激活的图像。你需要在激活的图像的DOM节点上调用`scrollIntoView()`：

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
})
```

```js
// App.js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          下一个
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'猫猫 #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
}
```
## 自写

```js
import

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  const ulRef = useRef(null);

  return (
    <>
      <nav>
        <button onClick={() => {
          const current = index < catList.length ? index + 1 : 0;
          setIndex(current);
          ulRef.current.childNodes[current].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          })
        }}>
          下一个
        </button>
      </nav>
      <div>
        <ul ref={ulRef}>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                  'active' :
                  ''
                }
                src={cat.imageUrl}
                alt={'猫猫 #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
}
```
## 提示

在本练习中，你不需要对每个图像都添加 ref。对当前激活的图像或图像列表本身有一个 ref 就足够了。使用`flushSync`确保 DOM 在 滚动之前更新。

## 答案

你可以声明一个 selectedRef，然后根据条件将它传递给当前图像：

```js
<li ref={index === i ? selectedRef : null}></li>
```
当`index === i`时，表示图像是别选中的图像，相应的`<li>`将接收到`selectedRef`。`React`将确保`selectedRef.current`始终指向正确的DOM节点。

请注意，为了强制 React 在滚动前更新 DOM， `flushSync` 调用是必需的。否则，`selectedRef.current`将始终指向之前选择的项目。

```js
// App.js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });

          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });
        }}>
          下一步
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                  'active'
                  : ''
                }
                src={cat.imageUrl}
                alt={'猫猫 #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
}
```

## 4、使分开的组件中的搜索域获得焦点

使分开的组件中的搜索域获得焦点

做到单击”搜索“按钮将焦点放在搜索域上。请注意，每个组件都在单独的文件中定义，并且不能将其移出。如果将它们连接在一起？

```js
// App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function App() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  )
}
```

```js
// SearchButton.js
export default function SearchButton() {
  return (
    <button>
      搜索
    </button>
  );
}
```

```js
// SearchInput.js
export default function SearchInput() {

  return (
    <input
      placeholder="找什么呢？"
    />
  )
}
```

## 4、使分开的组件中的搜索域获得焦点

做到单击”搜索“按钮将焦点放在搜索域上。请注意，每个组件都是单击的文件中定义，并且不能将其移除。如何将它们连接在一起？

```js
// App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);

  function handleSearch() {
    inputRef.current.focus();
  }

  return (
    <>
      <nav>
        <SearchButton handleSearch={handleSearch} />
      </nav>
      <SearchInput myRef={inputRef} />
    </>
  )
}
```

```js
// SearchButton.js
export default function SearchButton({ handleSearch }) {
  return (
    <button onClick={handleSearch}>
      搜索
    </button>
  )
}
```

```js
// SearchInput.js
export default function SearchInput({ myRef }) {
  return (
    <input
      ref={myRef}
      placeholder="找什么呢？"
    />
  )
}
```

## 提示

你需要`forwardRef`来主动从你自己的组件中暴露一个 DOM 节点，比如 `SearchInput`

## 答案

你需要向`SearchButton`添加一个`onClick`属性，`SearchButton`会将其向下传递给浏览器原生`<button>`。你还要向下传递一个 ref 给 `<SearchInput`，`<SearchInput>`将转发`ref`给真正的`<input>`并对它进行赋值。最后，在单击事件处理器中，你将能对存储在该 ref 中的 DOM 节点调用 `focus`。

```js
// App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);

  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  )
}
```

```js
// SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      搜索
    </button>
  )
}
```

```js
// SearchInput.js
// export default function SearchInput() {
//   return (
//     <input
//       placeholder="找什么呢？"
//     />
//   )
// }
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="找什么呢？"
      />
    )
  }
)
```