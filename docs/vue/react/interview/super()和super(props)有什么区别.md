super()和super(props)有什么区别？

super()和super(props)

## es6类
## 类组件
## 总结

## 一、es6类

在`ES6`中，
通过`extends`关键字实现类的继承，
方式如下：

```js
class sup {
  constructor(name) {
    this.name = name;
  }

  printName() {
    console.log(this.name);
  }
}

class sub extends sup {
  constructor(name, age) {
    super(name); // super代表的是父类的构造函数
    this.age = age;
  }

  printAge() {
    console.log(this.age);
  }
}

let jack = new sub("jack", 20)
jack.printName(); // 输出： jack
jack.printAge(); // 输出： 20
```
在上面的例子中，
可以看到通过`super`关键字实现调用父类，
`super`代替的是父类的构建函数，
使用`super(name)`相当于调用`sup.prototype.constructor.call(this, name)`。

如果在子类中不使用`super`，
关键字，
则会引发报错，
如下：

![子类中不使用super关键字，会报错](../../images/react/interview/super()和super(props)有什么区别/1.png)

报错的原因是 子类是没有自己的`this`对象的，
它只能继承父类的`this`对象的，
然后对其进行加工。

而`super()`就是将父类中的`this`对象继承给子类的，
没有`super()`子类就得不到`this`对象。

如果先调用`this`，
再初始化`super()`，
同样是禁止的行为。

```js
class sub extends sup {
  constructor(name, age) {
    this.age = age;
    super(name); // super代表的是父类的构造函数
  }
}
```
所以在子类`constructor`中，
必须先代用`super`才能引用`this`。

## 二、类组件

在`React`中，
类组件是基于`ES6`的规范实现的，
继承`React.Component`,
因此如果用到`Constructor`就必须写`super()`才初始化`this`。




