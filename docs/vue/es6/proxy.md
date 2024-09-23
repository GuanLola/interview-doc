## what

```js
#! /bin/bash
# metaprogram
echo '#!/bin/bash' >program
for ((I=1; I<=1024; I++)) do
  echo "echo $I" >>program
done
chmod +x program
```
生一个`program`文件。
有`1024`行`echo`。
手动搞傻逼。

能自动不要手动。

`proxy`的宗旨也是如此。

做个代理。
实现基本操作的`拦截`和`自定义`。
（属性查找、复制、枚举、函数调用）等。

## 用法

`Proxy`。
```js
var proxy = new Proxy(target, handler)
```

- `target`要拦的人。（对象、数组、函数、另个代理）。
- `handler` 操作代理逻辑。

`handler`
- 属性。

- `get(target, propKey, receiver)`: 拦截读。

- `set(target, propKey, value, receiver)`: 拦截设。

- `has(target, propKey)`: 拦截`in`操作。

- `deleteProperty(target, propKey)`: 拦截`delete`操作。

- `ownKeys(target)`: 拦截`for...in`和`Object.keys(proxy)`操作。

- `getOwnPropertyDescriptor(target, propKey)`: 拦截`Object.getOwnPropertyDescriptor`操作。

- `defineProperty(target, propKey, propDesc)`: 拦截`Object.defineProperty(proxy, propKey, propDesc)`操作。

- `getPrototypeOf(target)` 拦截`Object.getPrototypeOf(proxy)`操作。

- `isExtensible(target)`: 拦截`Object.isExtensible(proxy)`操作。

- `setPrototypeOf(target, proto)`: `Object.setPrototypeof(proxy, ptoto)`.

- `apply(target, object, args)` 拦截`proxy(args)`操作。

- `construct(target, args)` 拦截`Proxy`实例做构造函数。

## reflect

get()

```js
var person = {
  name: '张三'
}

var proxy = new Proxy(person, {
  get: function(target, propKey) {
    return Reflect.get(target, propKey)
  }
});

proxy.name // '张三'
```

`get`
```js
function createArray(...elements) {
  let handler = {
    get (target, propKey, receiver) {
      let index = Number(propKey);
      if (index < 0) {
        propKey = String(target.length  + index);
      }
      return Reflect.get(target, propKey, receiver);
    }
  }

  let target = [];
  target.push(...elements);
  return new Proxy(target, handler);
}

let arr = createArray('a', 'b', 'c');
arr[-1] // c
```

如果属性为`configurable`是不可写`writeable`。
就不能改属性，
否则报错。
```js
const target = Object.defineProperties({}, {
  foo: {
    value: 123,
    writable: false,
    configurable: false,
  },
});

const handler = {
  get(target, propKey) {
    return 'abc';
  }
};

const proxy = new Proxy(target, handler);

proxy.foo
// TypeError: Invariant check failed
```

set()

四个参。
- 目标对象。
- 属性名。
- 属性值。
- `Proxy`实例本身。

年龄不能大于200。
```js
let validator = {
  set: function(obj, prop, value) {
    if (prop === 'age') {
      if (!Number.isInteger(value)) {
        throw new TypeError('The age is not an integer');
      }
      if (value > 200) {
        throw new RangeError('The age seems invalid');
      }
    }

    // 对于满足条件的age属性以及其他属性，直接保存
    obj[prop] = value;
  }
};

let person = new Proxy({}, validator);

person.age = 100;

person.age // 100

person.age = 'young' // 报错

person.age = 300 // 报错
```
不可写不可配。
set设不成。

```js
const obj = {};
Object.defineProperty(obj, 'foo', {
  value: 'bar',
  writable: false,
});

const handler = {
  set: function(obj, prop, value, receiver) {
    obj[prop] = 'baz';
  }
}

const proxy = new Proxy(obj, handler);
proxy.foo = 'baz';
proxy.foo // 'bar'
```
deleteProperty()

```js
var handler = {
  deleteProperty(target,  key) {
    invariant(key, 'delete');
    Reflect.deleteProperty(target, key)
    return true;
  }
};

function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error('无法删除私有属性');
  }
}

var target = { _prop: 'foo' };
var proxy = new Proxy(target, handler);
delete proxy._prop;
// Error: 无法删除私有属性
```

删除代理。
```js
Proxy.revocable(target, handler);
```

## 场景

- 拦截和监听 外面对对象的 访问。
- 降低 函数、类 复杂。
- 管理。

保证数据准确。
```js
let numericDataStore = {
  count: 0,
  amount: 1234,
  total: 14
};

numericDataStore = new Proxy(numericDataStore, {
  set(target, key, value, proxy) {
    if (typeof value !== 'number') {
      throw Error("属性之鞥呢是number类型")
    }
    return Reflect.set(target, key, value, proxy);
  }
})

numericDataStore.count = 'foo';
// Error: 属性之鞥呢是number类型

numericDataStore.count = 123;
// 赋值成功
```

`api._apiKey`。
私有的属性。内部才能用，外部访问不了。
```js
let api = {
  _apiKey: '123',
  getUsers: function() {},
  getUser: function(userId) {},
  setUser: function(userId, config) {}
};

const RESTRICTED = ['_apiKey'];
api = new Proxy(api, {
  get(target, key, proxy) {
    if (RESTRICTED.indexOf(key) > -1) {
      throw Error(`${key} 不可访问.`);
    } return Reflect.get(target, key, proxy);
  },
  set (target, key, value, proxy) {
    if (RESTRICTED.indexOf(key) > -1) {
      throw Error(`${key} 不可修改.`);
    } return Reflect.set(target, key, value, proxy);
  }
});

console.log(api._apiKey)
api._apiKey = '456';
// 都出错
// 不可访问
// 不可修改
```
观察者。
一旦对象发生变化。
函数自动执行。
```js
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}
```
改了属性，就触发观察函数。







