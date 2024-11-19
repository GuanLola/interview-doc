对ts中接口的理解和应用场景？

## 一、是什么

接口是一系列抽象方法的声明，是一些方法特征的集合，这些方法都应该是抽象的，需要由具体的类去实现，然后第三方就可以通过这组抽象方法调用，让具体的类执行具体的方法。

简单来讲，一个接口所描述的是一个对象相关的属性和方法，但并不提供具体创建此对象实例的方法。

ts的核心功能之一就是对类型做检测，虽然这种检测方法是”鸭式辩型法“，而接口的作用就是为这些类型命名和微你的代码或第三方代码定义一个约定。

## 二、使用方式

接口定义如下：

```js
interface interface_name {

}
```
例如有一个函数，这个函数接受一个User对象，然后返回这个User对象的name属性：

```js
const getUserName = (user) => user.name;
```
可以看到，参数需要有一个user的name属性，可以通过接口描述user参数的结构。
```js
interface User {
  name: string;
  age: number;
}

const getUserName = (user: User) => user.name;
```
这些属性并不一定全部实现，上述传入的对象必须拥有name和age属性，否则ts在编译阶段会报错，如下图：

如果不想要age属性的话，这时候可以采用可选属性，如下表示：
```js
interface User {
  name: string;
  age?: number;
}
```
这时候age属性则可以是number类型或者undefined类型。

有些时候，我们想要一个属性变成只读属性，在ts只需要使用readonly声明，如下：
```js
interface User {
  name: string
  age?: number
  readonly isMale: boolean
}
```
当我们修改属性的时候，就会出现警告，如下所示：

这是属性中有一个函数，可以如下表示：
```js
interface User {
  name: string
  age?: number
  readonly isMale: boolean
  say: (words: string) => string
}
```
如果传递的对象不仅仅是上述的属性，这时候可以使用：

- 类型推断

```js
interface User {
  name: string
  age: number
}

const getUserName = (user: User) => user.name
getUserName({ color: 'yellow' } as User)
```
- 给接口添加字符串索引签名
```js
interface User {
  name: string
  age: number
  [propName: string]: any
}
```
接口还能实现继承，如下图：

也可以继承多个，父类通过逗号隔开，如下：
```js
interface Father {
  color: String
}

interface Mother {
  height: Number
}

interface Son extends Father, Mother {
  weight: Number
  say: () => void
  eat: () => void
}
```

## 三、应用场景

例如在js中定义一个函数，用来获取用户的姓名和年龄：
```js
const getUserInfo = function(user) {
  // ...
  return name: ${user.name}, age: ${user.age}
}

// 正确的调用
getUserInfo({ name: 'koala', age: 18 })
```
包括后面讲到的类的时候也会应用到接口。