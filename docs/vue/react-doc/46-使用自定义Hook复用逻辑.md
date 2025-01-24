## 使用自定义 Hook 复用逻辑

## 目录

- 概览
- 自定义 Hook：组件间共享逻辑
  - 从组件中提取自定义Hook
  - Hook的名称必须永远以`use`开头
  - 自定义Hook共享的是状态逻辑，而不是状态本身
- 在Hook之间传递响应值
  - 在事件处理函数传到自定义Hook中
- 什么时候使用自定义Hook
  - 自定义Hook帮助你迁移到更好的模式
  - 不止一个方法可以做到
- Recap
- Challenges

React 有一些内置`Hook`，例如`useState`，`useContext`和`useEffect`。有时你需要一个用途更特殊的`Hook`：例如获取数据，记录用户是否在线或者连接聊天室。虽然`React`中可能没有这些`Hook`，但是你可以根据应用需求创建自己的`Hook`。

你将会学习到

- 什么是自定义Hook，以及如何编写
- 如何在组件间重用逻辑
- 如何给自定义Hook命名以及如何构建
- 提取自定义Hook的时机和原因

## 自定义Hook：组件间共享逻辑

假设你正在开发一款重度依赖网络的应用（和大多数应用一样）。当用户使用应用时网络意外断开，你需要提醒他。你会怎么处理呢？看上去组件需要两个东西：

1、一个追踪网络是否在线的`state`。

2、一个订阅全局[online](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/online_event)和[offline](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/offline_event)事件并更新上述`state`的`Effect`。

这会让组件和网络状态保持[同步](https://zh-hans.react.dev/learn/synchronizing-with-effects)。你也许可以像这样开始：

```js
// App.js
import { useState } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

试着开启和关闭网络，注意观察`StatusBar`组件应对你的行为是如何更新的。

假设现在你想在另一个不同的组件里也使用同样的逻辑。你希望实现一个保存按钮，每当网络断开这个按钮就会不可用并且显示`"Reconnecting..."`而不是"Save progress"。

你可以从复制粘贴`isOnline`state和`Effect`到`SaveButton`组件开始：

```js
// App.js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('', handleOnline);
    }
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...' }
    </button>
  )
}
```
如果你关闭网络，可以发现这个按钮的外观变了。

这两个组件都能很好地工作，但不幸的是他们的逻辑重复了。他们看上去有不同的`视觉外观`但你依然想复用他们的逻辑。

## 从组件中提取自定义Hook

假设有一个内置`Hook` `useOnlineStatus`，它与[`useState`](https://zh-hans.react.dev/reference/react/useState)和[`useEffect`](https://zh-hans.react.dev/reference/react/useEffect)相似。那么你就可以简化这两个组件并移除他们之间的重复部分：

```js
function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  )
}
```

尽管目前还没有这样的内置`Hook`，但是你可以自己写。声明一个`useOnlineStatus`函数，并把组件里早前写的所有重复代码移入函数：

```js
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
```
在函数结尾返回`isOnline`。这可以让组件读取到该值：

```js
// App.js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  )
}
```

```js
// useOnlineStatus.js
import { useState } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

切换网络状态验证喜爱是否会同时更新两个组件。

现在组件里没有那么多的重复逻辑了。`更重要的是，组件内部的代码描述的是想要做什么（使用在线状态！），而不是怎么做（通过订阅浏览器事件完成）`。

当提取逻辑到自定义 Hook 时，你可以隐藏如果处理外部系统或者浏览器`API`这些乱七八糟的细节。组件内部的代码表达的是目标而不是具体实现。

## Hook的名称必须永远以`use`开头

React 应用是由组件构成，而组件由内置或自定义`Hook`构成，可能你经常使用别人写的自定义`Hook`，但偶尔也要自己写！

你必须遵循以下这些命名公约：

1、`React组件名称必须以大写字母开头`，比如`StatusBar`和`SaveButton`。`React`组件还需要返回一些`React`能够显示的内容，比如一段`JSX`。

2、`Hook的名称必须以 use 开头，然后紧跟一个大写字母`，就像内置的`useState`或本文早前的自定义`useOnlineStatus`一样。`Hook`可以返回任意值。

这个公约保证你始终能一眼识别出组件并且知道它的`state`，`Effect`以及其他的 React 特性可能“隐藏”在哪里。例如如果你在组件内部看见`getColor()`函数调用，就可以确定它里面不可能包含`React state`，因为它的名称没有以`use`开头。但是像`useOnlineStatus()`这样的函数调用就很可能包含对内部其他Hook的调用！

## 注意

