`react render`方法的原理？
在什么时候会被触发？

`react render`

## 原理
## 触发时机
## 总结

## 一、原理

首先，
`render`函数在`react`中有两种形式：

在`类`组件中，
指的是`render`方法：

```js
class Foo extends React.Component {
  render() {
    return <h1>Foo</h1>;
  }
}
```
在`函数`组件中，
指的是函数组件本身：

```js
function Foo() {
  return <h1>Foo</h1>;
}
```
在`render`中，
我们会编写`jsx`，
`jsx`通过`label`编译后就会`转`化成我们熟悉的`js`格式，
如下：

```js
return (
  <div className='cn'>
    <Header>hello</Header>
    <div>start</div>
    Right Reserve
  </div>
)
```
`babel`编译后：

```js
return (
  React.createElement(
    'div',
    {
      className: 'cn'
    },
    React.createElement(Header, null, 'hello'),
    React.createElement('div', null, 'start'),
    'Right Reserve'
  )
)
```
从名字上来看，
`createElement`方法用来元素的。

在`react`中，
这个元素就是虚拟`DOM`树的节点，
接收三个参数；

- `type`：
标签。

- `attributes`:
标签属性，
若无则为`null`。

- `children`：
标签的子节点。

这些虚拟`DOM`树最终会渲染成真实`DOM`。

在`render`过程中，
`React`将新调用的`render`函数返回的树与旧版本的树进行比较，
这一步是决定如何更新`DOM`的必要步骤，
然后进行`diff`比较，
更新`DOM`树。

## 二、触发时机

`render`的执行时机主要分成了两部分：

- 类组件调用`setState`修改状态。

```js
class Foo extends React.Component {
  state = { count: 0 };

  increment = () => {
    const { count } = this.state;

    const newCount = count < 10 ? count + 1 : count;

    this.setState({ count: newCount });
  };

  render() {
    const { count } = this.state;
    console.log("Foo render");

    return (
      <div>
        <h1>{count}</h1>
        <button onClick={this.increment}>Increment</button>
      </div>
    )
  }
}
```
点击按钮，
则调用`setState`方法，
无论`count`发生变化，
控制台都会输出`Foo render`，
证明`render`执行了。

- 函数组件通过`useState hook`修改状态。
```js
function Foo() {
  const [count, setCount] = useState(0);

  function increment() {
    const newCount = count < 10 ? count + 1 : count;
    setCount(newCount)
  }

  console.log("Foo render");

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>Increment</button>
    </div>
  )
}
```

函数组件通过`useState`这种形式`更新`数据，
当数组的值不发生改变了，
就不会触发`render`。

- `类`组件`重`新`渲`染。

```js
class App extends React.Component {

  state = { name: "App" };

  render() {
    return (
      <div className="App">
        <Foo />

        <button onClick={() => this.setState({ name: "App" })}>
          Change Name
        </button>
      </div>
    )
  }

}

function Foo() {
  console.log("Foo render");
  return (
    <div>
      <h1>Foo</h1>
    </div>
  )
}
```
只要点击了`App`组件内的`Change name`按钮，
不管`Foo`具体实现是什么，
都会被重新`render`渲染。

- 函数组件重新渲染。

```js
function App() {
  const [name, setName] = useState('App')

  return (
    <div className="App">
      <Foo />
      <button onClick={() => setName("aaa")}>
        { name }
      </button>
    </div>
  )
}

function Foo() {
  console.log("Foo render");

  return (
    <div>
      <h1>Foo</h1>
    </div>
  )
}
```
可以发现，
使用`useState`来更新状态的时候，
`只`有`首`次`会`触发`Foo render`，
`后`面并`不`会导致触发`Foo render`。

## 三、总结

`render`函数里面可以编写`JSX`，
转化成`createElement`这种形式，
用于生成虚拟`DOM`，
最终转化成真实`DOM`。

在`React`中，
类组件只要执行了`setState`方法，
就一定会触发`render`函数执行，
函数组件使用`useState`更改状态不一定导致重新`render`。

组件的`props`改变了，
`不一定`触发`render`函数的执行，

但是如果`props`的值来自于父组件或者祖先的`state`。

在这种情况下，
`父`组件或者`祖先`组件的`state`发生了`改`变，
就会导致`子`组件的`重`新`渲`染。

所以，
一旦执行了`setState`就会执行`render`方法，
`useState`会判断当前值有无发生改变确定是否执行`render`方法，
一旦父组件发生渲染，
子组件也会渲染。

![render 触发流向 图解](../../images/react/interview/react%20render方法的原理和在什么时候会被触发/1.png)