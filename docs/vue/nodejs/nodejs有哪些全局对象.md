nodejs有哪些全局对象？

全局对象

## 是什么
## 真正的全局对象
## 模块级别的全局变量

## 是什么

在浏览器`JavaScript`中，
通常`window`是全局对象，
而`Nodejs`中的全局对象是`global`。

在`NodeJS`里，
是不可能在最外层定义一个变量，
因为所有的用户代码都是当前模块的，
只在当前模块里可用，
但可以通过`exports`对象的使用将其传递给模块外部。

所以，
在`NodeJS`中，
用`var`声明的变量并不属于全局的变量，
只在当前模块生效。

像上述的`global`全局对象则在全局作用域中，
任何全局变量、函数、对象都是该对象的一个属性值。

## 二、有哪些

将全局对象分为两类：

- 真正的全局对象。
- 模块级别的全局变量。

**真正的全局对象**

下面给出一些常见的全局对象：

- `Class:Buffer`。

- `process`。

- `console`。

- `clearInterval`、`setInterval`。

- `clearTimeout`、`setTimeout`。

- `global`。

**Class:Buffer**

可以处理二进制以及非`Unicode`编码的数据。

在`Buffer`类实例化中存储了原始数据。
`Buffer`类似于一个整数数组，
在`V8`堆原始存储空间给它分配了内存。

一旦创建了`Buffer`实例，
则无法改变大小。

**process**

进程对象，
提供共有关当前进程的信息和控制。

包括在执行`node`程序进程时，
如果需要传递参数，
我们需要获取这个采纳数需要在`process`内置对象中。

启动进程：

```js
node index.js 参数1 参数2 参数3
```

`index.js`文件如下：

```js
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
})
```

输出如下：

```js
0: /usr/local/bin/node
1: /Users/mac/Desktop/node/index.js
2: 参数1
3: 参数2
4: 参数3
```

除此之外，
还包括一些其他信息如版本、操作系统等。

```js
process {
  version: 'v14.5.0',
  versions: {
    node: '14.5.0',
    v8: '8.3.110.9-node.16',
    uv: '1.37.0',
    zlib: '1.2.11',
    brotli: '1.0.7',
    ares: '1.16.0',
    modules: '83',
    nghttp2: '1.41.0',
    napi: '7',
    llhttp: '2.1.3',
    http_parser: '2.9.3',
    openssl: '1.1.1g',
    cldr: '37.0',
    icu: '67.1',
    tz: '2019c',
    unicode: '13.0'
},
arch: 'x64',
platform: 'darwin',
release: {
  name: 'node',
  lts: 'Erbium',
  sourceUrl: 'https://nodejs.org/download/release/v14.5.0/node-v14.5.0.tar.gz'
  headersUrl: 'https://nodejs.org/download/release/v14.5.0/node-v14.5.0.tar.gz'
  liburl: 'https://nodejs.org/download/release/v14.5.0'
  npmVersion: '6.14.5'
},
_rawDebug: [Function: bound ],
moduleLoadList: [
  'InternalBinding:init',
  'Binding:constants',
  'NativeModule:process',
```

**console**

用来打印`stdout`和`stderr`。

最常用的输入内容的方式：`console.log`。

```js
console.log('hello world');
```
清空控制台： `console.clear`

```js
console.clear
```
打印函数的调用栈：`console.trace`

```js
function test() {
  demo();
}

function demo() {
  foo();
}

function foo() {
  console.trace();
}

test();
```

![console.trace去打印函数的调用栈](../images/nodejs/nodejs有哪些全局对象/1.png)

**clearInterval、setInterval**

设置定时器与清除定时器。

```js
setInterval(callback, delay[, ...args])
```

`callback`每`delay`毫秒重复执行一次。

`clearInterval`则为对应发取消定时器的方法。

**clearTimeout、setTimeout**

设置延时器与清除延时器

```js
setTimeout(callback, delay[, ...args])
```

`callback`在`delay`毫秒后执行一次。

`clearTimeout`则为对应取消延时器的方法。

**global**

全局命名空间对象，
墙面讲到的`process`、`console`、`setTimeout`等都有放到`global`中。

```js
console.log(process === global.process); // true
```

**模块几倍的全局对象**

这些全局对象是模块中的变量，
只是每个模块都有，
看起来就像全局变量，
像在命令交互中是不可以使用，
包括：

- `__dirname`
- `__filename`
- `exports`
- `module`
- `require`

**__dirname**

获取当前文件所在的路径，
不包括后面的文件名。

从`/Users/mjr`运行`node example.js`：

```js
console.log(__dirname);
// 打印：/Users/mjr
```
**__filename**

获取当前文件所在的路径和文件名称，
包括后面的文件名称。

从`/User/mjr`运行`node example.js`：

```js
console.log(__filename);
// 打印：/Users/mjr/example.js
```
**exports**

`module.exports`用于指定一个模块所导出的内容，
即可以通过`require()`访问的内容。

```js
exports.name = name;
exports.age = age;
exports.sayHello = sayHello;
```
**module**

对当前模块的引用，
通过`module.exports`用于指定一个模块所导出的内容，
即可以通过`require()`访问的内容。

**require**

用于引入模块、
`JSON`、
或本地文件。

可以从`node_modules`引入模块。

可以使用相对路径引入本地模块或`JSON`文件，
路径会根据`__dirname`定义的目录名或当前工作目录进行处理。