如果你为[React 配置了](https://zh-hans.react.dev/learn/editor-setup#linting)代码检查工具，它会强制执行这个命名公约。现在滑动到上面的`sandbox`，并将`useOnlineStatus`重命名为`getOnlineStatus`。注意此时代码见擦汗工具将不会再允许你在其内部调用`useState`或者`useEffect`。只有`Hook`和组件可以调用其他Hook！

## 深入探讨

渲染期间调用的所有函数都应该以`use`前缀开头么？

不。没有调用Hook的函数不需要变成`Hook`。

如果你创建的函数没有调用任何`Hook`方法，在命名时应避免使用`use`前缀，把它当成一个常规函数去命名。如下案例中的`useSorted`函数就没有调用任何`Hook`方法，所以更推荐用`getSorted`来命名:

```js
// 🔴 Avoid: 没有调用其他Hook的Hook
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Good: 没有使用Hook的常规函数
function getSorted(items) {
  return items.slice().sort();
}
```
这保证你的代码可以在包含条件语句在内的任何地方调用这个常规函数：

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ 在条件分支里调用 getSorted() 是没问题的，因为它不是 Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```
哪怕内部只使用了一个`Hook`，你也应该给这个函数加`use`前缀（让它称为一个 Hook）：

```js
// ✅ Good：一个使用了其他Hook的Hook
function useAuth() {
  return useContext(Auth);
}
```
技术上React对此并不强制要求。原则上你可以写出不调用其他 Hook 的 Hook。但这常常会难以理解且受限，所以最好避免这种方式。但是它在极少数场景下可能是有益的。例如函数目前也许并没有使用任何Hook，但是你计划未来在该函数内部添加一些Hook调用。那么使用`use`前缀命名就很有意义：

```js
// ✅ Good：之后可能使用其他Hook的Hook
function useAuth() {
  // TODO:当认证功能实现以后，替换这一行
  // 返回 useContext(Auth);
  return TEST_USER;
}
```
接下来组件就不能在条件语句里调用这个函数。当你在内部实际添加了`Hook`调用时，这一点变得很重要。如果你（现在或者之后）没有计划在内部使用`Hook`，请不要让它变成Hook。

## 自定义 Hook 共享的是状态逻辑，而不是状态本身

之前的例子里，当你开启或关闭网络时，两个组件一起更新了。但是两个组件共享`state`变量`isOnline`这种想法是错的。看这段代码：

```js
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

它的工作方式和你之前提取的重复代码一模一样：

```js
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

这是完全独立的两个`state`变量和`Effect`!只是碰巧同一时间值一样，因为你使用了相同的外部值（网络是否开启）同步两个组件。

为了更好的说明这一点，我们需要一个不同的示例。看下面的`Form`组件：

```js
// App.js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name：
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}</b></p>
    </>
  )
}
```

每个表单域都有一部分重复的逻辑：

1、都有一个`state`（firstName 和 lastName）。

2、都有`change`事件的处理函数（`handleFirstNameChange`和`handleLastNameChange`）。

3、都有为输入框指定`value`和`onChange`属性的`JSX`。

你可以提取重复的逻辑到自定义`Hook`useFormInput：

```js
// App.js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  )
}
```

```js
// useFormInput.js
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```
注意它只声明了一个 state 变量，叫做`value`。

但`Form`组件调用了两次`useFormInput`:

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
}
```
这就是为什么它工作的时候像声明了两个单独的`state`变量！

`自定义Hook共享的只是状态逻辑而不是状态本身。对 Hook 的每个调用完全独立于同一个 Hook 的其他调用`。这就是上面两个`sandbox`结果完全相同的原因。如果愿意，你可以划上去进行比较。提取自定义`Hook`前后组件的行为是一致的。

当你需要在多个组件之间共享`state`本身时，需要[将变量提升并传递下去](https://zh-hans.react.dev/learn/sharing-state-between-components)。

## 在 Hook 之间传递响应值

每当组件重新渲染，自定义`Hook`中的代码就会重新运行。这就是组件和自定义 Hook 都[需要是纯函数](https://zh-hans.react.dev/learn/keeping-components-pure)的原因。我们应该把自定义`Hook`的代码看作组件主体的一部分。

由于自定义 Hook 会随着组件一起重新渲染，所以组件可以一直接收到最新的`props`和`state`。想知道这意味着什么，那就看看这个聊天室的示例。修改`ServerUrl`或者`roomID`:

```js
// App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  )
}
```

```js
// ChatRoom.js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    }
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  )
}
```

```js
// chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正的实现会实际连接到服务器
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl);
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey');
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from"' + roomId + '" room at ' + serverUrl);
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js
// notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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

当你修改`serverUrl`或者`roomId`时，`Effect`会对[你的修改做出“响应”](https://zh-hans.react.dev/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values)并重新同步。你可以通过每次修改 Effect 依赖项时聊天室重连的控制台消息来区分。

现在将`Effect`代码移入自定义`Hook`：

```js
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```
这让`ChatRoom`组件调用自定义 Hook，而不需要担心内部怎么工作：

```js
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  )
}
```
这看上去简洁多了（但是它做的是同一件事）！

注意逻辑 `仍然响应` props 和 state 的变化。尝试编辑 server URL 或选中的房间：

```js
// App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  )
}
```
```js
// ChatRoom.js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https:?/localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  )
}
```
```js
// useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js
// chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正的实现会实际连接到服务器
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string.Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl);
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey');
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported');
      }
      messageCallback = callback;
    }
  }
}
```

```js
// notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity:  'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```
注意你如何获取 Hook 的返回值：

