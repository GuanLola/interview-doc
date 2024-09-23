## what

- `function`关键字与函数名中间有个星星。
- 内用`yield`。
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}
```

## 用

```js
function* gen() {
  // some code
}

var g = gen();

g[Symbol.iterator]() === g; // true
```

`yield`暂停播放`generator`。
```js
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```

- `hello`
- `world`
- `return`

通过`next`下一个。

- 暂停。返回当前值。
- 下一个`next`。就下个。直到下个`yield`。
- 没有`yield`，就走到最后，碰到`return`。就`return`出去。
- 没有`return`, 就是`undefined`。

```js
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

- `done`去看完成了没。`value`就是对应的值。
- `next`带参。就当做上个`yield`的返回值。

```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield(y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object {value: 6, done: false}
a.next() // Object {value: NaN, done: false}
a.next() // Object {value: NaN, done: true}

var b = foo(5);
b.next() // Object {value: 6, done: false}
b.next(12) // Object {value: 8, done: false}
b.next(13) // Object {value: 42, done: true}
```

`for...of`
```js
function* foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v); // 1,2,3,4,5
}
```

```js
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = {
  first: 'Jane',
  last: 'Doe'
};

for (let [key, value] of objectEntries(jane)) {
  console.log(key, value); // first Jane, last Doe
}
```

## 异步解决

- 回调。
- Promise。
- generator。
- async/await

回调。

```js
fs.readFile('/etc/fstab', function(err, data) {
  if (err) throw err;
  console.log(data);

  fs.readFile('/etc/shells', function (err, data) {
    if (err) throw err;
    console.log(data);
  });
})
```
Promise

链式调用。
```js
const fs = require('fs');

const readFile = function (fileName) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) return reject(error);
      resolve(data);
    })
  })
}

readFile('/etc/fstab').then(data => {
  console.log(data)
  return readFile('/etc/shells')
}).then(data => {
  console.log(data)
})
```

`generator`

`yield`暂停。
`next`继续。
适合同步。

```js
const gen = function* () {
  const f1 = yield readFile('/etc/fstab');
  const f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
}
```

`async/await`
```js
const asyncReadFile = async function () {
  const f1 = await readFile('/etc/fstab');
  const f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
}
```
## 区别
- `promise`和`async/await`专门处理异步的。
- `generator`，做迭代，控制输出的。
- `promise`比`generator`和`async`复杂，代码多。
- `generator`和`async`要搭`promise`对象处理异步。
- `async`是`generator`的语法糖。自动执行`generator`函数。
- `async`搞异步成同步。

## 场景

`generator`异步同步化。
```js
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}

var loader = loadUI();
// 加载UI
loader.next()

// 卸载UI
loader.next()
```

`redux-sage`也用到`generator`。

```js
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import Api from '...'

function* fetchUser(action) {
  try {
    const user = yield call(Api.fetchUser, action.payload.userId);
    yield put({type: 'USER_FETCH_SUCCEEDED', user: user});
  } catch (e) {
    yield put({type: 'USER_FETCH_FAILED', message: e.message});
  }
}

function* mySaga() {
  yield takeEvery('USER_FETCH_REQUESTED', fetchUser);
}

function* mySaga() {
  yield takeLatest('USER_FETCH_REQUESTED', fetchUser);
}

export default mySaga;
```
还能用`generator`。

```js
function* iterEntries(obj) {
  let keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    yield [key, obj[key]]
  }
}

let myObj = { foo: 3, bar: 7 };

for (let [key, value] of iterEntries(myObj)) {
  console.log(key, value); // foo 3, bar 7
}
```


