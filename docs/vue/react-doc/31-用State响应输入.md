## 用 State 响应输入

React 控制 UI 的方式是声明式的。你不必直接控制 UI 的各个部分，只需要声明组件可以处于的不同状态，并根据用户的输入在它们之间切换。这与设计师对 UI 的思考方式很相似。

- 了解声明式 UI 编程与命令式 UI 编程有何不同。

- 了解如何列举组件可能处于的不同视图状态。

- 了解如何在代码中触发不同视图状态的变化。

## 声明式 UI 与命令式 UI 的变化

当你设计 UI 交互时，可能会去思考 UI 如何根据用户的操作而相应变化。想象一个让用户提交答案的表单：

- 当你向表单输入数据时，“提交”按钮会随之变成`可用状态`。

- 当你点击“提交”后，表单和提交按钮都会随之变成`不可用状态`，并且会加载动画会随之`出现`。

- 如果网络请求成功，表单会随之`隐藏`，同时“提交成功”的信息会随之`出现`。

- 如果网络请求失败，错误信息会随之`出现`，同时表单又变为`可用状态`。

在`命令式编程`中，以上的过程直接告诉你如何去实现交互。你必须去根据要发生的事情写一些明确的命令去操作 UI。对此有另一种理解方式，想象一下，当你坐在车里的某个人旁边，然后一步一步地告诉他该去哪。

他并不知道你想去哪，只想跟着命令行动。（并且如果你发出了错误的命令，那么你就会到达错误的地方）正因为你必须从加载动画到按钮地“命令”每个元素，所以这种告诉计算机如何去更新UI的编程方式被称为`命令式编程`。

在这个命令式 UI 编程的例子中，表单`没有使用`React生成，而是使用原生的[`DOM`](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model):

```html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red"></p>
</form>

<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 20px; padding: 0; }
</style>
```

```js
// index.js

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');

let button = document.getElementById('button');

let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');

form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm (answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'))
      }
    }, 1500);
  })
}

async function handleFormSubmit(e) {
  e.preventDefault();

  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);

  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }

}
```

对于独立系统来说，命令式地控制用户界面的效果也不错，但是当处于更加复杂的系统中时，这会造成管理的困难程度指数级地增长。如同示例一样，想象一下，当你想更新这样一个包含着不同表单的页面时，你想要添加一个新 UI 元素或一个新的交互，为了保证不会因此产生新的`bug`（例如忘记去显示或隐藏一些东西，你必须十分小心地去检查所有已经写好的代码。

React 正是为了解决这样的问题而诞生的。

在 React 中，你不必直接去操作 UI -- 你不必直接启用、关闭、显示或隐藏组件。相反，你只需要`声明你想要显示的内容`，React就会通过计算得出该如何去更新 UI。想象一下，当你上了一辆出租车并且告诉司机你想去哪，而不是事无巨细地告诉他该如何走。将你带到目的地是司机的工作，他们甚至可能知道一些你没有想过并且不知道的捷径！

## 声明式地考虑UI

你已经从上面的例子看到如何去实现一个表单了，为了更好地理解如何在 React 中思考，接下来你将会学到如何用 React 重新实现这个 UI：

1、`定位`你的组件中不同的视图状态

2、`确定`是什么触发了这些 state 的改变。

3、`表示`内存中的 state （需要使用`useState`）。

4、`删除`任何不必要的 state 变量。

5、`连接`事件处理函数去设置 state。

## 步骤1：定位组件中不同的视图状态

