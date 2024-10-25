real dom 和 virtual dom 的区别 ？
优缺点？

真实dom和虚拟dom

## 是什么
## 区别
## 优缺点

## 一、是什么

real dom，
真实`dom`，
意思为文档对象模型，
是一个结构化文本的抽象，
在页面渲染出的每一个结点都是一个真实`DOM`结构，
如下：

```js
// 创建 h1 标签，右边千万不能加引号
const vDom = <h1>Hello World</h1>;

// 找到 <div id="root"></div> 节点
const root = document.getElementById("root");

// 把创建的 h1 标签渲染到 root 节点上
ReactDOM.render(vDom, root);
```

上述中，`ReactDOM.render()`用于将你创建好的虚拟`DOM`节点插入到某个真实节点上，
并渲染到页面上。

`JSX`实际是一种语法糖，
在使用过程中会被`label`进行编译转化成`JS`代码，
上述`VDOM`转化为如下：

```js
const vDom = React.createElement(
  'h1',
  {
    className: 'hClass',
    id: 'hId'
  },
  'hello world'
)
```

可以看到，
`JSX`就是为了简化直接调用`React.createElement()`方法：

- 第一个参数是标签，例如`h1`、`span`、`table`......

- 第二个参数是个对象，里面存着标签的一些属性，例如`id`、`class`等。

- 第三个参数是节点中的文本。

通过`console.log(VDOM)`，
则能够得到虚拟`VDOM`消息。

![虚拟vdom 对象里面的东西](../../images/react/interview/real%20dom和%20virtual%20dom的区别和优缺点/1.png)

所以可以得到，
`JSX`通过`babel`的方式转化成`React.createElement`执行，
返回值是一个对象，
也就是虚拟`DOM`。

## 二、区别

两者的区别如下：

- 虚拟`DOM`不会进行排版与重绘操作，
而真实`DOM`会频繁重排与重绘。

- 虚拟`DOM`的总损耗是"虚拟DOM 增删改 + 真实DOM差异增删改 + 排版与重绘"，
真实`DOM`的总损耗是“真实`DOM`完全增删改+排版与重绘”。

举过的例子：

传统的原生`api`或`jQuery`去操作`DOM`时，
浏览器会从构建`DOM`树开始从头到尾执行一遍流程。

当你在一次操作时，
需要更新10个`DOM`节点，
浏览器没那么智能，
收到第一个更新`DOM`请求后，
并不知道后续还有9次更新操作，
因此会马上执行流程，
最终执行10次流程。

而通过`VNode`，
同样更新10个`DOM`节点，
虚拟`DOM`不会立即操作`DOM`，
而是将这`10`次更新的`diff`内容保存到本地的一个`js`对象中，
最终将这个`js`对象一次性`attach`到`DOM`树上，
避免大量的无谓计算。

## 三、优缺点

真实`DOM`的优势：

- 易用

缺点：

- 效率低，解析速度慢，内存占用量过高。
- 性能差：频繁操作真实DOM，易于导致重绘与回流。

使用虚拟`DOM`的优势如下：

- 简单方便：
如果使用手动操作真实`DOM`来完成页面，
繁琐又容易出错，
在大规模应用下维护起来也很困难。

- 性能方面：
使用`Virtual DOM`，
能够有效避免真实`DOM`数频繁更新，
减少多次引起重绘与回流，
提高性能。

- 跨平台：
React借助虚拟`DOM`，
带来了跨平台的能力，
一套代码多端运行。

缺点：

- 在一些性能要求极高的应用中虚拟DOM无法进行针对性的极致优化。

- 首次渲染大量DOM时，
由于多了一层虚拟DOM的计算，
速度比正常稍慢。



