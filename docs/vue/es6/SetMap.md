- Set数据结构。
- Map数据结构。
- WeakSet和WeakMap。

`Set`是集合。
`Map`是字典。

集合：
- 无序。
- 相关联。
- 不重复。

字典：
- 一些元素的集合。
- 每个元素有key的域。
- 不同元素的key各不同。

区别：
- 共同点： 集合、字典 存不重复的值。
- 不同点： 集合是`[值, 值]`。字典是`[键, 值]`。

## Set

`Set`是新加的。
类似数组。
成员的值都是唯一的。
没有重复的值。
叫集合。

`Set`本身就是一个构造函数。
用来生成`Set`数据结构。
```js
const s = new Set();
```

## 增删改查

`Set`:
- add()
- delete()
- has()
- clear()

```js
s.add(1).add(2).add(2) // 2只添加了一次，就是加过的不再处理了。
```

```js
s.delete(1) // true 返回一个布尔，表示删成功了没
```

```js
s.has(2) // true 返回一个布尔，表示这个值在不在这个Set中
```
```js
s.clear() // 清除所有元素
```
## 循环

- keys() 返回键名的遍历器
- values() 返回键值的遍历器
- entries() 返回键值对的遍历器
- forEach() 遍历每个值

`Set`循环就是插入的顺序。

```js
let set = new Set(['red', 'green', 'blue'])

for (let item of set.keys()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item)
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

键值和名都相等。
```js
let set = new Set([1, 4,  9]);
set.forEach((value, key) => console.log(key + ' : ' + value)
// 1 : 1
// 4 : 4
// 9 : 9
```
去重。
```js
// 数组
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)]; // [3, 5, 2]

// 字符串
let str = 'abcdedcba';
let uniqueStr = [...new Set(str)]; // ['a', 'b', 'c', 'd', 'e']
```
并集、交集、差集。
```js
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set { 1, 2, 3, 4 }

// 交集
let intersect = new Set([...a].filter(x => b.has(x))));
// set { 2, 3 }

// (a 相对于 b) 的差集：
let difference = new Set([...a].filter(x => !b.has(x)));
// set { 1 }
```
## Map

```js
const m = new Map()
```

- size属性
- set()
- get()
- has()
- delete()
- clear()

## size

```js
const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
```
## set()

```js
const m = new Map();

m.set('edition', 6) // 键是字符串
m.set(262, 'standard') // 键是数值
m.set(undefined, 'nah') // 键是 undefined
m.set(1, 'a').set(2, 'b').set(3, 'c') // 链式操作
```
## get()
`get`方法读取`key`对应的键值。
如果找不到`key`。
返回`undefined`。
```js
const m = new Map();
const hello = function() {
  console.log('hello');
}
m.set(hello, 'Hello ES6!') // 键是函数

m.get(hello) // Hello ES6!
```
## has()

```js
const m = new Map();

m.set('edition', 6);
m.set(262, 'standard');
m.set(undefined, 'nah');

m.has('edition') // true
m.has('years') // false
m.has(262) // true
m.has(undefined) // true
```
## delete()

```js
const m = new Map();
m.set(undefined, 'nah');
m.has(undefined) // true

m.delete(undefined)
m.has(undefined) // false
```

## clear()

```js
let map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
map.clear();
map.size // 0
```
## 遍历

- keys()
- values()
- entries()
- forEach()

```js
const map = new Map([
  ['F', 'no'],
  ['T', 'yes'],
]);

for (let key of map.keys()) {
  console.log(key);
}
// 'F'
// 'T'

for (let value of map.values()) {
  console.log(value);
}
// 'no'
// 'yes'

for (let item of map.entries()) {
  console.log(item[0], item[1])
}
// 'F' 'no'
// 'T' 'yes'

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value)
}
// 'F' 'no'
// 'T' 'yes'

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value)
}
// 'F' 'no'
// 'T' 'yes'

map.forEach(function(value, key, map) {
  console.log("Key: %s, value: %s", key, value);
});
```
## WeakSet 和 WeakMap

WeakSet

创建`WeakSet`实例。
```js
const ws = new WeakSet();
```
`WeakSet`可以接受一个具有`Iterable`接口的对象作为参数。
```js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet([1, 2], [3, 4])
```
在`API`中`WeakSet`和`Set`两个区别：
- 没有遍历操作的`API`。
- 没有`size`属性。

```js
let ws = new WeakSet();

// 成员不是引用类型
let weakSet = new WeakSet([2, 3]);
console.log(weakSet); // 报错

// 成员为引用类型
let obj1 = { name: 1 }
let obj2 = { name: 1 }
let ws = new WeakSet([obj1, obj2]);
console.log(ws); // WeakSet {Object}
```
`WeakSet`里面的引用只要在外部消失。
在`WeakSet`里面的引用就会自动消失。

## WeakMap

`WeakMap`结构和`Map`结构类似。
用于生成键值对的集合。

在`API`中`WeakMap`和`Map`有两个区别：
- 没有遍历操作的`API`。
- 没有`clear`清空方法。

```js
// WeakMap 可以使用 set 方法添加成员。
const wm1 = new WeakMap();
const key = { foo: 1 };
wm1.set(key, 2);
vm1.get(key) // 2
```
```js
// WeakMap 也可以接受一个数组
// 作为构造函数的参数
const k1 = [1, 2, 3]
const k2 = [4, 5, 6]
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // 'bar'
```
`WeakMap`只接受对象作为键名(`null`除外)。
不接受其他类型的值作为键名。
```js
const map = new WeakMap();
map.set(1, 2)
// TypeError: 1 is not an object!
map.set(Symbol(), 2)
// TypeError: Invalid value used as weak map key
map.set(null, 2)
// TypeError: Invalid value used as weak map key
```
`WeakMap`的简明所指向的对象。
一旦不要。
里面的键名对象和所对应的键值对会自动消失。
不用手动删除引用。

举个场景例子：

在网页的`DOM`元素上添加数据。
就可以使用`WeakMap`结构。

当该`DOM`元素被清除。
对应的`WeakMap`记录就会自动被移除。
```js
const wm = new WeakMap();

const element = document.getElementById('example');

wm.set(element, 'some information');
wm.get(element) // 'some information'
```
注：
`WeakMap`弱引用的只是键名。
而不是键值。
键值依然是正常引用。

下面代码中。
键值`obj`会在`WeakMap`产生新的引用。
当你修改`obj`不会影响到内部。
```js
const wm = new WeakMap();
let key = {};
let obj = { foo: 1 };

wm.set(key, obj);
obj = null;
wm.get(key)
// Object { foo: 1}
```












