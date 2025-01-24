## 将事件从 Effect 中分开

## 目录

概览
在事件处理函数和Effect中做选择
  事件处理函数只在响应特定的交互操作时运行
  每当需要同步，Effect就会运行
响应式值和响应式逻辑
  事件处理函数内部的逻辑是非响应式的
  Effect内部的逻辑是响应式的
从Effect中提取非响应式逻辑
  声明一个Effect Event
  使用EffectEvent读取最新的props和state
  Effect Event的局限性
Recap
Challenges

事件处理函数只有在你再次执行同样的交互时才会重新运行。Effect和事件处理函数不一样，它只有在读取的`props`或`state`值和上一次渲染不一样时才会重新同步。有时你需要这两种行为的混合体：即一个 Effect 只在响应某些值时重新运行，但是在其他值变化时不重新运行。本章将会教你怎么实现这一点。

## 你将会学习到

- 怎么在事件处理函数和Effect之间做选择

- 为什么Effect是响应式的，而事件处理函数不是

- 当你想要Effect的部分代码变成非响应式时要做些什么

- Effect Event是什么，以及怎么从Effect中提取

- 怎么使用 Effect Event 读取最新的 props 和 state

## 在事件处理函数和Effect中做选择

首先让我们回顾一下事件处理函数和Effect的区别。

假设你正在实现一个聊天室组件，需求如下：

1、组件应该自动连接选中的聊天室。

2、每当你点击”Send“按钮，组件应该在当前聊天界面发送一条消息。

假设你已经实现了这部分代码，但是还没有确定应该放在哪里。你是应该用事件处理函数还是Effect呢？每当你需要回答这个问题时，请考虑一下[为什么代码需要运行](https://zh-hans.react.dev/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events)。

## 事件处理函数只在响应特定的交互操作时运行

从用户角度出发，发送消息是因为他点击了特定的”Send“按钮。如果在任意时间或者因为其他原因发送消息，用户会觉得非常混乱。这就是为什么发送消息应该使用事件处理函数。事件处理函数是让你处理特定的交互操作的：

```js
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  )
}
```
借助事件处理函数，你可以确保`sendMessage(message)`只在用户点击按钮的时候运行。

## 每当需要同步，Effect就会运行

回想一下，你还需要让组件和聊天室保持连接。代码放哪里呢？

运行这个代码的 原因 不是特定的交互操作。用户为什么或怎么导航到聊天室屏幕的都不重要。既然用户正在看它并且能够和它交互，组件就要和选中的聊天服务器保持连接。即使聊天室组件显示的是应用的初始屏幕，用户根本还没有执行任何交互，仍然应该需要保持连接。这就是这里用 Effect 的原因：

```js
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

无论用户是否执行指定交互操作，这段代码都可以保证当前选中的聊天室服务器一直有一个活跃连接。用户是否只启动了应用，或选中了不同的聊天室，又或者导航到另一个屏幕后返回，Effect 都可以确保组件和当前选中的聊天室保持同步，并在必要时[重新连接](https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)。

```js
import { useState } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Send</button>
    </>
  )
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room: {' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  )
}
```

```js
// chat.js
export function sendMessage(message) {
  console.log('Sending message: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '...');
    }
  };
}
```

## 响应式值和响应式逻辑

直观上，你可以说事件处理函数总是”手动“触发的，例如点击按钮。另一方面，Effect是自动触发；每当需要保持同步的时候他们就会开始运行和重新运行。

有一个更精确的方式来考虑这个问题。

组件内部声明的`state`和`props`变量被称为`响应式值`。本示例中的`serverUrl`不是响应式值，但`roomId`和`message`是。他们参与组件的渲染数据流：

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

像这样的响应式值可以因为重新渲染而变化。例如用户可能会编辑`message`或者在下拉菜单中选中不同的`roomId`。事件处理函数和`Effect`对于变化的响应是不一样的：

- `事件处理函数内部的逻辑是非响应式的`。除非用户又执行了同样的操作（例如点击），否则这段逻辑不会再运行。事件处理函数可以再”不响应“他们变化的情况下读取响应式值。

- `Effect内部的逻辑是响应式的`。如果 Effect 是读取响应式值，[你必须将它指定为依赖项](https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)。如果接下来的重新渲染引起那个值变化，`React`就会使用新值重新运行`Effect`内的逻辑。

让我们重新看看前面的示例来说明差异。

## 事件处理函数内部的逻辑是非响应式的

看这行代码。这个逻辑是响应式的吗？

```js
// ...
sendMessage(message);
// ...
```
事件处理函数是非响应式的，所以`sendMessage(message)`只会在用户点击”Send“按钮的时候运行。

## Effect内部的逻辑是响应式的

现在让我们返回这几行代码：

```js
// ...
const connection = createConnection(serverUrl, roomId);
connection.connect();
// ...
```
从用户角度出发，`roomId 的变化意味着他们的确想要连接到不同的房间`。换句话说，连接房间的逻辑应该是响应式的。你 需要 这几行代码和响应式值”保持同步“，并在值不同时再次运行。这就是它被归为 Effect 的原因:

```js
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => {
    connection.disconnect();
  };
}, [roomId]);
```

Effect 是响应式的，所以`createConnection(serverUrl, roomId)`和`connection.connect()`会因为`roomId`每个不同的值而运行。Effect 让聊天室连接和当前选中的房间保持了同步。

## 从 Effect 中提取非响应式逻辑

当你想混合使用相应式逻辑和非响应式逻辑时，事情变得更加棘手。

例如，假设你想在用户连接到聊天室时展示一个通知。并且通过从`props`中读取当前`theme`(dark或者light)来展示对应颜色的通知:
```js
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ 声明所有依赖项
  // ...
}
```

用这个例子试一下，看你能否看出这个用户体验问题：

```js
// App.js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notification.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  )
}
```
```js
// chat.js

