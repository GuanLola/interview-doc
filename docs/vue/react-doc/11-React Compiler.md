## React Compiler

本页面将为你介绍新的 React Compiler，以及如何成功试用。

> 正在建设中

这些文档仍在不断完善中。更多文档可在 [`React Compiler 工作组代码库`](https://github.com/reactwg/react-compiler/discussions)中找到，并在这些文档更加稳定时被整合进来。

你将会学习到

- 开始使用 `React Compiler`。

- 安装 `React Compiler` 和 `ESLint`插件。

- 疑难疑答。

> 注意

React Compiler 是一个处于 Beta 阶段的新的编译器，我们将其开源以获取社区的早期反馈。虽然 Meta 等公司已经在生产中使用它，但是能否在你的应用陈故乡中使用它取决于代码库的健康状态以及你遵守 [`React 规则`](https://zh-hans.react.dev/reference/rules) 的程序。

最新的 Beta 版本发布于 @beta 标签，每日实验版发布于 @experimental 标签。

`React Compiler` 是一个新编译器，我们将其开源以获取社区的早期反馈。它是一个仅在构建时使用的工具，可以自动优化你的React应用程序。它可以与纯 JavaScript 一起使用，并且了解 [`React 规则`](https://zh-hans.react.dev/reference/rules)，因此你无需冲洗额任何代码即可使用它。

编译器还包括一个 [`ESLint插件`](https://zh-hans.react.dev/learn/react-compiler#installing-eslint-plugin-react-compiler)，可以在你的编辑器中直接显示编辑器的分析结果。`我们强烈建议大家使用linter`。不过`linter`并不需要安装编译器，一次即使你还没有准备好尝试编译器也可以使用它。

编译器目前处于`beta`阶段，并且可以在 `React 17+` 应用程序和库上使用。安装方式如下：

```js
// Terminal

npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
```
或者使用 Yarn：

```js
// Terminal

yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
```
如果你还没有使用 React 19, 请参考 [`此内容`](https://zh-hans.react.dev/learn/react-compiler#using-react-compiler-with-react-17-or-18) 以获得进一步说明。

## 编译器是做什么的？

为了优化应用程序，React Compiler 会自动对你的代码进行记忆化处理。你可能已经熟悉了像`useMemo`、`useCallback`和`React.memo`这样的API，通过这些 API，你可以告诉 React，如果输入没有发生变化，应用程序的某些部分不需要重新计算，从而减少更新时的工作量。

虽然这些功能很强大，但很容易忘记应用记忆化或者错误地应用它们。这可能会导致更新效率低下，因为 React 必须检查 UI 中没有任何有意义的更改的部分。

编译器利用其对 JavaScript 和 React 规则的了解，自动对组件和钩子中的值或值组进行记忆化。如果它检测到规则的破坏，它将自动跳过那些组件或钩子，并继续安全地编译其他代码。

> 注意

React Compiler 可以静态检测 React 故意则何时被破坏，并安全地选择不优化受影响的组件或者钩子。编译器没有必要对代码块进行100%的优化。

如果你的代码库已经非常好地进行记忆化处理，你可能不会指望通过编译器看到主要的性能改进。然而，在实践中，手动正确记忆化导致性能问题的依赖关系是很棘手的。

---

> 深入探讨

React Compiler 添加了什么样的记忆？

React Compiler 的初始版本主要专注于`改善更新性能`（重新渲染现有组件），因此它专注于一下两种用例：

1、`跳过组件的级联重新渲染`

重新渲染 `<Parent />` 会导致其组件树中的许多组件重新渲染，即使只有`<Parent />`发生了改变。

2、`从React外部跳过昂贵计算`

例如，在需要该数组的组件或钩子内部调用`expensivelyProcessAReallyLargeArrayOfObjects()`

优化重新渲染

React 允许你将你的 UI 表达为它们当前状态的函数（更具体地说：它们的属性、状态和上下文）。在当前的实现中，当组件的状态发生变化时，React将重新渲染该组件及其所有子组件 ———— 除非你使用 `useMemo()`、`useCallback()`或者`React。memo()`应用了某种形式的手动记忆。例如，在以下示例中，每当`<FriendList>`的状态发生变化时，`<MessageButton>`将重新呈现：
```js
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();

  if (friends.length === 0) {
    return <NoFriends />;
  }

  return (
    <div>
      <span>{onlineCount} online</span>

      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}

      <MessageButton />
    </div>
  )
}
```
## 在 React Compiler Playground 中查看此示例

React Compiler 会自动应用等效的手动记忆，确保只有应用的相关部分在状态发生变化时重新渲染，这有时被称为“细粒度反应”。在上面的例子中，React Compiler 确定 `<FriendListCard />` 的返回值即使在`friends`发生变化时也可以重用，并且可以避免重新创建此 JSX， 并避免在 `onlineCount` 变化时重新渲染 `<MessageButton>。

**昂贵计算也会被记忆**

编译器还可以自动记忆渲染过程中使用的昂贵计算：

```js
// 由于这不是组件或钩子，React Compiler 不会进行记忆
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// 由 React Compiler 进行了记忆化，因为这是一个组件
function TableContainer({ items }) {
  // 这个函数调用将被记忆：
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```

**在 React Compiler Playground 中查看此示例**

但是，如果 `expensivelyProcessAReallyLargeArrayOfObjects` 确实是一个昂贵的函数，你可能需要考虑在 React 之外实现它自己的记忆，因为：

- `React Compiler`只记住 React 组件和钩子，而不是每个函数。

- `React Compiler`的记忆不会在多个组件或钩子之间共享。

因此，如果在许多不同的组件中使用 `expensiveProcessAReallyLargeArrayOfObjects`，即使传递相同的`items`，那昂贵的计算也会被重复运行。我们建议先进行[`性能分析`](https://zh-hans.react.dev/reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive)，看看是否真的那么昂贵，然后再使代码更加复杂。

---

## 我应该尝试一下编译器吗？

请注意，编译器仍处于`Beta`阶段，存在许多不完善之处。虽然它已经在 Meta 等公司的生产环境中使用过，但将编译器应用于你的应用程序声场环境将取决于你的代码库的健康状态以及你是否遵循了[`React的规则`](https://zh-hans.react.dev/reference/rules)。

`你现在不必急着使用编译器。在采用它之前等到它达到稳定版本是可以的。`然而，我们确实赞赏在你的应用程序中进行小型试验，以便你可以向我们[`提供反馈`](https://zh-hans.react.dev/learn/react-compiler#reporting-issues)，帮助使编译器更好。

## 开始

除了这些文档以外，我们还建议查看 [`React Compiler 工作组`](https://github.com/reactwg/react-compiler)，以获取有关编译器的更多信息和讨论。

## 安装 eslint-plugin-react-compiler

React Compiler 还为 ESLint 插件提供支持。ESLint 插件可以独立于编译器使用，这意味着即使你不使用编辑器，也可以使用 `ESLint` 插件。

```js
// Terminal

npm install -D eslint-plugin-react-compiler@beta
```

然后，将其添加到你的 ESLint 配置中：

```js
import reactCompiler from 'eslint-plugin-react-compiler'

export default [
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
]
```

或者使用已弃用的 eslintrc 配置格式：

```js
module.exports = {
  plugins: [
    'eslint-plugin-react-compiler',
  ],
  rules: {
    'react-compiler/react-compiler': 'error',
  }
}
```

ESLint 插件将在编辑器中显示任何违反 React 规则的行为。当它这样做时，这意味着编译器跳过了优化该组件或钩子。这是完全可以的，编译器可以恢复并继续优化代码库中的其他组件。

> 注意

`你不必立即修复所有的违反 ESLint 规则的代码。`你可以按照自己的节奏来处理它们，以增加被优化的组件和钩子的数量，但在你可以使用编译器之前并不需要修复所有问题。

## 将编译器应用到您的代码库

`现有项目`

编译器旨在遵循 React 规则的功能组件和钩子。它还可以处理违反这些规则的代码，通过跳过这些组件或钩子来终止执行。然而，由于 JavaScript 的灵活性，编译器无法捕捉到每一个可能的违规行为，可能会出现错误的负面编译：也就是说，编译器可能会意外地编译出一个违反[`React 规则`](https://zh-hans.react.dev/reference/rules)的组件和钩子，这可能导致未定义的行为。

因此，要在现有项目中成功采用编译器，我们建议你现在项目代码中的一个小目录中运行它。你可以通过将编译器配置为仅在一组特定的目录上运行来执行此操作：

```js
const ReactCompilerConfig = {
  sources: (filename) => {
    return filename.indexOf('src/path/to/dir') !== -1;
  },
};
```
当你对编译器更有信心时，你也可以将覆盖范围扩展到其他目录，并逐渐将其推出到整个应用程序。

## 新项目

如果你正在启动一个新项目，你可以再整个代码库上启用编译器，这是默认行为。

## 在 React 17 或 18 中使用 React Compiler

React Compiler 与 React 19 RC 配合使用效果更佳。如果你无法升级，可以安装额外的 `react-compiler-runtime`包来编译代码并在 19 之前的版本上运行。但请注意，支持的最低版本是 17.

```js
// Terminal

npm install react-compiler-runtime@beta
```

你还应该在编译器配置中添加正确的 `target`，值为你所使用的 React 大版本。

```js
// babel.config.js
const ReactCompilerConfig = {
  target: '18' // '17' | '18' | '19'
};

module.exports = function () {
  return {
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig],
    ],
  }
};
```

## 在库中使用 Compiler

React Compiler 还可用于编译库。由于 React Compiler 需要在代码转换之前的源码上运行，因此应用程序无法使用 pipeline 来编译所使用的库。因此我们建议库维护人员使用编译器独立编译和测试他们的库，并将编译后的代码发布到`npm`。

由于库的代码是预编译的，因此用户无需启用 Compiler 即可从编译器的自动记忆化中收益。如果库的 target 不是 React 19, 请指定一个最小的 [`target 并且将 react-compiler-runtime 添加为直接依赖`](https://zh-hans.react.dev/learn/react-compiler#using-react-compiler-with-react-17-or-18)。这个运行时包将根据应用程序的版本使用正确的API实现，并在必要时填充哦缺失的 API。

库代码通常需要更复杂的模式和脱围机制。因此我们建议你进行足够的测试，以便发现在库中使用编译器时可能出现的任何问题。对于任何发现的问题都可以使用[`'use no memo' 指令`](https://zh-hans.react.dev/learn/react-compiler#something-is-not-working-after-compilation)来选择退出对特定组件或者Hook的自动记忆化。

与应用程序类似，无需 100% 编译组件或者 Hook 就可以看到编译器带来的好处。一个好的起点可能是确定库中对性能最敏感的部分，并确保它们没有违反[`React 规则`](https://zh-hans.react.dev/reference/rules)，你可以通过使用`eslint-plugin-react-compiler`来完成。

## 用法

### Babel

```js
// Terminal

npm install babel-plugin-react-compiler@baba
```
编译器包含一个 Babel 插件， 你可以在构建流水线中使用它来运行编译器。

安装后，请将其添加到你的 Babel 配置中。请注意，编译器必须首先在流水线中运行。

```js
// babel.config.js
const ReactCompilerConfig = {/* ... */};

module.exports = function () {
  return (
    plugins: [
      ['babel-plugin-react-compiler', ReactCompilerConfig], // 必须首先运行！
    ],
  );
}
```

`babel-plugin-react-compiler` 应该在其他 Babel 插件之前运行，因为编译器需要输入源信息进行声音分析。

## Vite

如果你使用 Vite，你可以将插件添加到 `vite-plugin-react`中:

```js
// vite.config.js
const ReactCompilerConfig = {/* ... */};

export default defineConfig(() => {
  return {
    plugins: [
      react([
        babel: {
          plugins: [
            ['babel-plugin-react-compiler', ReactCompilerConfig],
          ]
        }
      ])
    ]
  }
})
```

## Next.js

请参考 [`Next.js文档`](https://nextjs.org/docs/app/api-reference/next-config-js/reactCompiler) 来了解更多信息。

## Remix

安装 `vite-plugin-babel`，并将编译器的 Babel 插件添加到其中：

```js
// Terminal

npm install vite-plugin-babel
```

```js
// vite.config.js
import babel from 'vite-plugin-babel';

const ReactCompilerConfig = {/* ... */};

export default defineConfig({
  plugins: [
    remix([ /* ... */ ]),
    babel({
      filer: /\.[jt]sx?$/,
      babelConfig: {
        presets: ["@babel/preset-typescript", ReactCompilerConfig], // 如果你使用 TypeScript
      }
    })
  ]
})
```

## Webpack

有社区提供的 Webpack loader 可以 [`在这里找到`](https://github.com/SukkaW/react-compiler-webpack)。

## Expo

请参考 [`Expo`](https://docs.expo.dev/guides/react-compiler/) 应用程序中启用和使用 React Compiler。

## Metro(React Native)

React Native 通过 Metro 使用 Babel，因此请参考 [`使用 Babel`](https://zh-hans.react.dev/learn/react-compiler#usage-with-babel) 部分的安装说明。

## Rspack

请参考[`Rspack 文档`](https://rspack.dev/guide/tech/react#react-compiler) 以启用并在 Rspack 应用程序中使用 React Compiler。

## Resbuild

请参考 [`Rebuild 文档`](https://rsbuild.dev/guide/framework/react#react-compiler) 以在 Rsbuild 应用程序中启用和使用 React Compiler。

## 疑难解答

请现在 [`React Compiler Playground`](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAgHgBwjALgAgBMEAzAQygBsCSoA7OXASwjvwFkBPAQU0wAoAlPmAAdNvhgJcsNgB5CTAG4A+ABIJKlCPgDqOSoTkB6RaoDc4gL7iQVoA) 上 创建一个最小的可复现问题，并将其包含在你的错误报告中。你可以在 [`facebook/react`](https://github.com/facebook/react/issues) 仓库中提交 issue。

你也可以通过申请成为成员，在`React Compiler`工作组中提供反馈意见。请查看[`README`](https://github.com/reactwg/react-compiler)以获取更多加入详情。

## 编译器假设什么？

React Compiler 假设你的代码：

1、是有效的，语义化的 JavaScript。

2、在访问可控/可选值和属性之前，测试它们是否已定义（例如，如果使用 TypeScript，则启用 [`strictNullChecks`](https://www.typescriptlang.org/tsconfig/#strictNullChecks)），即: `if (object.nullableProperty) { object.nullableProperty.foo }`或者使用可选链 `object.nullableProperty?.foo`。

3、遵循[`React 规则`](https://zh-hans.react.dev/reference/rules)

React Compiler 可以静态验证 React 的许多规则，并且在检测到错误时会安全地跳过编译。要查看错误，我们建议同时安装 [`eslint-plugin-react-compiler`](https://www.npmjs.com/package/eslint-plugin-react-compiler)。

## 我如何知道我的组件已被优化？

[`React 开发工具`](v5.0及以上版本)对 React Compiler 有内置支持，并会在已被编辑器优化的组件旁边显示“Memo *”徽章。

## 编译后某些内容无法正常工作

如果你安装了 `eslint-plugin-react-compiler`，编译器将在你的编辑器中显示任何违反 React 规则的情况。当它这样做是，意味着编译器跳过了对该组件或钩子的优化。这完全没问题，并且编译器可以恢复并继续优化你代码库中的其他组件。`你不必立即修复所有的违反 ESLint 规则的代码。`你可以按照自己的节奏来处理它们，以增加被优化的组件和钩子的数量。

然而，由于 JavaScript 的灵活和动态性质，不可能全面检测dao9所有情况。在这些情况下，可能会出现错误和未定义的行为，例如无限循环。

如果你的应用在编译后无法正常工作，并且你没有看到任何 ESLint 错误，编译器可能错误地编译了你的代码。为了确认这一点，尝试通过积极选择你认为可能相关的任何组件或钩子，并通过`"use no memo" 指令`退出优化来解决问题。

```js
function SuspiciousComponent() {
  "use no memo"; // 选择不让此组件 React Compiler 进行编译
  // ...
}
```

> 注意

"use no memo"

"use no memo" 是一个临时的逃避机制，它允许你选择不让组件和钩子由 React Compiler 进行编译。此指令不想例如“use client”那样长期存在。

除非绝对必要，否则不建议使用这个指令。一旦你选择退出一个组件或者钩子，它将永久退出，知道指令被移除。这意味着即使你修复了代码，编译器仍然会跳过编译它，除非你移除指令。

当你修复错误时，请确认删除退出指令是否会使问题重新出现。然后使用 [`React Compiler Playground`](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAgHgBwjALgAgBMEAzAQygBsCSoA7OXASwjvwFkBPAQU0wAoAlPmAAdNvhgJcsNgB5CTAG4A+ABIJKlCPgDqOSoTkB6RaoDc4gL7iQVoA)与我们分享一个错误报告（你可以尝试将其减少到一个小的重现，或者如果是开源代码，你也可以直接粘贴整个源代码），这样我们就可以是被并帮助解决问题。

## 其他问题

请查阅[`https://github.com/reactwg/react-compiler/discussions/7`](https://github.com/reactwg/react-compiler/discussions/7)