## React 开发者工具

使用 React 开发者工具检查 React [`components`](https://zh-hans.react.dev/learn/your-first-component)，编辑[`props`](https://zh-hans.react.dev/learn/passing-props-to-a-component)和[`state`](https://zh-hans.react.dev/learn/state-a-components-memory)，并识别性能问题。

> 你将会学习到

- 如何安装 React 开发者工具

## 浏览器扩展

调试 React 构建的网站最简单的拌饭就是安装 React 开发者工具浏览器扩展。它可用于集中流行的浏览器：

- [`安装 Chrome 扩展`](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)

[chrome 的 插件 react developer tools， 可以看数据的](./images/10-React开发者工具/1.png)

- [`安装 Firefox 扩展`](https://addons.mozilla.org/zh-CN/firefox/addon/react-devtools/)

- [`安装 Edge 扩展`](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

现在，如果你访问一个用 React 构建的网站，你将看到 Components 和 Profiler 面板。
[面板 可以看到 react里面的数据](./images/10-React开发者工具/2.png)

## Safari 和 其他浏览器

为其他浏览器 （比如， Safari），安装 [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm 包：

```js
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```
接下来从终端打开开发者工具：

```js
react-devtools
```
然后通过将以下 `<script>` 标签添加到你的网站 `<head>` 开头来连接你的网站：

```html
<html>
  <head>
    <script src="http://localhost:8097"></script>
  </head>
</html>
```
现在在浏览器里刷新你的网站，你可以在开发者工具里查看它。
[其他杂七杂八的浏览器的配置去看 react 的 components](./images/10-React开发者工具/3.png)

## 移动端 （React Native）

React 开发者工具同样可检查用 `React Native` 构建的应用程序。

使用 React 开发者工具最简单的办法就是全局安装它：

```js
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```
接下来从终端打开开发者工具：

```js
react-devtools
```
它应该可以连接到任何正在运行的本地`React Native`应用程序。

> 如何几秒钟后开发者工具未连接，请尝试重新加载应用程序。

> [`了解有关调试 React Native 的更多信息。`](https://reactnative.dev/docs/debugging)