在计算机科学中，你或许听过可处于“状态”之一的[“状态机”](https://en.wikipedia.org/wiki/Finite-state_machine)。如果你有雨设计师一起工作，那么你可能已经见过不同“视图状态”的模拟图。正应为 React 站在设计与计算机科学的交点上，因此这两种思想都是灵感的来源。

首先，你需要去可视化 UI 界面中用户可能看到的所有不同的“状态”：

- `无数据`：表单有一个不可用状态的“提交”按钮。

- `输入中`：表单中一个可用状态的“提交”按钮。

- `提交中`：表单完全处于不可用状态，加载动画出现。

- `成功时`：显示“成功”的消息而非表单。

- `错误时`：与输入状态类似，但会多错误的消息。

像一个设计师一样，你会想要在你添加逻辑之前去“模拟”不同的状态或创建“模拟状态”。例如下面的例子，这是一个对表单可视部分的模拟。这个模拟被一个`status`的属性控制，并且这个属性的默认值为`empty`。

```js
export default function Form({ status = 'empty' }) {

  if (status === 'success') {
    return <h1>That's right</h1>
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

可以随意命名这个属性，名字并不重要。试着将`status = 'empty'`改成`status = 'success'`，然后你就会看到成功的信息出现。模拟可以让你在书写逻辑前快速迭代UI。这是同一组件的一个更加充实的原型，仍然由`status`属性“控制”：

```js

export default function Form({ status = 'empty' }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />

        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>

        {status === 'error' &&
          <p className="Error">
            Good Guess but a wrong answer. Try again!
          </p>
        }
      </form>
    </>
  )
}
```

`同时展示大量的视图状态`

如果一个组件有多个视图状态，你可以很方便地将它们展示在一个页面中：

```js
// Form.js
export default function Form({ status }) {

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  )
}
```


```js
// App.js
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form {status}</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```
类似这样的页面通常被称作“living styleguide”或者“storybook”。

## 步骤2：确定是什么触发了这些状态的改变

你可以触发 state 的更新来响应两种输入：

- `人为`输入。比如点击按钮、在表单中输入内容，或导航到链接。

- `计算机`输入。比如网络请求得到反馈、定时器被触发，或加载一张图片。

人为输入

计算机输入

以上两种情况中，你必须设置 [state 变量](https://zh-hans.react.dev/learn/state-a-components-memory#anatomy-of-usestate) 去更新UI。对于正在开发中的表单来说，你需要改变 state 以响应几个不同的输入：

- `改变输入框中的文本时`（人为）应该根据输入框的内容是否是`空值`，从而决定将表单的状态从空值状态切换到`输入中`或切换回原状态。

- `点击提交按钮时`（人为）应该将表单的状态切换到`提交中`的状态。

- `网络请求成功后`（计算机）应该将表单的状态切换到`成功`的状态。

- `网络请求失败后`（计算机）应该将表单的状态切换到`失败`的状态，与此同时，显示错误信息。

## 注意

注意，人为输入通常需要[事件处理函数](https://zh-hans.react.dev/learn/responding-to-events)!

为了可视化这个流程，请尝试在纸上画出图形标签以表示每个状态，两个状态之间的改变用箭头表示。你可以像这样画出很多流程我把那个且在写代码前解决许多bug。

Empty ->(Start typing) Typing ->(Press submit) Submitting ->(Network error) Error
                                                          ->(Network success) Success

## 步骤3：通过 `useState` 表示内存中的 `state`

接下来你会需要在内存中通过`useState`表示组件中的视图状态。诀窍很简单： `state`的每个部分都是“处于变化中的”，并且`你需要让“变化的部分”尽可能的少`。更复杂的程序会产生更多 bug ！

先从`绝对必须`存在的状态开始。例如，你需要存储输入的`answer`以及用于存储最后一个错误的`error`（如果存在的话）：

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

接下来，你需要一个状态变量来代表你想要显示的那个可视状态。通常有多种方式在内存中表示它，因此你需要进行实验。

如果你很难立即想出最好的办法，那就先从添加足够多的 state 开始，`确保`所有可能的视图状态都囊括其中：

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

你最初的想法或许不是最好的，但是没关系，重构 state 也是步骤中的一部分！

## 步骤4：删除任何不必要的 state 变量

你会想要避免 state 内容中的重复，从而只需要关注那些必要的部分。花一点时间来重构你的 state 结构，会让你的组件容易被理解，减少重复并且避免歧义。你的目的是`防止出现在内存中的 state 不代表任何你希望用户看到的有效UI的情况`。（比如你绝对不会想要在展示错误的同时禁用掉输入框，导致用户无法纠正错误！）

这有一些你可以问自己的，关于 state 变量的问题：

- `这个 state 是否会导致矛盾`？例如，`isTyping`与`isSubmitting`的状态不能同时为`true`。矛盾的产生通常说明了这个`state`没有足够的约束条件。两个布尔值有四种可能的结合，但是只有三种对应有效的状态。为了将“不可能”的状态移除，你可以将他们合并到一个`status`中，它的值必须是`typing`、`submitting`以及`success`这三个中的一个。

- `相同的信息是否已经在另一个state变量中存在？`另一个矛盾：`isEmpty`和`isTyping`不能同时为`true`。通过使它们成为独立的state变量，可能会导致它们不同步并导致bug。幸运的是，你可以移除`isEmpty`转而用`message.length === 0`。

- `你是否可以通过另一个state变量的相反值得到相同的信息` ?`isError`是多余的，因为你可以检查`error !== null`。

在清理之后，你只剩下3个(从原本的7个！)必要的`state`变量：

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

正是因为你不能在不破坏功能的情况下删除其中任何一个状态变量，因此你可以确定这些都是必要的。

`通过 reducer` 来减少“不可能”state

尽管这三个变量对于表示这个表单的状态来说已经足够好了，仍然是有一些中间状态并不是完全有意义的。例如一个非空的`error`当`status`的值为`success`时没有意义。为了更精确地模块化状态，你可以[将状态提取到一个reducer中](https://zh-hans.react.dev/learn/extracting-state-logic-into-a-reducer)。Reducer 可以让你合并多个状态变量到一个对象中并巩固所有相关的逻辑！

## 步骤5：连接事件处理函数以设置 state

最后，创建事件处理函数去设置 state 变量。下面是绑定好事件的最终表单。

```js

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>;
  }

  function submitForm(answer) {
    // Pretend it's hitting the network.
    return new Promise(() => {
      setTimeout(() => {
        let shouldError = answer.toLowerCase() !== 'lima'
        if (shouldError) {
          throw new Error('Good guess but a wrong answer, try again!')
        } else {
          resolve()
        }
      }, 1500);
    })
  }

  function handleSubmit() {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success')
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <o>
        In which city is there a billboard that turns air into drinkable water?
      </o>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  )
}
```
尽管这些代码相对于最初的命令式的例子来说更长，但是却更加健壮。将所有的交互变成`state`的改变，可以让你避免之后引入新的视图状态后导致现有 state 被破坏。同时也使你在不必改变交互逻辑的情况下，更改每个状态对应的UI。

## 摘要

- 声明式编程意味着为每个视图状态声明UI而非细致地控制 UI （命令式）。

- 当开发一个组件时：

1、写出你的组件中所有的视图状态。

2、确定是什么处罚了这些state的改变。

3、通过`useState`模块化内存中的state。

4、删除任何不必要的 state 变量。

5、连接事件处理函数去设置 state。

## 尝试一些挑战

1、添加和删除一个 CSS  class

尝试实现当点击图片时删除外部`<div>`的 CSS class `background--active`，并将`picture--active`的`CSS class`添加到`<img>`上。当再次点击背景图片时将恢复最开始的`CSS class`。

视觉上，你应该期望当点击图片时会移除紫色的背景，并且高亮图片的边框。点击图片外面时高亮背景并且删除图片边框的高亮效果。

```js
// App.js
import { useState } from 'react';

