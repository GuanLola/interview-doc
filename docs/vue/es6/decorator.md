## what

装饰。

就是普通一个函数。
做一些东西。
扩展类属性。
和类方法。

```js
class soldier {
}
```
给这个保安一把枪。
```js
function strong(target) {
  target.AK = true
}
```
用装饰器给哥们装饰一番。
```js
@strong
class soldier {

}
```
这哥们就直接扛一把枪了。
```js
soldier.AK // true
```
- 代码少了。
- 不改之前功能，还能给他加功能。

## 用法

- 类的装饰。
- 类属性的装饰。

类。
```js
@decorator
class A {}
// 等于
class A {
}
A = decorator(A) || A
```
一个`@testable`装饰器。
`target`传入的类。
就是`MyTestableClass`。
就给类加静态属性。
```js
@testable
class MyTestableClass {
  // ...
}

function testable(target) {
  target.isTestable = true
}

MyTestableClass.isTestable // true
```
传递参数。
函数封函数。
```js
function testable(isTestable) {
  return function (target) {
    target.isTestable = isTestable;
  }
}

@testable(true)
class MyTestableClass {}
MyTestableClass.isTestable // true

@testable(false)
class MyClass {}
MyClass.isTestable // false
```
类属性。
参数：
- 类的原型对象。
- 需要装饰的属性名。
- 装饰属性名的描述对象。

做一个`readonly`装饰器。
```js
function readonly(target, name, descriptor) {
  descriptor.writable = false; // 不可写
  return descriptor;
}
```
用`readonly`装饰类的`name`方法。
```js
class Person {
  @readonly
  name() {
    return `${this.first} ${this.last}`;
  }
}
```
相当于调用。
```js
readonly(Person.prototype, 'name', descriptor);
```
一个方法多个装饰器。
先从外到内进。
再由内到外出。
```js
function dec(id) {
  console.log('evaluated', id);
  return (target, property, descriptor) => console.log('executed', id);
}
class Example {
  @dec(1)
  @dec(2)
  method() {}
}
// evaluated 1
// evaluated 2
// executed 2
// executed 1
```
从`@dec(1)`进。
从`@dec(2)`出。

## 注意

不能装饰函数。
```js
var counter = 0;

var add = function () {
  counter++;
}

@add
function foo() {
}
```
编译成下面：
```js
var counter;
var add;

@add
function foo() {
}

counter = 0;

add = function () {
  counter++;
}
```
想要函数执行后。
`counter`是1.
结果。
`counter`还是0。

## 用到哪。

`react-redux`就用装饰器来写。
```js
class MyReactComponent extends React.Component {}

export default connect(mapStateToProps, mapDispatchToProps)(MyReactComponent);
```
装饰器。`connect`的。
```js
@connect(mapStateToProps, mapDispatchToProps)
export default class MyReactComponent extends React.Component {}
```
`mixins`。这种也写成装饰器。
```js
function mixins(...list) {
  return function (target) {
    Object.assign(target.prototype, ...list);
  };
}

// 使用
const Foo = {
  foo() {
    console.log('foo');
  }
}

@mixins(Foo)
class MyClass {}

let obj = new MyClass();
obj.foo(); // "foo"
```
`core-decorators.js`

`@autobind`。
`autobind`让方法中`this`对象。
绑定原始对象。
```js
import { autobind } from 'core-decorators'

class Person {
  @autobind
  getPerson() {
    return this;
  }
}

let person = new Person();
let getPerson = person.getPerson;

getPerson() === person; // true
```
`@readonly`。
```js
import { readonly } from 'core-decorators';

class Meal {
  @readonly
  entree = 'steak';
}

var dinner = new Meal();
dinner.entree = 'salmon'; // 报错，无法修改只读属性
```
`@deprecate`。
```js
import { deprecate } from 'core-decorators';

class Person {
  @deprecate
  facepalm() {}

  @deprecate('功能废除了')
  facepalmHard() {}
}

let person = new Person();

person.facepalm(); // 警告：facepalm 方法已弃用，请使用其他方法。

person.facepalmHard(); // 警告：功能废除了
```