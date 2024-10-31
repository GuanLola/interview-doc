对`react router`的理解？
常用的`Router`组件有哪些？

`React Router`

## 是什么
## 有哪些
## 参数传递

## 一、是什么

`react-router`等前端路由的原理大致相同，
可以`实现无刷新`的条件下切换`显示不同`的页面。

路由的本质就是页面的`URL`发生改变时，
页面的显示结果可以根据`URL`的变化而变化，
但是`页面`不会`刷新`。

因此，
可以通过`前端路由`可以实现单页(`SPA`)应用。

`react-router`主要分成了几个不同的包：

- `react-router`：实现了路由的`核心`功能。

- `react-router-dom`：基于`react-router`，加入了在浏览器运行环境下的一些功能。

- `react-router-native`：基于`react-router`，加入了`react-native`运行环境下的一些功能。

- `react-router-config`：用于配置`静态路由`的`工具库`。


## 二、有哪些

这里主要讲述的是`react-router-dom`的常用`API`，
主要是提供了一些组件：

- `BrowserRouter`、`HashRouter`。

- `Route`。

- `Link`、`NavLink`。

- `switch`。

- `redirect`。

**BrowserRouter、HashRouter**

`Router`中包含了对路`径`改`变`的监`听`，
并且会将相应的路径传递给子组件。

`BrowserRouter`是`history`模式，
`HashRouter`模式。

使用两者作为最顶层组件包裹其他组件。

```js
import { BrowserRouter as Router } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <main>
        <nav>
          <ul>
            <li>
              <a href=" ">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
      </main>
    </Router>
  )
}
```
**Route**

`Route`用于路径的匹配，
然后进行组件的渲染，
对应的属性如下：

- `path`属性：
用于设置匹配到的路径。

- `component`属性：
设置匹配到路径后，渲染的组件。

- `render`属性：
设置匹配到路径后，
渲染的内容。

- `exact`属性：
开启精准匹配，
只有精准匹配到完全一致的路径，
才会渲染对应的组件。

```js
import { BrowserRouter as Router, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <main>
        <nav>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>

        <Route path="/" render={() => <h1>Welcome!</h1>} />
      </main>
    </Router>
  )
}
```

**Link、NavLink**

通常路径的跳转是使用`Link`组件，
最终会被渲染成`a`元素，
其中属性`to`代替`a`标题的`href`属性。

`NavLink`是在`Link`基础之上增加了一些样式属性，
例如组件被选中时，
发生样式变化，
则可以设置`NavLink`的一下属性：

- `activeStyle`：活跃时（匹配时）的样式。

- `activeClassName`：活跃时添加的`class`。

如下：

```js
<NavLink to="/" exact activeStyle={{color: "red"}}></NavLink>
<NavLink to="/about" activeStyle={{color: "red"}}>关于</NavLink>
<NavLink to="/contact" activeStyle={{color: "red"}}>联系</NavLink>
```
如果需要实现`js`页面的跳转，
那么可以通过下面的饿形式：

通过`Route`作为顶层组件包裹其他组件后，
页面组件就可以接收到一些路由相关的东西，
比如`props.history`。

```js
const Contact = ({ history }) => {
  <Fragment>
    <h1>Contact</h1>
    <button onClick={() => history.push("/")}>Go to home</button>
    <FakeText />
  </Fragment>
}；
```
`props`中接收到的`history`对象具有一些方便的方法，
如`goBack`, `goForward`，`push`。

**redirect**

用于路由的重定向，
当这个组件出现时，
就会执行跳转到对应的`to`路径中，
如下例子：

