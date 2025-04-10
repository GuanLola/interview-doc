对`immutable`的理解？
如何应用在`react`项目中？

`immutable`

## 是什么
## 如何使用
## 如何应用

## 一、是什么

`Immutable`，
不可改变的，
在计算机中，

即指一旦创建，
就不能再被更改的数据。

对`Immutable`对象的任何修改或添加删除操作都会返回一个新的`Immutable`对象。

`Immutable`实现的原理是`Persistent Data Structure`（持久化数据结构）：

- 用一种数据结构来保存数据。

- 当数据被修改时，
会返回一个对象，
但是新的对象会尽可能地利`用`之`前`的`数据结构`而不会对内存造成浪费。

也就是使用旧数据创建新数据时，
要`保`证`旧`数据同时可用且`不变`，

同时为了避免`deepCopy`把所有节点都复制一遍带来的性能损耗，
`Immutable`使用了`Structural Sharing`（结构共享）。

如果对象树中一个节点发生变化，
只修改这个节点和受它影响的父节点，

其他节点则进行共享。

如下图所示：

![immutable 共享数据结构的 动图图解](../../images/react/interview/对immutable的理解和如何应用在react项目中/1.gif)

## 二、如何使用

使用`Immutable`对象最主要的库是`immutable.js`

`immutable.js`是一个完全`独`立的`库`，
无论基于什么框架都可以用它。

其出现场景在于弥补`Javascript`没有不可变数据结构的问题，
通过`structural sharing`来解决的性能问题。

内部提供了一套完整的`Persistent Data Structure`，
还有很多易用的数据类型，
如
`Collection`、
`List`、
`Map`、
`Set`、
`Record`、
`Seq`，

其中：

- `List`：
`有序`索引集，
类似`JavaScript`中的`Array`。

- `Map`：
`无序`索引集，
类似`JavaScript`中的`Object`。

- `Set`：
`没`有`重复`值的集合。

主要的方法如下：

- `fromJS()`：
将一个`js`数据转换为`Immutable`类型的数据。

```js
const obj = Immutable.fromJS({
  a: '123',
  b: '234'
})
```

- `toJS()`：将一个`Immutable`数据转换为`JS`类型的数据。

- `is()`：对`两`个对象进行`比`较。

```js
import { Map, is } from 'immutable'

const map1 = Map({
  a: 1,
  b: 1,
  c: 1
})

const map2 = Map({
  a: 1,
  b: 1,
  c: 1
})

map1 === map2 // false

Object.is(map1, map2) // false

is(map1, map2) // true
```

- `get(key)`：对数据或对象`取`值。

- `getIn([])`：对嵌套对象或数组取值，传参为数组，表示位置。

```js
let abs = Immutable.fromJS({
  a: {
    b: 2
  }
});

abs.getIn(['a', 'b']) // 2
abs.getIn(['a', 'c']) // 子级没有值

let arr = Immutable.fromJS([
  1,
  2,
  3,
  {
    a: 5
  }
])

arr.getIn([3, 'a']); // 5
arr.getIn([3, 'c']); // 子级没有值
```

如下例子：
使用方法如下：

```js
import Immutable from 'immutable';

foo = Immutable.fromJS({
  a: {
    b: 1
  }
});

bar = foo.setIn(['a', 'b'], 2); // 使用 setIn 赋值

console.log(foo.getIn(['a', 'b'])); // 使用 getIn 取值，打印 1

console.log(foo === bar); // 打印 false
```

如果换到原生的`js`，
则对应如下：

```js
let foo = {
  a: {
    b: 1
  }
};

let bar = foo;
bar.a.b = 2;

console.log(foo.a.b); // 打印 2
console.log(foo === bar); // 打印 true
```
## 三、在react中使用

使用`Immutable`可以给`React`应用带来性能的优化，
主要体现在减少渲染的次数。

在做`react`性能优化的时候，
为了避免重复渲染，
我们会在`shouldComponentUpdate()`中做对比，
当返回`true`执行`render`方法。

`Immutable`通过`is`方法则可以完成对比，
而无需像一样通过`深`度比较的方式`比`较。

在使用`redux`过程中也可以结合`Immutable`，
不使用`Immutable`前修改一个数据需要做一个`深拷`贝。

```js
import '_' from 'lodash';

const Component = React.createClass({

  getInitialState() {
    return {
      data: {
        times: 0
      }
    }
  },

  handleAdd() {
    let data = _.cloneDeep(this.state.data);
    data.times = data.times + 1;

    this.setState({
      data: data
    });
  }
})
```

使用`Immutable`后：

```js
getInitialState() {
  return {
    data: Map({
      times: 0
    })
  }
},

handleAdd() {
  this.setState({
    data: this.state.data.update('times', v => v + 1)
  })

  // 这时的 times 并不会改变
  console.log(this.state.data.get('times'));
}
```
同理，
在`redux`中也可以将数据进行`fromJS`处理。

```js
import * as constants from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({ // 将数据转化成 immutable 数据
  home: true,
  focused: false,
  mouseIn: false,
  list: [],
  page: 1,
  totalPage: 1
})

export default(state = defaultState, action) => {
  switch(action.type) {
    case constants.SEARCH_FOCUS:
      return state.set('focused', true); // 更改 immutable 数据
    case constants.CHANGE_HOME_ACTIVE:
      return state.set('home', action.value)
    case constants.SEARCH_BLUR:
      return state.set('focused', false);
    case constants.CHANGE_LIST:
      // state.set('list', action.data).set('totalPage', action.totalPage)
      // merge效率更高，执行一次改变多个数据
      return state.merge({
        list: action.data,
        totalPage: action.totalPage
      })
    case constants.MOUSE_ENTER:
      return state.set('mouseIn', true)
    case constants.MOUSE_LEAVE:
      return state.set('mouseIn', false)
    case constants.CHANGE_PAGE:
      return state.set('page', action.value)
    default:
      return state
  }
}
```