export default function Picture() {
  const [isPicture, setIsPicture] = useState(false);

  return (
    <div className={isPicture ? 'background' : 'background background--active'}>
      <img
        className={ isPicture ? 'picture picture--active' : 'picture' }
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/SquwVYb1.jpeg"
        onClick={e => { setIsPicture(!isPicture) }}
      />
    </div>
  )
}
```

答案

这个组件有两个视图状态：当图片处于激活状态时以及当图片处于非激活状态时：

- 当图片处于激活状态时， CSS class 是`background` 和 `picture picture--active`。

- 当图片处于非激活状态时，CSS class 是 `background background--active` 和 `picture`。

一个布尔类型的`state`已经足够表示图片是否处于激活状态。最初的工作紧紧是移除或添加 CSS class。然而在 React 中你需要去描述什么是你想要看到的而非操作 UI 元素。因此你需要基于当前 state 去计算这两个 `CSS class`。同时你需要去[阻止冒泡行为](https://zh-hans.react.dev/learn/responding-to-events#stopping-propagation)，只有这样点击图片的时候不会触发点击背景的回调。

通过点击图片然后点击图片外围来确定这个版本可用：

```js
// App.js
import { useState } from 'react';

export default function Picture() {
  const [isPicture, setIsPicture] = useState(false);

  function handleChangePicture(e, type) {
    e.stopPropagation();
    if(isPicture && type === 'picture') {
      setIsPicture(false)
    }
    if (!isPicture && type === 'background') {
      setIsPicture(true)
    }
  }

  return (
    <div
      onClick={e => { handleChangePicture(e, 'background') }}
      className={ isPicture ? 'background' : 'background background-active' }
    >
      <img
        className={ isPicture ? 'picture picture--active' : 'picture' }
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/SqwVYb1.jpeg"
        onClick={e => { handleChangeIsPicture(e, 'picture') }}
      />
    </div>
  )
}
```

这个组件有两个视图状态：当图片处于激活状态时以及当图片处于非激活状态时：

- 当图片处于激活状态时，`CSS class`是`background`和`picture picture--active`。

- 当图片处于非激活状态时，`CSS class`是`background background--active`和`picture`

一个布尔类型的`state`已经足够表示图片是否处于激活状态。最初的工作仅仅是移除或添加`CSS class`。然而在 React 中你需要去描述什么是你想要看到的而非操作UI元素。因此你需要基于当前 state 去计算这两个 CSS class。同时你需要去[阻止冒泡行为](https://zh-hans.react.dev/learn/responding-to-events#stopping-propagation)，只有这样点击图片的时候不会触发点击背景的回调。

通过点击图片然后点击图片外围来确定这个版本可用：

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';

  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background-active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/SqwVYb1.jpeg"
      />
    </div>
  )
}
```

或者，你可以返回两个单独的 JSX 代码块：

