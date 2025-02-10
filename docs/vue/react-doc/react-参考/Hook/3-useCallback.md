## useCallback

`useCallback`是一个允许你在多次渲染中缓存函数的`React Hook`。

```js
const cachedFn = useCallback(fn, dependencies)
```

- [参考](https://zh-hans.react.dev/reference/react/useCallback#reference)

  - [useCallback(fn, dependencies)](https://zh-hans.react.dev/reference/react/useCallback#usecallback)

- [用法](https://zh-hans.react.dev/reference/react/useCallback#usage)

  - [跳过组件的重新渲染](https://zh-hans.react.dev/reference/react/useCallback#skipping-re-rendering-of-components)

  - [从记忆化回调中更新state](https://zh-hans.react.dev/reference/react/useCallback#updating-state-from-a-memoized-callback)

  - [防止频繁触发Effect](https://zh-hans.react.dev/reference/react/useCallback#preventing-an-effect-from-firing-too-often)

  - [优化自定义Hook](https://zh-hans.react.dev/reference/react/useCallback#optimizing-a-custom-hook)

- [疑难解答](https://zh-hans.react.dev/reference/react/useCallback#every-time-my-component-renders-usecallback-returns-a-different-function)

  - [我的组件每一次渲染时，`useCallback`都返回了完全不同的函数](https://zh-hans.react.dev/reference/react/useCallback#every-time-my-component-renders-usecallback-returns-a-different-function)

  - [我需要在循环中为每一个列表项调用`useCallback`函数，但是这不被允许](https://zh-hans.react.dev/reference/react/useCallback#i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed)

## 参考

`useCallback(fn, dependencies)`

在组件顶层调用`useCallback`以便在多次渲染中缓存函数：

```js
import { callback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
}
```

[参考下面更多示例](https://zh-hans.react.dev/reference/react/useCallback#usage)

## 参数

- `fn`：想要缓存的函数。此函数可以接受任何参数并且返回任何值。在初次渲染时，`React`将把函数返回给你（而不是调用它！）。当进行下一次渲染时，如果`dependencies`相比于上一次渲染时没有改变，那么`React`将会返回相同的函数。否则，React将返回在最新一次渲染中传入的函数，并且将其缓存以便之后使用。`React`不会调用此函数，而是返回此函数。你可以自己决定何时调用以及是否调用。

- `dependencies`：有关是否更新`fn`的所有响应式值的一个列表。响应式值包含`props、state`，和所有在你组件内部直接声明的变量和函数。如果你的代码检查工具[配置了React](https://zh-hans.react.dev/learn/editor-setup#linting)，那么它将校验每一个正确指定为依赖的响应式值。依赖列表必须具有确切数量的项，并且必须像`[dep1, dep2, dep3]`这样编写。`React`使用[Object.is](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)比较每一个依赖和它的之前的值。


## 返回值

在初次渲染时，`useCallback`返回你已经传入的`fn`函数

在之后的渲染中，如果依赖没有改变，`useCallback`返回上一次渲染中缓存的`fn`函数；否则返回这一次渲染传入的`fn`。

## 注意

- `useCallback`是一个`Hook`，所以应该在`组件的顶层`或自定义Hook中调用。你不应在循环或者条件语句中调用它。如果你需要这样做，请新建一个组件，并将`state`移入其中。

- `除非有特定的理由，React将不会丢弃已缓存的函数`。例如，在开发中，当编辑组件文件时，`React`会丢弃缓存。在生产和开发环境中，如果你的组件在初次挂载中暂停，React将会丢弃缓存。在未来，`React`可能会增加更多利用了丢弃缓存机制的特性。例如，如果`React`未来额你值了对虚拟列表的支持，那么在滚动超出虚拟化表视口的项目时，抛弃缓存是有意义的。如果你依赖`useCallback`作为一个性能优化途径，那么这些对你会有帮助。否则请考虑使用[state 变量](https://zh-hans.react.dev/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead)或[ref](https://zh-hans.react.dev/reference/react/useRef#avoiding-recreating-the-ref-contents)。

## 用法

`跳过组件的重新渲染`

当你优化渲染性能的时候，有时需要缓存传递给子组件的函数。让我们先关注一下如何实现，稍后去理解在哪些场景中它是有用的。

为了缓存组件中多次渲染的函数，你需要将其定义在`useCallback` Hook 中：

```js
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
}
```

你需要传递两个参数给`useCallback`：

1、在多次渲染中需要缓存的函数。

2、函数内部需要使用到的所有组件内部值的`依赖列表`。

初次渲染时，在`useCallback`处接收的`返回函数`将会是已传入的函数。

在之后的渲染中，`React`将会使用`Object.is`把`当前的依赖`和已传入之前的依赖进行比较。如果没有任何依赖改变，`useCallback`将会返回与之前一样的函数。否则`useCallback`将返回此次渲染中传递的函数。

简而言之，`useCallback`在多次渲染中缓存一个函数，直至这个函数的依赖发生改变。

`让我们通过一个示例看看它何时有用`。

假设你正在从`ProductPage`传递一个`handleSubmit`函数到`ShippingForm`组件中：

```js
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

注意，切换`theme`props后会让应用停滞一小会，但如果将`<ShippingForm />`从`JSX`中移除，应用将反应迅速。这就提示尽力优化`ShippingForm`组件将会很有用。

`默认情况下，当一个组件重新渲染时，React将递归渲染它的所有子组件`，因此每当因`theme`更改时而`ProductPage`组件重新渲染时，`ShippingForm`组件也会重新渲染。`ShippingForm`钻进也会重新渲染。这对于不需要大量计算去重新渲染的组件来说影响很小。但如果你发现某次重新渲染很慢，你可以将`ShippingForm`组件包裹在[`memo`](https://zh-hans.react.dev/reference/react/memo)中。如果`props`和上一次渲染时相同，那么`ShippingForm`组件将跳过重新渲染。

```js
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```
`当代码像上面一样改变后，如果props与上一次渲染时相同，ShippingForm将跳过重新渲染`。这时缓存函数就变得很重要。假设定义了`handleSubmit`而没有定义`useCallback`:

```js
function ProductPage({ productId, referrer, theme }) {
  // 每当 theme 改变时，都会生成一个不同的函数
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* 这将导致 ShippingForm props 永远都不会是相同的，并且每次它都会重新渲染 */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  )
}
```

与字面量对象`{}`总是会创建新对象类似，`在JavaScript中，function () {} 或者 () => {}`总是会生成不同的函数。正常情况下，这不会有问题，但是这意味着`ShippingForm`props将永远不会是相同的，并且`memo`对想能的优化永远不会生效。而这就是`useCallback`器作用的地方：

```js
function ProductPage({ productId, referrer, theme }) {
  // 在多次渲染中缓存函数
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // 只要这些依赖没有改变

  return (
    <div className={theme}>
      {/* ShippingForm 就会收到同样的 props 并且跳过重新渲染 */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  )
}
```

