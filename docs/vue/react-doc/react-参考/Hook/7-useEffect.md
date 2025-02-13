## useEffect

`useEffect`是一个React Hook，它允许你`将组件与外部系统同步`。

```js
useEffect(setup, dependencies?)
```

- 参考
  - `useEffect(setup, dependencies?)`

- 用法
  - 连接到外部系统
  - 在自定义`Hook`中封装`Effect`
  - 控制非`React`小部件
  - 使用`Effect`请求数据
  - 指定响应式依赖项
  - 在`Effect`中根据先前`state`更新`state`。
  - 删除不必要的对象依赖项
  - 删除不必要的函数依赖项
  - 从`Effect`读取更新的`props`和`state`
  - 在服务器和客户端上显示不同的内容

- 疑难解答
  - `Effect`在组件挂载时运行了两次
  - `Effect`在每次重新渲染后都运行
  - `Effect`函数一直在无限循环中运行
  - 即使组件没有卸载，`cleanup`逻辑也会运行
  - 我的`Effect`做了一些视觉相关的事情，在它运行之前我看到了一个闪烁

## 参考

`useEffect(setup, dependencies?)`

在组件的顶层调用`useEffect`来声明一个`Effect`：

```js

function ChatRoom({ roomId }) {

}
```


