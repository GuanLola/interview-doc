在React项目中是如何使用Redux的？
项目结构是如何划分的？

react中使用redux

## 背景
## 如何做
## 项目结构

## 一、背景

在前面文章了解中，
我们了解到`redux`是用于`数据`状态`管`理，
而`react`是一个视`图`层面的库。

如果将两者连接在一起，
可以使用官方推荐`react-redux`库，
其具有高效且灵活的特性。

`react-redux`将组件分成:

- `容器`组件：
存在`逻辑`处理。

- `UI`组件：
只负责现显示和交互，
内部不处理逻辑，
状态由外部控制。

通过`redux`将整个应用状态存储到`store`中，
组件可以派发`dispatch`行为`action`给`store`。

其他组件通过订阅`store`中的状态`state`来更新自身的视图。

## 二、如何做

使用`react-redux`分成了两大核心：

- `Provider`

- `connection`

**Provider**

在`redux`中存在一个`store`用于存储`state`，
如果将这个`store`存放在`顶`层元素中，
其他组件都被`包`裹在顶层元素之上。

那么所有的组件都讷讷狗狗受到`redux`的控制，
都能够获取到`redux`中的数据。

使用方式如下：

```js
<Provider store={store}>
  <App />
</Provider>
```
**connection**

`connect`方法将`store`上的`getState`和`dispatch`包装成组件的`props`。

导入`connect`如下：

```js
import { connect } from "react-redux";
```
用法如下：

```js
connect(mapStateToProps, mapDispatchToProps)(MyComponent)
```

可以传递两个参数：

- `mapStateToProps`

- `mapDispatchToProps`

**mapStateToProps**

把`redux`中的数据映射到`react`中的`props`中去。

如下：

```js
const mapStateToProps = (state) => {
  return {
    // prop: state.xxx | 意思是将state
    foo: state.bar
  }
}
```
组件内部就能够通过`props`获取到`store`中的数据。

```js
class Foo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      // 这样子渲染的其实就是state.bar的数据了
      <div>{this.props.foo}</div>
    )
  }
}

Foo = connect()(Foo)
export default Foo
```
**mapDispatchToProps**

将`redux`中的`dispatch`映射到组件内部的`props`中。

```js
const mapDispatchToProps = (dispatch) => { // 默认传递参数就是`dispatch`
  return {
    onClick: () => {
      dispatch({
        type: 'increment'
      })
    }
  }
}
```

```js
class Foo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <button onClick={this.props.onClick}>点击新增</button>
    )

}

Foo = connect()(Foo)
export default Foo
```

**小结**

整体流程图大致如下所示：

![react项目中去用redux整体用法 和 图解](../../react/interview/在react项目中是如何使用redux的和项目结构是如何划分的.md)

## 三、项目结构

可以根据项目具体情况进行选择，
以下列出两种常见的组织结构。

**按角色组织（MVC）**

角色如下：

- `reducers`

- `actions`

- `components`

- `containers`

参考如下：

```js
reducers/
  todoReducer.js
  filterReducer.js

actions/
  todoAction.js
  filterActions.js

components/
  todoList.js
  todoItem.js
  filter.js

containers/
  todoListContainer.js
  todoItemContainer.js
  filterContainer.js
```

**按功能组织**

使用`redux`使用功能组织项目，
也就是把完成同一`应用`功能的代码放在一个`目录`下，
一个应用功能包含`多个角色`的代码。

`Redux`中，
不同的角色就是`reducer`、`actions`和视图，
而应用功能对应的就是用户界面的交互模块。

参考如下：

```js
todoList/
  actions.js
  actionTypes.js
  index.js
  reducer.js
  views/
    components.js
    containers.js
filter/
  actions.js
  actionTypes.js
  index.js
  reducer.js
  views/
    components.js
    container.js
```

每个`功能模块`对应一个`目录`，
每个目录下包含同样的`角色`文件：

- `actionTypes.js`定义`action`类型。

- `actions.js`定义`action`构造函数。

- `reducer.js`定义这个功能模块如果响应`actions.js`定义的动作。

- `views`包含功能模块中所有的`React`组件，

- `index.js`把所有的角色导入，统一导出。

其中`index`模块用于导出对外的接口。

```js
import * as actions from './actions.js';
import reducer from './reducer.js';
import view from './views/container.js'

export  {
  actions,
  reducer,
  view
};
```
导入方法如下：

```js
import { actions, reducer, view as TodoList } from './xxxx'
```