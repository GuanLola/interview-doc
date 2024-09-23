## 是什么


```html
<div id="app">{{ message }}</div
```

```vue
const vm = new Vue({
  el: '#app',
  data: {
    message: '123'
  }
})
```

```js
vm.message = 'new message' // 改变数据
console.log(vm.$el.innerHTML) // '123'
```
获取不到更新后的DOM

### 为什么

Vue是异步更新DOM的，当数据发生变化时，Vue会开启一个队列，然后把在同一个事件循环中发生的所有数据改变放入队列。如果同一个watcher被多次触发，只
会放进一次。然后，在事件循环的下一个tick中，Vue同步执行实际更新DOM的操作。

等所有的数据变化完之后，Vue会统一在事件循环的下一个tick中执行DOM更新。

### 怎么解决

```
{{ num }}

for (let i = 0; i < 10000; i++) {
  num = 1;
}
```

如果没有nextTick，那么num每更新一次，就会重新渲染整个模板。

有了nextTick，就只会更新一次。

## 场景

想立刻得到更新后的DOM。

Vue.nextTick(callback)

```js
vm.message = '修改后的值'

// DOM 还没有更新
console.log(vm.$el.textContent) // 还是旧值

Vue.nextTick(function () {
  console.log(vm.$el.textContent) // 更新后的值
  // DOM 已经更新
}}
```

组件内使用`this.$nextTick(callback)`, this指向Vue实例。

```js
this.message = '修改后的值'
console.log(this.$el.textContent) // 还是旧值
this.$nextTick(function () {
  console.log(this.$el.textContent) // 更新后的值
  // DOM 已经更新
})
```

`$nextTick` 会返回一个 `Promise` 对象，可以 `async/await` 完成相同作用的事情。

```js
this.message = '修改后的值'
console.log(this.$el.textContent) // 还是旧值
await this.$nextTick()
console.log(this.$el.textContent) // 更新后的值
```
## 原理

源码位置: `src/core/util/next-tick.js`

`callbacks` 也就是异步操作队列。

`callbacks` 新增回调函数后又执行了`timerFunc`函数，`pending`是用来标识同一个时间只能执行一次。

```js
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve;

  // cb 回调函数会统一处理 callbacks 数组
  callbacks.push(() => {
    if (cb) {
      // 给 cb 会带哦函数执行，加上 try-catch 错误处理
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  });

  // 执行异步延迟函数 timerFunc
  if (!pending) {
    pending = true;
    timerFunc()
  }

  // 当 nextTick 没有传入函数参数的时候，返回一个 Promise 化的调用
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    });
  }
}
```

`timerFunc` 函数定义，这里是根据当前环境支持什么方法则确定调用哪个，分别有：

- `Promise.then`
- `MutationObserver`
- `setImmediate`
- `setTimeout`

通过上面任意一种方法，进行降级操作

```js
export let isUsingMicroTask = false;

if (typeof Promise !== 'undefined' && isNative(Promise)) {
  // 判断1：是否原生支持Promise
  const res = Promise.resolve();
  timerFunc = () => {
    p.then(flushCallbacks);
    if (isIOS) setTimeout(noop);
  }
  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]'
) {
  // 判断2：是否原生支持MutationObserver
  let counter = 1;
  const observer = new MutationObserver(flushCallbacks);
  const textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  }
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // 判断3：是否原生支持setImmediate
  timerFunc = () => {
    setImmediate(flushCallbacks);
  }
} else {
  // 判断4：最后降级使用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0);
  }
}
```

无论是微任务还是宏任务，都会在`flushCallbacks`函数中执行。

这里将`callbacks`里面的函数复制一份, 同时`callbacks`清空。

依次执行`callbacks`里面的函数。

```js
function flushCallbacks () {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copy[i]()
  }
}
```

## 总结

1. 把回调函数放入`callbacks`等待执行。
2. 将执行函数放到微任务或者宏任务中执行。
3. 事件循环到微任务或者宏任务中，执行函数依次进行`callbacks`中的回调。