export function createConnection(serverUrl, roomId) {
  // 真正的实现实际啥撒高耗能会连接到服务器
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```
```js
// notification.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

当 roomId 变化时，聊天会和预期一样重新连接。但是由于`theme`也是一个依赖项，所以每次你在`dark`和`light`主题 间切换时，聊天也会重连。这不是很好！

换言之，即使它在`Effect`内部（这是响应式的），你也不想让这行代码变成响应式：

```js
// ...
showNotification('Connected!', theme);
// ...
```
你需要一个将这个非响应式逻辑和周围响应式 Effect 隔离开来的方法。

## 声明一个 Effect Event

## 正在建设中

本章节描述了一个在React稳定版中 `还没有发布的实验性API`。

使用[`useEffectEvent`](https://zh-hans.react.dev/reference/react/experimental_useEffectEvent)这个特殊的`Hook`从`Effect`中提取非响应式逻辑：

```js
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const connected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
}
```

这里的`onConnected`被称为`Effect Event`。它是`Effect`逻辑的一部分，但是其行为更像事件处理函数。它内部的逻辑不是响应式的，而且能一直”看见“最新的`props`和`state`。

现在你可以在`Effect`内部调用`onConnected` Effect Event：

```js
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected!', theme);
  });
  // ...
}
```
这里的`onConnected`被称为`Effect Event`。它是`Effect`逻辑的一部分，但是其行为更像事件处理函数。它内部的逻辑不是响应式的，而且能一直”看见“最新的`props`和`state`。

现在你可以在`Effect`内部调用`onConnected` Effect Event:

```js
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ 声明所有依赖项
  // ...
}
```

这个方法解决了问题。注意你必须从 Effect 依赖项中 移除`onConnected`。`Effect Event`是非响应式的并且必须从依赖项中删除。

验证新表现是否和你预期的一样：

```js
// App.js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Connected', theme);
  });

  uesEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId ={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  )
}
```

```js
// chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw new Error('Cannot add the handler twice');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  }
}
```

你可以将`Effect Event`看成和事件处理函数相似的东西。主要区别是事件处理函数只在响应用户交互的时候运行，而`Effect Event`是你在`Effect`中触发的。`Effect Event`让你在`Effect`响应性和不应是响应式的代码间"打破链条"。

## 使用 Effect Event 读取最新的 props 和 state

## 正在建设中

本章节描述了一个在 React 稳定版中 `还没有发布的实验性 API`。

Effect Event 可以修复之前许多你可能视图抑制依赖项检查工具的地方。

例如，假设你有一个记录页面访问的 Effect：

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```
稍后向你的站点添加多个路由。现在`Page`组件接收包含当前路径的`url`props。你想把`url`作为`logVisit`调用的一部分进行传递，但是依赖项检查工具会提示：

```js
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ 声明所有依赖项
  // ...
}
```

现在假设你想在每次页面访问中包含购物车中的商品数量：

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // ❌ React Hook useEffect 缺少依赖项: 'numberOfItems'
  // ...
}
```

你在`Effect`内部使用了`numberOfItems`，所以代码检查工具会让你把它加到依赖项中。但是，你不想要`logVisit`调用响应`numberOfItems`。如果用户把某样东西放入购物车，`numberOfItems`会变化，这并不意味着用户再次访问了这个页面。换句话说，在某种意义上，`访问野蛮`是一个”事件“。它发生在某个准确的时刻。

将代码分割为两部分：

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent( => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ 声明所有依赖项
  // ...
}
```

这里的`onVisit`是一个`Effect Event`。里面的代码不是响应式的。这就是为什么你可以使用`numberOfItems`（或者任意响应式值！）而不用担心引起周围代码因为变化而重新执行。

另一方面，Effect本身仍然是响应式的。其内部的代码使用了`url`props，所以每次因为不同的`url`重新渲染后`Effect`都会重新运行。这会依次调用`onVisit`这个`Effect Event`。

结果是你会因为`url`的变化去调用`logVisit`，并且读取的一直都是最新的`numberOfItems`。但是如果`numberOfItems`自己变化，不会引起任何代码的重新运行。

## 注意

你可能想知道是否可以无参数调用`onVisit()`并且读取内部的`url`：

```js
const onVisit = useEffectEvent(() => {
  logVisit(url, numberOfItems);
});

useEffect(() => {
  onVisit();
}, [url]);
```

这可以起作用，但是更好的方法是将这个`url`显式传递给`Effect Event`。通过将`url`作为参数传给 `Effect Event`，你可以说从用户角度来看使用不同的`url`访问页面构成了一个独立的”事件“。`visitedUrl`是发生的”事件“的一部分：

```js
const onVisit = useEffectEvent(visitedUrl => {
  logVisit(visitedUrl, numberOfItems);
});

useEffect(() => {
  onVisit(url);
}, [url]);
```

由于`Effect`明确”要求“`visitedUrl`，所以现在你不会不小心地从`Effect`的依赖项中移除`url`。如果你移除了`url`依赖项（导致不同的页面访问被认为是一个），代码检查工具会向你提出警告。如果你想要`onVisit`能够对`url`的变化做出响应，不要读取内部的`url`（这里不是响应式的），而是应该将它从`Effect`中传入。

如果Effect内部有一些异步逻辑，这就变得非常重要了：

```js
const onVisit = useEffectEvent(visitedUrl => {
  logVisit(visitedUrl, numberOfItems);
});

useEffect(() => {
  setTimeout(() => {
    onVisit(url);
  }, 5000) // 延迟记录访问
}, [url]);
```
在这里，`onVisit`内的`url`对应`最新的`url(可能已经变化了)，但是`visitedUrl`对应的是最开始引起这个`Effect`（并且是本次`onVisit`调用）运行的url。

## 深入探讨

## 抑制依赖项检查是可行的吗？

在已经存在的代码库中，你可能有时会看见像这样的检查规则抑制：

```js
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 避免像这样抑制代码检查:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },  [url]);
  // ...
}
```

等`useEffectEvent`称为React稳定部分后，我们会推荐`永远不要抑制代码检查工具`。

抑制规则的第一个缺点是当`Effect`需要对一个已经在代码中出现过的新响应式依赖项做出”响应“时，React 不会再发出警告。在稍早之前的示例中，你将`url`添加为依赖项，是因为 React提醒你去做这件事。如果禁用代码检查，你未来将不会收到任何关于`Effect`修改的提醒。这引起了`bug`。

这个示例展示了一个由抑制代码检查引起的奇怪`bug`。在这个示例中，`handleMove`应该读取当前的`state`变量`canMove`的值来决定这个点是否应该跟随光标。但是`handleMove`中的`canMove`一直是`true`。

你能看出是为什么吗？

```js
// App.js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMOve(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint disable-next-line react hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  )
}
```
这段代码的问题在于抑制依赖项检查。如果移除，你可以看到`Effect`应该依赖于`handleMove`函数。这非常有意义：`handleMove`是在组件内声明的，是响应式值。而每个响应式值都必须被指定为依赖项，否则它可能会随着时间而过时！

原代码的作者对React”撒谎“说`Effect`不依赖于任何响应式值([])。这就是为什么`canMove`（以及`handleMove`）变化后React没有重新同步。因为`React`没有重新同步`Effect`，所以作为监听器附加的`handleMove`还是初次渲染期间创建的`handleMove`函数。初次渲染期间，`canMove`的值是`true`，这就是为什么来自初次渲染的`handleMove`永远只能看到这个值。

`如果你从来没有抑制代码检查，就永远不会遇见期指的问题`。

有了`useEffectEvent`，就不需要对代码检查工具”说谎“，并且代码也能和你预期的一样工作：

```js
// App.js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  )
}
```

这不意味着`useEffectEvent`总是正确的解决方案。你只能把它用在你不需要变成响应式的代码上。上面的`sandbox`中，你不需要Effect的代码响应 canMove。这就是提取Effect Event 很有意义的原因。

阅读[移除 Effect 依赖项](https://zh-hans.react.dev/learn/removing-effect-dependencies)寻找抑制代码检查的其他正确的替代方式。

## Effect Event 的局限性

## 正在建设中

本章节描述了一个在 React 稳定版中 `还没有发布的实验性 API`。

`Effect Event`的局限性在于你如何使用他们：

- `只在 Effect 内部调用他们`。

- `永远不要把他们传给其他的组件或者Hook`。

例如不要像这样声明和传递`Effect Event`：

```js
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Avoid: 传递 Effect Event

  return <h1>{count}</h1>
}

