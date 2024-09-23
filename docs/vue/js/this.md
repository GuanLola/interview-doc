## what

严格和不严格下。
有差别。

函数的调用方式。
决定`this`的值。

`this`是函数运行时自动生成的。
一个内部对象。

只能在函数内部用。
`this`指向调用它的对象。

```js
function baz() {
  // 当前调用栈是: baz
  // 所以，当前调用位置是全局作用域

  console.log('baz');
  bar(); // bar的调用位置
}

function bar() {
  // 当前调用栈是：baz -> bar
  // 所以，当前调用位置在baz中

  console.log('bar');
  foo(); // foo的调用位置
}

function foo() {
  // 当前调用栈是：baz - bar - foo
  // 所以，当前调用位置在bar中

  console.log('foo')
}

baz(); // baz的调用位置
```

`this`在函数执行过程中。
`this`一旦被确定。
就不能变。

```js
var a = 10;

var obj = {
  a: 20
}

function fn() {
  this = obj; // 报错。改this，运行会报错。
  console.log(this.a)
}

fn();
```

## 绑定

`this`有不同的值。

- `默认`。
- `隐式`。
- `new`。
- `显式`。

## 默认

```js
var name = 'Jenny';
function person() {
  return this.name;
}
console.log(person()); // Jenny
```
调用函数的对象。
在浏览器中。
所以。
`this`指向`window`。

全局环境中就是`window`。
所以输出`Jenny`。

`严格模式下`。
全局下，`this`会绑定到`undefined`。
所以只有非严格下才行。

## 隐式

函数做对象的方法调用。
`this`指这个`上级对象`。
```js
function test() {
  console.log(this.x);
}

var obj = {};
obj.x = 1;
obj.m = test;

obj.m(); // 1
```

多个层级。
这个函数中包含多个对象。
尽管这个函数是被最外层的对象所调用。
`this`指向的也只是它`上一级`的对象。
```js
var o = {
  a: 10,
  b: {
    fn: function() {
      console.log(this.a); // undefined
    }
  }
}

o.b.fn();
```
上面代码。
`this`上级是`b`。
`b`没有`a`变量。
所以就`undefined`。

```js
var o = {
  a: 10,
  b: {
    a: 12,
    fn: function() {
      console.log(this.a); // undefined
      console.log(this); // window
    }
  }
}

var j = o.b.fn;
j();
```

`this`指向`window`。
`this`永远指向最后调用它的对象。

虽然`fn`是对象`b`的方法。
但是。
`fn`复制给`j`并没执行。
直到`j()`才执行。
所以最终指向`window`。

## new绑定

构建函数`new`关键字。
生成。
一个实例对象。

那么。
`this`就指向这个实例对象。

```js
function test() {
  this.x = 1
}

var obj = new test();

obj.x // 1
```

`new`关键字改变了`this`的指向。
所以。
输出`1`。

特殊情况：
`new`过程遇到`return`一个对象。
这个时候`this`指向为`return的那个对象`。
```js
function fn() {
  this.user = 'xxx';
  return {};
}

var a = new fn();
console.log(a.user); // undefined
```
返回一个`简单类型`。
`this`指向`实例对象`。
```js
function fn()
{
  this.user = 'xxx';
  return 1;
}

var a= new fn();
console.log(a.user); // xxx
```
注意`null`虽也是对象。
但是`new`仍然指向`实例对象`。
```js
function fn() {
  this.user = 'xxx';
  return null;
}

var a = new fn();
console.log(a.user); // xxx
```

## 显式修改

`apply()`。
`call()`。
`bind()`。
是函数的一个方法。

作用是。
`改变函数`的`调用对象`。

第一个参：
改变后的调用这个函数的对象。

所以。
`this`指的是`第一个参`。
```js
var x = 0;
function test() {
  console.log(this.x);
}

var obj = {};
obj.x = 1;
obj.m = test;
obj.m.apply(obj) // 1
```
## 箭头函数

```js
const obj = {
  sayThis: () => {
    console.log(this);
  }
}

obj.sayThis(); // window
// 因为，js没有块作用域。
// 所以，定义sayThis的时候。
// this 绑到 window 上了。

const globalSay = obj.sayThis;
globalSay(); // window浏览器中的global对象。 输出的也是window
```

注意：
绑定事件监听。
```js
const button = document.getElementById('mngb');

button.addEventListener('click', () => {
  console.log(this === window) // true
  this.innerHTML = 'clicked button'
})
```
```js
Cat.prototype.sayName = () => {
  console.log(this === window) // true
  return this.name
}

const cat = new Cat('mm')
cat.sayName()
// 这个例子可以看出箭头函数不适合做构建函数
```
上面这两个例子。
箭头函数。
`this`全指向了`window`。

## 优先级

### 隐式和显式

```js
function foo() {
  console.log(this.a);
}

var obj1 = {
  a: 2,
  foo: foo
}

var obj2 = {
  a: 3,
  foo: foo
}

obj1.foo(); // 2
obj2.foo(); // 3

obj1.foo.call(obj2); // 3
obj2.foo.call(obj1); // 2
```
可以看得出来。
`显示`的优先级更高。

### `new`绑定 和 `隐式`绑定

```js
function foo (something) {
  this.a = something;
}

var obj1 = {
  foo: foo
};

var obj2 = {};

obj1.foo(2);
console.log(obj1.a); // 2

obj1.foo.call( obj2, 3 );
console.log(obj2.a); // 3

var bar = new obj1.foo(4);
console.log(obj1.a); // 2
console.log(bar.a); // 4
```
`new`绑定的优先级 高于 隐式绑定。

## `new`和`显式`

`new`和`apply`、`call`无法一起用。
硬来。
也是显式绑定的一种。
```js
function foo(something) {
  this.a = something
}

var obj1 = {};

var bar = foo.bind( obj1 );
bar(2)
console.log(obj1.a) // 2

var baz = new bar(3);
console.log(obj1.a); // 2
console.log(baz.a); // 3
```
`bar`绑到`obj1`上。
`new bar(3)`没有把`obj1.a`改成3。

但是`new`改了绑定调用`bar()`中的`this`。

所以可知。
`new`绑定优先级 大于 显式绑定。

`new绑定优先级` > `显式绑定优先级` > `隐式绑定优先级` > `默认绑定优先级`。


