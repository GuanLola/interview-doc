## what

集合。

代码
- 抽象。
- 封装。
- 复用。

- 依赖管理。

没有代码块，就会死。
死的点在：
- （变量、方法）污染全局。
-  `script`顺序从上到下。
- 代码多就复杂。
- 多人开发，引用会让人奔溃。

有这些模块化：
- commonjs（nodejs的早期）。
- amd（require.js）。
- cmd（sea.js）。

amd。
`require.js`。
```js
/** main.js 入口文件/主模块 **/
// 首先用config()指定个模块路径和引用名。
require.config({
  baseUrl: 'js/lib',
  paths: {
    'jquery': 'jquery.min', // 实际路径为js/lib/jquery.min.js
    'underscore': 'underscore.min',
  }
});
// 执行基本操作
require(['jquery', 'underscore'], function ($, _) {
  // some code here
})
```
cjs

一般用在后端。
```js
// a.js
module.exports = { foo, bar }

// b.js
const { foo, bar } = require('./a.js')
```

- 都在自己的模块作用域里做。不污染全局。
- 同步加载的，前面没完成，后面休想。
- 有缓存。下次拿缓存。要是不想拿缓存。得清。
- `require`输出的值是拷贝。你改东西，它不变。

es6的module。
为前端和后端都能很好地用。
就是上面cjs和amd的简单化版本。

cjs这样写。模块就是对象，输入就得找对象属性。
```js
// commonjs模块
let { stat, exists, readfile } = require('fs');

// 等同于
let _fs = require('fs');
let stat = _fs.stat;
let exists = _fs.exists;
let readfile = _fs.readfile;
```
`es6`的`module`。
静态化。
确定依赖关系。
确定输入和输出的变量。
```js
// es6模块
import { stat, exists, readFile } from 'fs';
```
加载3个方法。
其他不加载。

## 用

- `export`。去定对外的接口。
- `import`。去引进来人家的东西。

## export

要把。
变量。
传出去。
用`export`。

```js
// profile.js
export var firstName = 'Michael';
export var lastName = 'Jackson';
export var year = 1958;
```
或者
```js
var firstName = 'Michael';
var lastName = 'Jackson';
var year = 1958;

export { firstName, lastName, year };
```

抛出。
函数。
类。
```js
export function multiply(x, y) {
  return x * y;
}
```
重命名。
```js
function v1() {
  ...
}
function v2() {
  ...
}

export {
  v1 as streamV1,
  v2 as streamV2,
  v2 as streamLatestVersion
}
```

## import

```js
// main.js
import { firstName, lastName, year } from './profile.js';

function setName(element) {
  element.textContent = firstName + ' ' + lastName;
}
```
重命名。
```js
import { lastName as surname } from './profile.js'
```
用整个模块。
```js
// circle.js
export function area(radius) {
  return Math.PI * radius * radius;
}

export function circumference(radius) {
  return 2 * Math.PI * radius;
}

// main.js
import * as circle from './circle';
console.log(circle) // { area: area, circumference: circumference }
```
输入的变量。
都是只读。
是对象。
可以改。
```js
import { a } from './xxx.js'

a.foo = 'hello'; // 合法操作
a = {} // a是只读，改就是不对。
```
就算对象，你也不能改。尽量不改人家里面的玩意。

`from`后面跟着路径。
```js
import { a } from './a';
```
如果只是个名。
就需要配文件。
告诉模块位置在哪。
```js
import { myMethod } from 'util';
```

可以提升。
```js
foo();

import { foo } from 'my_module';
```
多次重复导入。
其实就执行一次。
```js
import 'lodash';
import 'lodash';
```

`export default`。
```js
// export-default.js
export default function () {
  console.log('foo');
}
```
// 指定给它个名字
```js
// import-default.js
import customName from './export-default';
customName(); // 'foo'
```
## 动态加载

动态加。
可以改路径。

```js
import('/modules/myModule.mjs')
  .then((module) => {
    console.log(module);
  })
```
## 复合。
```js
export { foo, bar } from 'my_module';

// 等于
import { foo, bar } from 'my_module';
export { foo, bar };
```
能`as`重命名。能`*`搞所有。

## 场景。

vue。
react。
模块化很常用。


vue
```js
<template>
  <div class="App">
    组件化开发 - 模块化
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>
```
react
```js
function App() {
  return (
    <div className="App">
      组件化开发 - 模块化
    </div>
  )
}

export default App;
```