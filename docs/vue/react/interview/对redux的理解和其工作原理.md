对redux的理解？
其工作原理？

redux

## 是什么
## 工作原理
## 如何使用

## 一、是什么

`React`是用于构建用户界面的，
帮助我们解决渲染`DOM`的过程。

而在整个应用中会存在很多个组件，
每个组件的`state`是由自身进行管理，
包括组件定义`自身`的`state`、
组件`之间`的`通信`通过`props`传递、
使用`Context`实现数据共享。

如果让每个组件都存储自身相关的状态，
理论上来讲不会影响应用的运行，
但在开发及后续维护阶段，
我们将花费大量精力去查询状态的变化过程。

这种情况下，
如果将所有的状态进行集中管理，
当需要更新状态的时候，
`仅`需要`对`这个`管理集中`处理，
而不用去关心状态是如何分发到每一个组件内部的。

`redux`就是一个实现上述集中管理的容器，
遵循三大基本原则：

- `单一`数据`源`。
- `state`是只读的。
- 使用`纯函数`来执行修`改`。

注意的是，
`redux`并不是只应用在`react`中，
还与其他界面库一起使用，
如`Vue`。

## 二、工作原理

`redux`要求我们把数据都放在`store``公共存储`空间。

一个组件改变了`store`里的数据内容，
其他组件就能感知到`store`的变化，
再来取数据，
从而间接的实现了这些数据传递的功能。

工作流程图如下所示：

![store的工作流程](../../images/react/interview/对redux的理解和其工作原理/1.png)

根据流程图，
可以想象，
`React Component`是借书的`用户`，
`Action Creator`是借书时`说`的`话`（借什么书），
`Store`是图书馆`管理`员，
`Reducer`是`记录`本（借什么书，还什么书，在哪儿，需要查什么），
`state`是书籍`信息`。

整个流程就是借书的用户需要先存在，
然后需要借书，
需要一句话来描述借什么书，

图书馆管理员听到后需要查一下记录本，
了解图书的位置，
最后图书馆管理员会把这本书给到这个借书人。

转换为代码是，
`React Components`需要获取一些数据，
然后它就告知`Store`需要获取数据，
这就是`Action Creator`，
`Store`接收到之后去`Reducer`查一下，

`Reducer`会告诉`Store`应该给这个组件什么数据。

## 三、如何使用

创建一个`store`的公共数据区域。

```js
import { createStore } from 'redux' // 引入一个第三方的方法

const store = createStore() // 创建数据的公共存储区域（管理员）
```
还需要创建一个记录本去辅助管理数据，
也就是`reducer`，
本质就是一个函数，
接收两个参数`state`，`action`，返回`state`。
```js
// 设置默认值
const initialState = {
  counter: 0
}

const reducer = (state = initialState, action) = {
}
```
然后就可以将记录本传递给`store`，
两者建立连接。

如下：

```js
const store = createStore(reducer)
```
如果想要获取`store`里面的数据，
则通过`store.getState()`来获取当前`state`。

```js
console.log(store.getState());
```
下面再看看如何更改`store`里面数据，
是通过`dispatch`来派发`action`，
通常`action`中都会有`type`属性，
也可以携带其他的数据。

```js
store.dispatch({
  type: "INCREMENT"
})

store.dispatch({
  type: "DECREMENT"
})

store.dispatch({
  type: "ADD_NUMBER",
  number: 5
})
```
下面再来看看修改`reducer`中的处理逻辑：

```js
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, counter: state.counter + 1 };
    case "DECREMENT":
      return { ...state, counter: state.counter - 1 };
    case "ADD_NUMBER":
      return { ...state, counter: state.counter + action.number };
    default:
      return state;
  }
}
```
注意，`reducer`是一个纯函数，
不需要直接修改`state`。

这样派发`action`之后，
即可以通过`store.subscribe`监听`store`的变化，
如下：

```js
store.subscribe(() => {
  console.log(store.getState());
})
```
在`React`项目中，
会搭配`react-redux`进行使用。

完整代码如下：

```js
const redux = require('redux');

const initialState = {
  counter: 0
}

// 创建reducer
const store = (state = initialState, action) => {
  switch () {
    case "INCREMENT":
      return { ...state, counter: state.counter + 1 };
    case "DECREMENT":
      return { ...state, counter: state.counter - 1 };
    case "ADD_NUMBER":
      return { ...state, counter: state.counter + action.number };
    default:
      return state;
  }
}

// 根据reducer创建store
const store = redux.createStore(reducer);

store.subscribe(() => {
  console.log(store.getState());
})

// 修改store中的state
store.dispatch({
  type: "INCREMENT"
})
// console.log(store.getState());

store.dispatch({
  type: "DECREMENT"
})
// console.log(store.getState());

store.dispatch({
  type: "ADD_NUMBER",
  number: 5
})

// console.log(store.getState());
```

**小结**

- `createStore`可以帮助创建`store`。

- `store.dispatch`帮助派发`action`,
`action`会传递给`store`。

- `store.getState`这个方法可以帮助获取`store`里边所有的数据内容。

- `store.subscribe`方法订阅`store`的改变，
只要`store`发生改变，
`store.subscribe`这个函数接收的这个回调函数就会被执行。