```js
// App.js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/SqwVYb1.jpeg"
          onClick={() => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/SqwVYb1.jpeg"
        onClick={() => setIsActive(true)}
        onClick={() => setIsActive(true)}
      />
    </div>
  )
}
```

请记住，如果两个不同的 JSX 代码块描述着相同的树结构，它们的嵌套（第一个`<div>` -> 第一个`<Img>`）必须对齐。否则切换`isActive`会再次在后面创建整个树结构并且[重置 state](https://zh-hans.react.dev/learn/preserving-and-resetting-state)。这也就是为什么当一个相似的 JSX 树结构在两个情况下都返回的时候，最好将它们协程一个单独的 JSX。

2、个人信息编辑器

这是 一个通过纯 `JavaScript` 和 `DOM` 实现的小型表单。先来随便使用一下来看看它有什么功能吧：

```html
// index.html

<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

```js
// index.js

function handleFormSubmit(e) {
  e.preventDefault();

  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';

    hide(firstNameText);
    hide(lastNameText);
    show(firstNameINput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';

    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloTExt.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementByID('form');
let editButton = document.getElementById('editButton');

let firstNameInput = document.getElementById('firstNameInput');
let firstNameInput = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('firstNameInput');
let lastNameText = document.getElementById('lastNameText');

let helloText = document.getElementById('helloText');

form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

这个表单在两种模式间切换：编辑模式，你可以看到输入框；查看模式，你只能看到结果。按钮的标签会根据你所处的模式在“编辑”和“保存”两者中切换。当你改变输入框的内容时，欢迎信息会最下面实时更新。

你的任务是在下方的沙盒中用 React 再次实现它。为了方便，标签已经转换为 JSX，但是你需要让它像原版那样显示和隐藏输入框。

也要确保它在底下更新文本内容！

```js
// App.js
import { useState } from 'react';

export default function EditProfile() {
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');
  const [editing, setEditing] = useState(false);

  function handleFormSubmit() {
    setEditing(!editing);
  }

  function handleFormFirstName(e) {
    setFirstName(e.target.value);
  }

  function handleFormLastName(e) {
    setLastName(e.target.value);
  }

  return (
    <form onSubmit={e => {e.preventDefault(); handleFormSubmit()} }>
      <label>
        First name:{' '}
        {
          !editing
            ? <b>{firstName}</b>
            : <input value={firstName} onChange={e => handleFormFirstName(e)} />
        }
      </label>
      <label>
        Last name:{' '}
        {
          !editing
            ? <b>{lastName}</b>
            : <input value={lastName} onChange={e => handleFormLastName(e)} />
        }
      </label>
      <button type="submit">
        {!editing ? 'edit' : 'save'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
      <p></p>
    </form>
  )
}
```

## 答案

你需要两个 state 变量来保存输入框中的呢日用：`firstName`和`lastName`。同时你还会需要一个`isEditing`的`state`变量来保存是否显示输入框的状态。你应该不需要`fullName`变量，因为全名可以由`firstName`和`lastName`组合而成。

最终，你应该根据`isEditing`的值使用[条件渲染](https://zh-hans.react.dev/learn/conditional-rendering)来决定显示还是隐藏输入框。

```js
// App.js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={ e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={fistName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )
        }
      </label>

      <label>
        Last name: {' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>{Hello, {firstName} {lastName}}!</i></p>
    </form>
  )
}
```
这个解决方案与最初命令式的代码相比，它们有什么不同？

3、不使用 React 去重构命令式的解决方案

这是之前的挑战中的没有使用 React 而写的命令式代码:

```html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameINput"
      value="Jane"
      style="display: none"
    >
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none"
    >
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

```js
// index.js

function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  )
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value = " " +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(e) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');

let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');

let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');

let helloText = document.getElementById('helloText');

form.onsubmit = handleFormSubmit;

firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

如果不用 React，你能否将这段代码重构得像 React 版本一样健壮？如果要让它的 state 像 React 版本一样清晰且明确，那么这段代码代码又会协程怎样的呢？

如果你不知道该从哪里入手，下面的代码已经有了大部分的结构。如果你从这里开始的饿话，只需要在`updateDOM`函数中补充缺失的逻辑即可。（需要时请参考原始代码）

```html
// index.html
<form id="form">
  <label>
    First nam:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none"
    >
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none"
    >
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

```js
// index.js
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save profile';
    // TODO: show inputs, hide content
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  // TODO: update text labels
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');

let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameInput');

let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');

let helloText = document.getElementById('helloText');

form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

相距

差了文字的展示。

```js

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save profile';
    // TODO: show inputs, hide content
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  // TODO: update text labels
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;

  helloText.textContent = {
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  };
}
```

你所写的`updateDOM`函数展示了当你的设置`state`时，React在幕后都做了什么。（而且React不会修改对应state没改变的DOM）。