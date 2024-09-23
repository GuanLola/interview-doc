## var

顶层对象的属性。
和。
全局变量。
是等价的。

用`var`声明的变量。
是全局。
也是顶层。

顶层对象： 浏览器是`window`。`node`是`global`。

```js
var a = 10;
console.log(window.a) // 10
```
`var`有变量提升这种东西。
```js
console.log(a) // undefined
var a = 20
```
编译成。
```js
var a
console.log(a)
a = 20
```

后面覆盖前面。
```js
var a = 20
var a = 30
console.log(a) // 30
```

函数内是局部的。
```js
var a = 20
function change() {
  var a = 30
}
change()
console.log(a) // 20
```
函数内不用var，变量全局。
```js
var a = 20
function change() {
  a = 30
}
change()
console.log(a) // 30
```

## let

只在代码块有用。
```js
{
  let a = 20
}
console.log(a) // ReferenceError: a is not defined
```
不会变量提升。
```js
console.log(a) // 报错ReferenceError
let a = 20
```
块级用let做，就不受外部影响。
```js
var a = 123
if (true) {
  a = 'abc' // ReferenceError 在声明钱，不能用。叫（暂时性死区）
  let a;
}
```
不能重复声明
```js
let a = 20
let a = 30 // SyntaxError 重复声明
```

相同作用域，会报错。如下:
```js
let a = 20
{
  let a = 30 // SyntaxError
}
```
函数内，不能重新声明。
```js
function func(arg) {
  let arg;
}
func() // SyntaxError 参数不能重新声明
```
## const

一旦声明，不能变。
```js
const a = 1
a = 3 // 常量不能改变
```
`const`一旦声明，就要给值。
```js
const a // SyntaxError 没有赋值
```
用`var`或`let`做过了，就不能用`const`做。
```js
var a = 20
let b = 20
const a = 30
const b = 30
// 都报错
```

`const`做的是内存地址所保存的数据不动。

`const`。
只保证指向实际数据的指针不懂。
不保证数据结构不变。
```js
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {}; // ‘foo’是只读的。你改它就是不对。
```
`const`和`let`一样。

## 区别

- 变量提升。
- 暂时性死区。
- 块级作用域。
- 重复声明。
- 修改声明的变量。
- 使用。

## 变量提升

`var`有。
`let`和`const`没有。
```js
// var
console.log(a) // undefined
var a = 10

// let
console.log(b) // Cannot access 'b' before initialization
let b = 10

// const
console.log(c) // Cannot access 'c' before initialization
const c = 10
```
## 暂时性死区

`var`没有。
`let`和`const`有。
```js
// var
console.log(a) // undefined
var a = 10

// let
console.log(b) // Uncaught ReferenceError: Cannot access 'b' before initialization
let b = 10

// const
console.log(c) // Uncaught ReferenceError: Cannot access 'c' before initialization
const c = 10
```
## 块级作用域

`var`没有。
`let`和`const`有。

```js
// var
{
  var a = 10
  console.log(a) // 10
}
console.log(a) // 10

// let
{
  let b = 10
  console.log(b) // 10
}
console.log(b) // Uncaught ReferenceError: b is not defined

// const
{
  const c = 10
  console.log(c) // 10
}
console.log(c) // Uncaught ReferenceError: c is not defined
```
## 重复声明

`var`有。
`let`和`const`没有。

```js
// var
var a = 10
var a = 20 // 20

// let
let b = 10
let b = 20 // Uncaught SyntaxError: Identifier 'b' has already been declared

// const
const c = 10
const c = 20 // Uncaught SyntaxError: Identifier 'c' has already been declared

// const
const d = 10
let d = 20 // Uncaught SyntaxError: Identifier 'd' has already been declared
```
## 修改声明的变量

`var`和`let`有。
`const`没有。

```js
// var
var a = 10
a = 20 // 20

// let
let b = 10
b = 20 // 20

// const
const c = 10
c = 20 // Uncaught TypeError: Assignment to constant variable.
```
## 总结

能用`const`就不用`let`。
能用`let`就不用`var`。