function onTick(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // 需要在依赖项中指定”callback“
}
```
取而代之的是，永远直接在使用他们的`Effect`旁边声明`Effect Event`：

```js
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: 只在 Effect 内部局部调用
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // 不需要指定”onTick“（Effect Event）作为依赖项
}
```

`Effect Event`是 Effect 代码的非响应式”片段“。他们应该在使用他们的 Effect 的旁边。

## 摘要

- 事件处理函数在响应特定交互时运行。

- Effect 在需要同步的时候运行。

- 事件处理函数内部的逻辑是非响应式的。

- Effect 内部的逻辑是响应式的。

- 你可以将非响应式逻辑从 Effect 移到 Effect Event 中。

- 只在 Effect 内部调用 Effect Event。

- 不要将 Effect Event 传给其他组件或者 Hook。

## 尝试一些挑战

## 1、修复一个不更新的变量

`Timer`组件保存了一个`count`的`state`变量，这个变量每秒增加一次。每次增加的值存储在`increment state`变量中。你可以使用加减按钮控制`increment`变量。

但是无论你点击加号按钮多少次，计数器每秒都只增加`1`。这段代码存在什么问题呢？为什么 Effect 内部的 `increment`总是等于`1`呢？找出错误并修复它？

```js
// App.js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>-</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  )
}
```

## 自写

```js
// App.js

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i + 1);
        }}>-</button>
        <b>{increment}</b>
        <button>+</button>
      </p>
    </>
  )
}
```
## 提示

修复这段代码，必须足够遵循这些规则。

## 答案

和往常一样，当你寻找 Effect 中的 bug 时，从寻找代码检查抑制开始。

如果你移除了抑制注释，React 就会告诉你这个 Effect 的 代码依赖于`increment`，但是你通过宣称这个`Effect`不依赖于响应式值`([])`”欺骗“了React。将`increment`添加到依赖项数组：

```js
// App.js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>-</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  )
}
```

现在当 `increment` 变化时，`React` 会重新同步你的`Effect`，这会重启`interval`。

## 2、修复一个冻结的计数器

`Timer`组件保存了一个`count`的`state`变量，这个变量每秒增加一次。每次增加的值存储在`increment` state 变量中，你可以使用加减按钮控制它。例如，尝试点击加号按钮就此，注意现在`count`每次都增加`10`而不是`1`。

这个用户接口有一个小问题。你可能注意到如果你每秒内按压加减按钮不止一次，那计时器本身似乎就会暂停。它只在你最后一次按压按钮的一秒后恢复。找出为什么会发生这种现象，并修复它以便计时器能`每`秒滴答作响而不中断。

```js
// App.js
import { useState } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);

    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Every second, increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>-</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

