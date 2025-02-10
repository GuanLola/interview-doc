## useActionState

`useActionState`是一个可以根据某个表单动作的结果更新`state`的`Hook`。

```js
const [state, formAction, isPending] = useActionState(fn, initialState, permalink?);
```

## 注意

在早期的`React Canary`版本中，此`API`是`React DOM`的一部分，称为`useFormState`。

- [参考](https://zh-hans.react.dev/reference/react/useActionState#reference)
 - [useActionState(action, initialState, permalink)](https://zh-hans.react.dev/reference/react/useActionState#useactionstate)

- [用法](https://zh-hans.react.dev/reference/react/useActionState#usage)
  - [使用某个表单动作返回的信息](https://zh-hans.react.dev/reference/react/useActionState#using-information-returned-by-a-form-action)

- [疑难解答](https://zh-hans.react.dev/reference/react/useActionState#troubleshooting)
  - [`我的action无法再获取提交的 form data 了`](https://zh-hans.react.dev/reference/react/useActionState#my-action-can-no-longer-read-the-submitted-form-data)

## 参考

`useActionState(action, initialState, permalink?)`

在组件的顶层调用`useActionState`即可创建一个随[`表单动作被调用`](https://zh-hans.react.dev/reference/react-dom/components/form)而更新的`state`。在调用`useActionState`时在参数中传入现有的表单动作函数以及一个初始状态，无论`Action`是否在`pending`中，它都会返回一个新的`action`函数和一个`form state`以供在`form`中使用。这个新的`form state`也会作为参数传入提供的表单动作函数。

```js
import { useActionState } from "react";

async function increment(previousState, formData) {
  return previousState + 1;
}

function StatefulForm({}) {
  const [state, formAction] = useActionState(increment, 0);
  return (
    <form>
      {state}
      <button formAction={formAction}>+1</button>
    </form>
  )
}
```

`form state`是一个只在表单被提交触发`action`后才会被更新的值。如果该表单没有被提交，该值会保持传入的初始值不变。

如果与服务器函数一起使用，`useActionState`允许与表单交互的服务器的返回值在激活完成前显示。

[请参阅下方更多示例](https://zh-hans.react.dev/reference/react/useActionState#usage)

## 参数

- `fn`: 当按钮被按下或者表单被提交时触发的函数。当函数被调用时，该函数会接收到表单的上一个`state`（初始值为传入的`initialState`参数，否则为上一次执行完该函数的结果）作为函数的第一个参数，余下参数为普通表单动作接到的参数。

- `initialState`：`state`的初始值。任何可序列化的值都可接收。当`action`被调用一次后该参数会被忽略。

- 可选的`permalink`：
A string containing the unique page URL that this form modifies.
包含此表单要修改的唯一页面URL的字符串。

For use on pages with dynamic content(eg: feeds) in conjunction with progressive enhancement:
用于具有动态内容的页面（例如：提要），并结合渐进式增强：

if fn is a server function and the form is submitted before the JavaScript bundle loads,
如果fn是一个服务器函数，并且表单是在JavaScript包加载之前提交的，
the browser will navigate to the specified permalink URL.
浏览器将导航到指定的永久链接URL.

Ensure that the same form component is rendered on the destination page (including the same action fn and permalink) so that React knows how to pass the state through.
确保在目标页面上呈现相同的表单组件（包括相同的动作fn和permalink），以便React知道如何传递状态。

Once the form has been hydrated, this parameter has no effect.
一旦形式被水化，这个参数就没有作用了。

## 返回值

`useActionState`返回一个包含以下值的数组：

1、当前的`state`。第一次渲染期间，该值为传入的`initialState`参数值。在`action`被调用后该值会变为`action`的返回值。

2、一个新的`action`函数用于在你`form`组件的`action`参数或表单中任意一个`button`组件的`formAction`参数中传递。这个`action`也可以手动在[`startTransition`](https://zh-hans.react.dev/reference/react/startTransition)中调用。

3、一个`isPending`标识，用于表明是否有正在`pending`的`Transition`。

注意

- 在支持`React`服务器组件的框架中使用该功能时，`useActionState`允许表单在服务器渲染阶段时获得部分交互性。当不使用服务器组件时，它的特性与本地`state`相同。

- 与直接通过表单动作调用的函数不同，传入`useActionState`的函数被调用时，会多传入一个代表`state`的上一个值或初始值的参数作为该函数的第一个参数。

## 用法

- `使用某个表单动作返回的信息`

在组件的顶层调用`useActionState`以获取上一次表单被提交时触发的`action`的返回值。

```js
import { useActionState } from 'react';
import { action } from './actions.js';

function MyComponent() {
  const [state, formAction] = useActionState(action, null);
  // ...
  return (
    <form action={formAction}>
      {/* ... */}
    </form>
  )
}
```

`useActinState`返回一个包含以下值的数组：

1、该表单的`当前state`，初始值为提供的`初始state`，当表单被提交后则改为传入的`action`的返回值。

2、传入`<form>`标签的`action`属性的`新action`，或者手动在`startTransition`中调用它。

3、一个`pending state`，可以在处理action的过程中使用它。

表单被提交后，传入的`action`函数会被执行，返回值将会作为该表单的新的`当前state`。

传入的`action`接受的第一个参数将会变为该表单的`当前state`。当表单第一次被提交时将会传入提供的`初始state`，之后都将传入上一次调用`action`函数的返回值。余下参数与未使用`useActionState`前接受的参数别无二致。

```js
function action(currentState, formData) {
  // ...
  return 'next state';
}
```

## 提交表单后展示信息

1、展示表单错误

## 第1个示例 共2个挑战：展示表单错误

将`action`包裹进`useActionState`即可展示诸如错误信息或服务器函数返回的`toast`等信息。

```js
// App.js
import { useActionState, useState } from 'react';
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">加入购物车</button>
      {isPending ? '加载中...' : message}
    </form>
  )
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: 权威指南" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: 优点荟萃" />
    </>
  )
}
```

```js
// actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const timeId = queryData.get('itemID');
  if (itemID === '1') {
    return "已加入购物车";
  } else {
    // 认为添加延迟以使等待更明显
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "无法加入购物车：商品已售罄";
  }
}
```

## 2、提交表单后展示结构性数据

`第2个示例共2个挑战：提交表单后展示结构性数据`

服务器函数的返回值可以为任意可序列化的值。例如，可以返回一个实例，该实例携带一个`boolean`类型的属性表示操作是否成功，同时附带错误信息或更新消息。

```js
// App.js

function AddToCartForm({itemID, itemTitle}) {
  const [formState, formAction] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">加入购物车</button>
      {formState?.success &&
        <div className="toast">
          成功加入购物车！当前购物车中共有 {formState.cartSize} 件商品。
        </div>
      }
      {formState?.success === false &&
        <div className="error">
          加入购物车失败：{formState.message}
        </div>
      }
    </form>
  )
}

export default function App() {
  return (
    <>
      <AddToCartForm itemID="1" itemTitle="JavaScript: 权威指南" />
      <AddToCartForm itemID="2" itemTitle="JavaScript: 优点荟萃" />
    </>
  )
}
```
```js
// actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return {
      success: true,
      cartSize: 12
    };
  } else {
    return {
      success: false,
      message: "商品已售罄",
    };
  }
}
```

## 疑难疑答

`我的action无法再获取提交的form data了`

当使用`useActionState`包裹`action`时，第一个参数变为了`form`的当前`state`，提交的表单数据被顺移到了第二个参数中，与直接使用表单动作是不同的。

```js
function action(currentState, formData) {
  // ...
}
```

## 译注：

[1]这里的意思是原来的第一个参数被顺移为第二个参数，第二个参数被顺移为第三个参数，以此类推。





