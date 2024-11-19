## 一、是什么

ts和js几乎一样，拥有相同的数据类型，另外在js基础上提供了更加实用的类型供开发使用。

在开发阶段，可以为明确的变量定义为某种类型，这样`ts`就能在编译阶段进行类型检查，当类型不合要求时，就会报错。

## 二、有哪些

ts的数据类型主要有如下：

- boolean（布尔类型）

- number（数字）

- string （字符串）

- array （数组）

- tuple （元组）

- enum （枚举）

- any （任意）

- null 和 undefined

- void

- never

- object

**boolean**

布尔类型

```js
let flag:boolean = true;

// flag = 123; // 错误

flag = false; // 正确
```

**number**

数字类型，和js一样，ts的数值类型都是浮点数，可支持二进制、八进制、十进制和十六进制。

```js
let num:number = 123;
num = 456; // 正确
// num = '456'; // 错误
```

进制表示：

```js
let decLiteral: number = 67; // 十进制
let hexLiteral: number = 0x10; // 十六进制
let binaryLiteral: number = 0b1010; // 二进制
let octalLiteral: number = 0o744; // 八进制
```

**string**

字符串类型，和js一样，可以使用双引号（"）或者单引号（'）表示字符串。

```js
let str:string = 'hello';
str = 'world'; // 正确
```
作为超集，当然也可以使用模板字符串``进行包裹，通过${}嵌入变量

```js
let name:string = 'zhangsan';
let sayHello:string = `hello, my name is ${name}`; // 正确
```
**array**

数组类型，跟`js`一致，通过[]进行包裹，有两种写法：

方式一：元素类型后面接上[]

```js
let arr:number[] = [1, 2, 3];
arr = [4, 5, 6]; // 正确
```

方式二：使用数组泛型，Array<元素类型>

```js
let arr:Array<number> = [1, 2, 3];
arr = [4, 5, 6]; // 正确
```

**tuple**

元素类型，允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```js
let arr: [string, number] = ['hello', 10];
arr = ['world', 20]; // 正确
arr = ['world', '123']; // 错误
arr = ['111'] // 错误
```
赋值的类型、位置、个数需要和定义（声明）的类型、位置、个数一致。

**enum**

enum类型是对js标准数据类型的一个补充，使用枚举类型可以为一组数值赋予友好的名字。

```js
enum Color { Red, Green, Blue }
let c: Color = Color.Green;
```
**any**

可以指定任何类型的值，在编程阶段还不清楚类型的变量指定一个类型，不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查，这时候可以使用any类型。

使用any类型允许被赋值为任意类型，甚至可以调用其属性、方法。

```js
let notSure: any = 4;
notSure = 'maybe a string instead';
notSure = false; // 正确
```

定义存储各种类型数据的数组时，示例代码如下：

```js
let arrayList: any[] = [1, true, 'hello', { name: 'zhangsan' }]; // 正确

arrayList[1] = 100; // 正确
```
**null 和 undefined**

在js中null表示啥都没，是一个只有一个值的特殊类型，表示一个`空对象引用`，而undefined表示一个`没有设置值`的变量。

默认情况下null和undefined是所有类型的子类型，就是说你可以把null和undefined赋值给number类型的变量。

```js
let num: number | undefined; // 数值或undefined

console.log(num); // 输出undefined 不报错

num = 123; // 正确

num = undefined; // 正确
```

但是ts配置了--strictNullChecks标记，null和undefined只能赋值给void和它们各自。

**void**

用于标识方法返回值的类型，表示该方法没有返回值。

```js
function hello():void {
  alert("hello")
}
```

**never**

never是其他类型（包括null和undefined）的子类型，可以赋值给任何类型，代表从不会出现的值。

但是没有类型是never的子类型，这意味着声明never的变量只能被never类型所赋值。

never类型一般用来指定哪些总是会抛出异常、无限循环。

```js
let a:never;
a = 123; // 错误

a = (() => { // 正确
  throw new Error('error')
})()

// 返回never的函数必须包含能够终止执行的语句，返回never的函数必须存在无法达到的终点。
function error(message: string): never {
  throw new Error(message);
}
```

**object**

对象类型，非原始类型，常见的形式通过{}进行包裹。

```js
let obj:object;
obj = { name: 'Wang', age: 25 };
```
## 三、总结

和js基本一致，也分成：

- 基本类型

- 引用类型

在基础类型上，ts增添了void、any、enum等原始类型。