由于`onTick`是一个`Effect Event`，所以内部的代码是非响应式的。`increment`的变化不会触发任何`Effect`。

## 修复不可调整的延迟

在这个示例中，你可以自定义`interval`延迟。它被储存在一个由两个按钮更新的`delay` state 变量中。但你即使按了”加 100ms“按钮到`delay`为`1000`毫秒（即1秒），可以注意到计时器仍然在快速增加（每100ms）。你对`delay`的修改好像被忽略了。找到并修复这个bug。

```js
// App.js
export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i -1);
        }}>-</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>-100 ms</button>
        <b>{delay}</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

## 提示

`Effect Event`内部的代码是非响应式的。哪些情况下你会 想要 `setInterval` 调用重新运行呢？

## 答案

上面这个示例的问题在于它没有考虑代码实际正在做什么就直接提取了一个叫做`onMount`的`Effect Event`。你应该只为特定的原因提取`Effect Event`：你想让代码的一部分称为非响应式。但是`setInterval`调用`state`变量`delay`的变化是响应式的。如果`delay`变化了，你想要重新设置`interval`！为了修复这个问题，你需要将所有的响应式代码放回到 Effect 内部：

```js
// App.js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Increment by:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>-</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Increment delay:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>-100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  )
}
```

总的来说，你应该对像`onMount`这样主要关注`执行时机`而非`目的`的函数持有怀疑态度。开始可能会感觉”更具描述性“，但是可能会模糊你的意图。根据经验来说，`Effect Event`应该对应从”用户的“角度发生的事情。例如，`onMessage`，`onTick`，`onVisit`或者`onConnected`是优秀的`Event Event`名称。它们内部的代码可能不需要是响应式的。另一方面，`onMount`，`onUpdate`，`onUnmount`或者`onAfterRender`太通用了，以至于很容易不小心就把一些”应该“是响应式的代码放入其中。这就是为什么你应该用`用户想要什么发生`来给你的`Effect Event`命名，而不是用某些代码正好运行的时机命名。

## 修复延迟通知

当你加入一个聊天室时，这个组件展示一个通知。但是它不会立刻展示通知。相反，把通知人工延迟2秒钟，以便用户有机会查看UI。

这几乎生效了，但还是有一个`bug`。尝试将下拉菜单从 "general" 变成 "travel" 并且接下来非常快速的变成 ”music“。如果你做东足够快，你会看到两个通知（和预期一样！），但是他们 `都是` 展示 ”Welcome to music“。

修复它，让它能在你快速从”general“ 切换到 ”travel“ 再到 ”music“ 的时候看见两个通知，第一个是”Welcome to travel“， 第二个是”Welcome to music“ （有一个额外的挑战，假设你 已经 让通知显示了正确的时间，请修改代码只展示后面的通知。）

```js
// App.js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Welcome to ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);

  return (
    <>
      <label>
        Choose the chat room: {' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js
// chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

## 提示

你的 Effect 知道它连接的是哪一个房间。有任何你可能想要传给 `Effect Event` 的信息吗？

## 答案

在 Effect Event 内部，`roomId` 是 `Effect Event` 被调用时刻 的值。

`Effect Event`伴随着两秒的延迟被调用。如果你快速地从`travel`切换到`music`聊天室，直到`travel`聊天室的通知显示出来，`roomId`已经是`music`了。这就是为什么两个通知都是”Welcome to music“。

为了修复这个问题，不要在`Effect Event`里面读取最新的`roomId`，而是如同下面的`connectedRoomId`一样让它成为`Effect Event`的参数。然后通过调用`onConnected(roomId)`将`roomId`从Effect中传入：

```js
// App.js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () +. {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room: {' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  )
}
```

```js
// chat.js
export function createConnection(serverUrl, roomId) {
  // 真正的实现实际上会连接到服务器
  let connectedCallback;
  let timeout;

  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  }
}
```

将`roomId`设置为`”travel“`（所以它连接到了”travel“聊天室）的 Effect 将会展示 ”travel“ 的通知。将`roomId`设置为"music"(所以它连接到了”music“聊天室)的Effect将会展示”music“的通知。换言之，`connectedRoomId`来自`Effect`(是响应式的)，而`theme`总是使用最新值。

为了解决额外的挑战，
保存通知到`timeout ID`，并在`Effect`的清理函数中进行清理：

```js
// App.js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Welcome to ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [])

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input

        />
        Use dark theme
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
      </label>
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  )
}
```

```js
// chat.js
export function createConnection(serverUrl, roomId) {
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      });
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.')
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  }
}
```
这确保了当你修改聊天室时，已经安排好（但还没展示）的通知会被取消。