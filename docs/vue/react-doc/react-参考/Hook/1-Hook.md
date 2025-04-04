## React 内置 Hook

- 概览
- State Hook
- Context Hook
- Ref Hook
- Effect Hook
- 性能 Hook
- 其他 Hook
- 自定义 Hook

## React 内置 Hook

Hook 可以帮助在组件中使用不同的 React 功能。你可以使用内置的 Hook 或使用自定义 Hook。本页列出了 React 中所有内置 Hook。

## State Hook

状态帮助组件[`“记住”用户输入的信息`](https://zh-hans.react.dev/learn/state-a-components-memory)。例如，一个表单组件可以适应状态存储输入值，而一个图像组件库可以使用状态存储所选的图像索引。

使用以下`Hook`以向组件添加状态：

- 使用[`useState`](https://zh-hans.react.dev/reference/react/useState)声明可以直接更新的状态变量。

- 使用[`useReducer`](https://zh-hans.react.dev/reference/react/useReducer)在[`reducer函数`](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer)中声明带有更新逻辑的`state`变量。

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
}
```

## `Context Hook`

上下文帮助组件[从祖先组件接收信息，而无需将其作为props传递](https://zh-hans.react.dev/learn/passing-props-to-a-component)。例如，应用程序的顶层组件可以借助上下文将UI主体传递给所有下方的组件，无论这些组件层级有多深。

- 使用`useContext`读取订阅上下文。

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

## Ref Hook

ref 允许组件[`保存一些不用渲染的信息`](https://zh-hans.react.dev/learn/referencing-values-with-refs)，比如 DOM 节点或`timeout ID`。与状态不同，更新`ref`不会重新渲染组件。`ref`是从`React`范例中的“脱围机制”。当需要与非React系统如浏览器内置API一同工作时，`ref`将会非常有用。

- 使用[`useRef`](https://zh-hans.react.dev/reference/react/useRef)声明`ref`。你可以在其中保存任何值，但最常用于保存`DOM`节点。

- 使用[`useImperativeHandle`](https://zh-hans.react.dev/reference/react/useImperativeHandle)自定义从组件中暴露的`ref`，但是很少使用。

```js
function Form() {
  const inputRef = useRef(null);
  // ...
}
```

## Effect Hook

`Effect`允许组件[`连接到外部系统并与之同步`](https://zh-hans.react.dev/learn/synchronizing-with-effects)。这包括处理网络、浏览器、DOM、动画、使用不同UI库编写的小部件以及其他非React代码。

- 使用[`useEffect`](https://zh-hans.react.dev/reference/react/useEffect)将组件连接到外部系统。

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
}
```
`Effect`是从`React`范式中的"脱围机制"。避免使用`Effect`协调应用程序的数据流。如果不需要与外部系统交互，那么[可能不需要 Effect](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)。

`useEffect`有两个很少使用的交换形式，它们在执行时机有所不同：

- [`useLayoutEffect`](https://zh-hans.react.dev/reference/react/useLayoutEffect)在浏览器重新绘制屏幕前执行，可以在此测量布局。

- [`useInsertionEffect`](https://zh-hans.react.dev/reference/react/useInsertionEffect)在`React`对DOM进行更改之前触发，库可以在此插入动态`CSS`。

## 性能Hook

优化重新渲染性能的一种常见方法是跳过不必要的工作。例如，可以告诉React重用缓存的计算结果，或者如果数据自上次渲染以来没有更改，则跳过重新渲染。

- 使用[`useMemo`](https://zh-hans.react.dev/reference/react/useMemo)缓存计算代价昂贵的计算结果。

- 使用[`useCallback`](https://zh-hans.react.dev/reference/react/useCallback)将函数传递给优化组件之前缓存函数定义。

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

有时由于屏幕确实需要更新，无法跳过重新渲染。在这种情况下，可以通过将必须同步的阻塞更新（比如使用输入法输入内容）与不需要阻塞用户界面的非阻塞跟你学你（比如更新图表）分离以提供性能。

使用以下`Hook`处理渲染优先级：

- `useTransition`允许将状态转换标记为非阻塞，并允许其他更新中断它。

- `useDeferredValue`云讯延迟更新UI的非关键部分，以让其他部分先更新。

## 其他Hook

这些`Hook`主要适用于库作者，不常在应用程序代码中使用。

- 使用[`useDebugValue`](https://zh-hans.react.dev/reference/react/useDebugValue)自定义`React`开发者工具为自定义`Hook`添加的标签。

- 使用`useId`将唯一的ID与组件相关联，其通常与可访问性API一起使用。

- 使用`useSyncExternalStore`订阅外部`store`.

- 使用`useActionState`允许你管理动作的状态

## 自定义Hook

开发者可以[自定义Hook](https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component)作为`JavaScript`函数。


