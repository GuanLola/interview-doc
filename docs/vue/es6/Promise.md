## what

`Promise`。
异步编程的一种解决方案。

比传统的解决方案（回调函数）。
更合理和更强。

以前全是嵌套。
处理多层异步操作。
你套我我套你。
```js
doSomething(function(result) {
  doSomethingElse(result, function(newResult) {
    doThirdThing(newResult, function(finalResult) {
      console.log('得到最终结果：' + finalResult);
    }, failureCallback)
  }, failureCallback);
}, failureCallback);
```
就是套娃。
回调地狱。

通过`Promise`就舒服了。
```js
doSomething().then(function(result) {
  return doSomethingElse(result);
})
.then(function(newResult) {
  return doThirdThing(newResult);
})
.then(function(finalResult) {
  console.log('得到最终结果：' + finalResult);
})
.then(function(error) {
  console.log('发生错误：' + error);
})
.catch(failureCallback);
```

优点：
- 链式调用代码可读性强了。
- 写代码难度低了。

状态:
- `pending`（进行中）
- `fulfilled` （已成功）
- `rejected`（已失败）

特点：
- 对象的状态不受外界影响。
只有异步操作的结果。
可以决定当前是哪一种状态。

- 一旦状态改变。
(从`pending`变成`fulfilled`)
(从`pending`变成`rejected`)
就不会再变。
任何时候都可以得到这个结果。

## 流程。
图如下：

![promise](../images/es6/promise/1.png)

## 用法

`Promise`对象是一个构造函数。用来生成`Promise`实例。
```js
const promise = new Promise(function(resolve, reject) {})
```
`Promise`构造函数接受一个函数作为参数。
该函数的两个参分别是`resolve`和`reject`。

- `resolve` 从未完成到成功。
- `reject` 从未完成到失败。

## 实例方法

`Promise`有方法。
- then()
- catch()
- finally()

then()

回调函数。
第一参是`resolved`。
第二参是`rejected`。

`then`返回的是一个新的`Promise`实例。
也就是`promise`链式书写的原因。
```js
getJSON('/posts.json').then(function(json) {
  return json.post;
}).then(function(post) {
  // ...
})
```
catch()

`catch()`方法是。
`.then(null, rejection)`或者。
`.then(undefined, rejection)`的别名。
用于指定发生错误时的回调函数。
```js
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误。
  console.log('发生错误！', error);
})
```

有“冒泡”性质。直到被捕获。
```js
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function (comment) {
  // some code
}).catch(function(error) {
  // 处理前三个`Promise`产生的错误。
})
```
`Promise`不传递错误到外层。
```js
const someAsyncThing = function() {
  return new Promise(function (resolve, reject) {
    // 下面一行会报错，因为x没有声明。
    resolve(x + 2)；
  });
};
```
浏览器运行到那里。
会报错。
`ReferenceError: x is not defined`。
但是不会退出进程。

还可以通过`catch`去捕获。

## 构造函数方法

`Promise`

- all()
- race()
- allSettled()
- resolve()
- reject()
- try()

all()

`Promise.all()`用于将多个`Promise`实例。
包装成一个新的`Promise`实例。
```js
const p = Promise.all([p1, p2, p3]);
```
接受数组作参。
每个数组的成员都得是`Promise`。

实例`p`的状态由`p1`、`p2`、`p3`决定。
- 只有都`fulfilled`。
- p才为`fulfilled`。
- 返回值是一个数组。
- 传给p。

- 只要一个拒绝。
- p就是拒绝。
- 第一个被拒绝的实例返回给p。

`Promise`实例。
定义了`catch`。

被`rejected`。
不会走到`catch`。

```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)
.catch(e => e)
```

```js
const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)
.catch(e => e)
```

```js
Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// ['hello', Error: 报错了]
```

p2没有`catch`。
就会调用`Promise.all`的`catch`。

```js
const p1 = new Promise((resolve, reject) => {
  resolve('hello');
})
.then(result => result)

const p2 = new Promise((resolve, reject) => {
  throw new Error('报错了');
})
.then(result => result)

Promise.all([p1, p2])
.then(result => console.log(result))
.catch(e => console.log(e));
// Error: 报错
```

## race()

将多个`Promise`实例包成一个新的`Promise`实例。
```js
const p = Promise.race([p1, p2, p3]);
```
哪个快。
哪个就影响p。
```js
const p = Promise.race([
  fetch('/resource-that-may-take-a-while'),
  new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('request timeout')), 5000)
  })
]);

p
.then(console.log)
.catch(console.error);
```

allSettled()

全完成才是完成。
```js
const promises = [
  fetch('/api-1'),
  fetch('/api-2'),
  fetch('/api-3'),
];

await Promise.allSettled(promises);
removeLoadingIndicator();
```

resolve()

将现有对象转为`Promise`对象。

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```
参数。

- Promise实例。
`promise.resolve`不会做改变，直接返回这个实例。

- thenable对象。`promise.resolve`将这个对象转成`Promise`对象。
然后立即执行`thenable`对象的`then`方法。

- 不是`then()`对象。或者不是对象。
返回一个新的`Promise`对象。
状态为`resolved`。

- 没参时。
直接返回一个`resolved`的`Promise`对象。

`reject()`

`Promise.reject(reason)`。
返回一个新的`Promise`。
状态为`rejected`。

```js
const p = Promise.reject('出错了');
// 等于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function(s) {
  console.log(s)
})
// 出错了
```

`Promise.reject()`方法的参数。
原封不动地变成后续方法的参。
```js
Promise.reject('出错了')
.catch(e => {
  console.log(e === '出错了')
})
// true
```
## 场景

图片加载。
写一个`Promise`。

加载完成。
`Promise`的状态就结束。

```js
const preloadImage = function(path) {
  return new Promise(function(resolve, reject) {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = path;
  })
}
```
链式操作。
多个渲染数据都给`then`。
下个用上个的东西。
```js
getInfo().then(res => {
  let { bannerList } = res
  // 渲染轮播图
  console.log(bannerList)
  return res
}).then(res => {
  let { storeList } = res
  // 渲染店铺列表
  console.log(storeList)
  return res
}).then(res => {
  let { categoryList } = res
  console.log(categoryList)
  // 渲染分类列表
  return res
})
```
通过`all()`实现多个请求合并。
汇总请求结果。
只要一个`loading`。

```js
function initLoad() {
  // loading.show() // 加载loading
  Promise.all([getBannerList(), getStoreList(), getCategoryList()]).then(res => {
    console.log(res)
    loading.hide() // 隐藏loading
  }).catch(err => {
    console.log(err)
    loading.hide() // 隐藏loading
  })
}
// 数据初始化
initLoad()
```

`race`设图。
请求超时。

```js
// 请求某个图片资源
function requestImg() {
  var p = new Promise(function(resolve, reject) {
    var img = new Image();
    img.onload = function() {
      resolve(img);
    }
    img.src = 'https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg1';
  });
  return p;
}

// 延时函数，用于给请求计时
function timeout() {
  var p = new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject('图片请求超时');
    }, 5000)
  });
  return p;
}

Promise
.race([requestImg(), timeout()])
.then(function(results) {
  console.log(results);
})
.catch(function(reason) {
  console.log(reason);
});
```