```js
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
}
```

并把它作为输入传给另一个Hook:

```js
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
}
```

每次`ChatRoom`组件重新渲染，它就会传最新的`roomId`和`serverUrl`到你的`Hook`。这就是每当重新渲染后他们的值不一样时你的`Effect`会重连聊天室的原因。（如果你曾经使用过音视频处理软件，像这样的Hook链也许会让你想起音视频效果链。好似`useState`的输出作为`useChatRoom`的输入）。

## 把事件处理函数传到自定义 Hook 中

## 正在建设中

这个章节描述了 React 稳定版 `还未发布的一个实验性API`。

当你在更多组件中使用`useChatRoom`时，你可能希望组件能定制它的行为。例如现在`Hook`内部收到消息的处理逻辑是硬编码：

```js
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    }
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    })
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```
假设你想把这个逻辑移回到组件中：

```js
export default function CHatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
}
```

完成这个工作需要修改自定义 Hook，把`onReceiveMessage`作为其命名选项之一：

```js
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ 声明了所有的依赖
}
```

这个修改有效果，但是当自定义`Hook`接受事件处理函数时，你还可以进一步改进。

增加对`onReceiveMessage`的依赖并不理想，因为每次组件重新渲染时聊天室就会重新连接。通过[将这个事件处理函数包裹到 Effect Event 中来将它从依赖中移除](https://zh-hans.react.dev/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)。

```js
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 声明所有依赖
}
```

现在每次`ChatRoom`组件重新渲染时聊天室都不会重连。这是一个将事件处理函数传给自定义`Hook`的完整且有效的`demo`，你可以尝试一下：

```js
// App.js
import { useState } fromm 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
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
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  )
}
```
```js
// ChatRoom.js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  )
}
```
```js
// useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, []);
}
```

```js
// chat.js
export function createConnection({ serverUrl, roomId }) {
  // 真正的实现会实际连接到服务器
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string, Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return (
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl);
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey');
          } else {
            messageCallback('lol');
          }
        }
      })
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported');
      }
      messageCallback = callback;
    }
  )
}
```

```js
// notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
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
注意你不再需要为了使用它而去了解`uesChatRoom`是如何工作的。你可以把它添加到其他任意组件，传递其他任意选项，而它会以同样的方式工作。这就是自定义`Hook`的强大之处。

## 什么时候使用自定义 Hook

你没必要对每段重复的代码都提取自定 Hook。一些重复是好的。例如像早前提取的包裹单个`useState`调用的`useFormInput` Hook 就是没有必要的。

但是每当你写`Effect`时，考虑一下把它包裹在自定义`Hook`是否更清新。[你不应该经常使用 Effect](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)，所以如果你正在写`Effect`就意味着需要“走出 React”和某些外部系统同步，或者需要做一些React中没有对应内置 API的事。把 Effect 包裹进自定义 Hook 可以准确表达你的目标以及数据在里面是如何流动的。

例如，假设`ShippingForm`组件展示两个下拉菜单：一个显示城市列表，另一个显示选中城市的区域列表。你可能一开始会像这样写代码：

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // 这个 Effect 拉取一个国家的城市数据
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities/?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // 这个 Effect 拉取选中城市的区域列表
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        })
      return () => {
        ignore = true;
      };
    }
  }, [city]);
  // ...
}
```

尽管这部分代码是重复的，但是[把这些 Effect 各自分开是正确的](https://zh-hans.react.dev/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things)。他们同步两件不同的事情，所以不应该把他们合并到同一个`Effect`。而是提取其中的通用逻辑到你自己的`useData`Hook来简化上面的`ShippingForm`组件：

```js
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      }
    }
  }, [url]);
  return data;
}
```
现在你可以再`ShippingForm`组件中调用`useData`替换两个`Effect`：

```js
function ShippingForm({ country }) {
  const cities = useData(`/api/cities/country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/area?city=${city}` : null);
  // ...
}
```

提取自定义`Hook`让数据流清晰。输入`url`，就会输出`data`。通过把`Effect`“隐藏”在`useData`内部，你也可以防止一些正在处理`ShippingForm`组件的人向里面添加[不必要的依赖](https://zh-hans.react.dev/learn/removing-effect-dependencies)。随着时间的推移，应用中大部分`Effect`都会存在于自定义`Hook`内部。

## 深入探讨

## 让你的自定义 Hook 专注于具体的高级用例

从选择自定义`Hook`名称开始。如果你难以选择一个清晰的名称，这可能意味着你的`Effect`和组件逻辑剩余的部分耦合度太高，还没有做好被提取的准备。

理想情况下，你的自定义`Hook`名称应该清晰到即使一个不经常写代码的人也很好地猜中自定义`Hook`的功能，输入和返回：

- ✅ `useData(url)` ✅ `useData(url)`