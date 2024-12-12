## 将 React 添加到现有项目中

如果想对现有项目添加一些交互，不必使用 React将其整个重写。 只需将 React 添加到已有技术栈中，就可以在任何位置渲染交互式的 React 组件。

> 注意

你需要安装 [`Node.js`](https://nodejs.org/zh-cn/) 以进行本地开发。尽管可以使用 [`在线演练场`](https://zh-hans.react.dev/learn/installation#try-react)或简单的HTML页面来尝试 React，但实际上大多数用于开发的 JavaScript  工具都需要 Node.js。

## 在现有网站的子路由中使用 React

假设你在 `example.com` 部署了一个其他服务端技术（例如 Rails）构建的 Web 应用，但是你又想在 `example.com/some-app/`部署一个 React 项目。

以下是推荐的配置方式：

1、使用一个 [`基于 React 的框架`](https://zh-hans.react.dev/learn/start-a-new-react-project) 构建 `应用的 React 部分`。

2、`在框架配置中将 /some-app 指定为基本路径（这里有 Next.js 与 Gatsby 的配置样例）`。

3、`配置服务器或代理`，以便所有位于`/some-app/`下的请求都由 React 应用处理。

这可以确保应用的 React 部分 可以受益于这些框架中内置的 [`最佳实践`](https://zh-hans.react.dev/learn/start-a-new-react-project#can-i-use-react-without-a-framework)。

许多基于 React 的框架都是全栈的，从而可以让你的 React 应用充分利用服务器，但是，即使无法或不想在服务器上运行 JavaScript，也可以使用相同的方法。在这种情况下，将`HTML/CSS/JS`导出（`Next.js`的`next export output`，`Gatsby`的`default`）替换为`/some-app/`。

## 在现有页面的一部分中使用 React

假设有一个其他技术栈（无论是 Rails 这样的服务端技术，还是 Backbone 那样的客户端技术）构建的现有页面，并且想要在该页面的某个位置渲染交互式的 React 组件。这是集成  React 的常见方式一一实际上，这也正是多年来大多数情况下 meta 使用 React 的方式！

你可以分两步进行：

1、配置`JavaScript`环境，以便使用`JSX语法`、`import`和`export`语法将代码拆分为模块，以及从`npm`包注册表中使用包（例如 `React`）。

2、在需要的位置渲染 React 组件。

确切的方法取决于现有的页面配置，因此让我们对一些细节进行说明。

## 步骤1：配置模块化的 JavaScript 环境

模块化的 JavaScript 环境 可以让你在单一的文件中编写 react组件，而不是在一个文件中编写所有的代码。它还可以让你使用其他开发人员在`npm`注册表上发布的一些特别好用的包，包括 React! 如何实现这一点取决于你现有的配置：

- 如果你的应用已经使用 `import` 语句来分割成不同的文件，请尝试利用已有的配置。检查在你的 JavaScript 代码中 编写 `<div />` 是否会导致语法错误。如果有语法错误，你可能需要使用`Babel`转换你的`JavaScript`代码，并启用`Babel React preset`来使用 JSX。

- `如果你的应用没有用于编译JavaScript模块的配置，请使用 Vite 进行配置。 Vite 社区维护了与后端框架（包括 Rails、Django 和 Laravel）`的 [`许多集成项目`](https://github.com/vitejs/awesome-vite#integrations-with-backends)。如果你的后端框架没有列出，请[`按照此指南`](https://cn.vitejs.dev/guide/backend-integration)手动将Vite构建集成到你的后端。

如果想要检查你的配置是否有效，可以在项目文件夹中运行以下命令：
```js
// Terminal

npm install react react-dom
```
然后在你的 JavaScript 主文件（它可能被称为 `index.js` 或 `main.js`）的顶部添加以下代码：

```js
import { createRoot } from 'react-dom/client';

document.body.innerHTML = '<div id="app"></div>';

// 渲染你的 React 组件
const root = createRoot(document.getElementById('root'));
root.render(<h1>Hello, world</h1>);
```
[用 createRoot 搞的一个document元素 渲染h1 hello world](./images/7-将React添加到现有项目中/1.png)

如果页面的全部内容都被替换为”Hello, world!“，则一切正常！那么继续阅读。

> 注意

第一次将模块化 JavaScript 环境集成到现有项目中可能会让人感到害怕，但这是值得的！如果遇到困难，请尝试我们的[`社区资源`](https://zh-hans.react.dev/community)或[`Vite Chat`](https://discord.com/invite/aYVNktYeEB)。


## 步骤2：在页面的任何位置渲染React组件

在上一步中，此代码将被放在主文件的顶部：

```js
import { createRoot } from 'react-dom/client';

// 清除现有的 HTML 内容
document.body.innerHTML = '<div id="app"></div>';

// 渲染你的 React 组件
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

当然，你实际上并不想清除现在的HTML内容！

那么请删除此代码。

相反，你可以想要HTML中特定的位置渲染React组件。打开 HTML 页面（或用于生成它的服务端模板），并向任意一个标签添加一个唯一的`id`属性，例如：

```js
<!-- 你的HTML 代码某处 -->

<nav id="navigation"></nav>

<!-- 其他 HTML 代码 -->
```

这样可以使用`document.getElementById`查找到该HTML元素，并将其传递给`createRoot`，以便可以在其中渲染自己的 React 组件：

// index.html
```html
<!DoCTYPE html>
<html>
  <head>
    <title>My app</title>
  </head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js
// index.js
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: 实际实现一个导航栏
  return <h>Hello from React!</h>
}

const domNode = document.getElementById('navigation')
const root = createRoot(domNode);
root.render(<NavigationBar />)
```
[某个元素渲染出来](./images/7-将React添加到现有项目中/2.png)

请注意`index.html`中的原始 HTML 内容是如何保留的，但现在你自己的 `NavigationBar` React 组件出现在 HTML 的 `<nav id="navigation" />`中。阅读[`createRoot 用法文档`](https://zh-hans.react.dev/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) 以了解如何在现有 HTML 页面中渲染 React 组件。

当在现有项目中采用 React 时，通常会从小型交互式组件（例如按钮）开始，然后逐渐”向上移动“，直到最终整个页面都由 React 构建。到那个时候，我们建议立即迁移到 [`一个 React 框架`](https://zh-hans.react.dev/learn/start-a-new-react-project)，以充分利用React的优势。

## 在现有的原生移动应用中使用 React Native

[`React Native`](https://reactnative.dev/)也可以逐步集成到现有的原生应用中。如果已经有一个现有的 Android (Java 或 Kotlin) 或 iOS （`Objective-C` 或 `Swift`）原生应用，请[`按照本指南`](https://reactnative.dev/docs/integration-with-existing-apps)将 React Native 添加到其中。





