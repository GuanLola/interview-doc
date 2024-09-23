## Object.defineProperty

有两个属性。
- `get`。
- `set`。

`get`。
属性被访问。
就调用`getter`函数。
但会传入`this`对象。

`set`。
属性被设置。
会调用`setter`函数。
接受一个参。
就是赋值的新值。
会传入赋值时的`this`对象。
默认为`undefined`。

代码:

定义一个响应式函数`defineReactive`。
```js
function update() {
  app.innerText = obj.foo
}

function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      console.log(`get ${key}:${val}`);
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal
        update()
      }
    }
  })
}
```
调用`defineReactive`。
数据发生变化触发`update`方法。
实现数据响应式。

```js
const obj = {}
defineReactive(obj, 'foo', '')
setTimeout(() => {
  obj.foo = new Date().toLocalTimeString()
}, 1000)
```
在对象存在多个`key`情况下，需要进行遍历。
```js
function observe(obj) {
  if (type obj !== 'object' || obj == null) {
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}
```
如果存在嵌套对象的情况，还需要在`defineReactive`中进行递归。

```js
function defineReactive(obj, key, val) {
  observe(val)
  Object.defineProperty(obj, key, {
    get() {
      console.log(`get ${key}:${val}`);
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal
        update()
      }
    }
  })
}
```
当给`key`赋值为对象的时候。
需要在`set`属性中进行递归。
```js
set(newVal) {
  if (newVal !== val) {
    observe(newVal)
    val = newVal // 新值是对象的情况
    notifyUpdate()
  }
}
```
上面这种响应，存在问题。

给对象加属性或者删属性。做不到。

```js
const obj = {
  foo: 'foo',
  bar: 'bar'
}

observe(obj)
delete obj.foo // no ok
obj.jar = 'xxx' // no ok
```
数组用这种方式也不好使。

```js
const arrData = [1, 2, 3, 4, 5];
arrData.forEach((val, index) => {
  defineProperty(arrData, index, val)
})

arrData.push() // no ok
arrData.pop() // no ok
arrData[0] = 1 // no ok
```
可以看到数据的`api`无法劫持到。
响应式无法做到。

所以为了弥补，
`vue2`加了`set`、`delete` API。
并重写了一遍数组的`api`。

还有就是深层嵌套对象。
每个都深层监听。
耗性能。

## proxy

对象的所有操作都会监听到。

详解`Proxy`使用。

定义一个响应式方法`reactive`。

```js
function reactive(obj) {
  if (typeof obj !== 'object' && obj != null) {
    return obj
  }
  // Proxy在外层拦截
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}:${res}`)
      return res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      console.log(`设置${key}:${value}`)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log(`删除${key}:${res}`)
      return res
    }
  })
  return observed
}
```
测试。
是不是都能劫持。
```js
const state = reactive({
  foo: 'foo'
})

// 1.获取
state.foo // ok

// 2.设置已存在属性
state.foo = 'fo' // ok

// 3.设置不存在属性
state.bar = 'bar' // ok

// 4.删除属性
delete state.foo // ok
```

嵌套情况。
```js
const state = reactive({
  bar: { a: 1 }
})

// 设置嵌套对象属性
state.bar.a = 10 // no ok
```
解决就是。
`get`上加上一层代理。

```js
function reactive(obj) {
  if (typeof obj !== 'object' && obj != null) {
    return obj
  }
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}:${res}`)
      return isObject(res) ? reactive(res) : res // 代理一层
    }
  }
  return observed
}
```
## 总结

`Object.defineProperty`只能循环对象去劫。
```js
function observe(obj) {
  if (typeof obj !== 'object' && obj != null) {
    return
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}
```
`proxy`直接可以劫整个。
然后返回新的整个。

```js
function reactive(obj) {
  if (typeof obj !== 'object' && obj != null) {
    return obj
  }
  // Proxy相当于子在对象外层加拦截
  const observed = new Proxy(obj, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      console.log(`获取${key}:${res}`)
      return res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      console.log(`设置${key}:${value}`)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log(`删除${key}:${res}`)
      return res
    }
  })
  return observed
}
```
`Proxy`可以直接监听数组的变化(`push`、`shift`、`splice`)。
```js
const obj = [1, 2, 3]
const proxyObj = reactive(obj)
obj.push(4) // ok
```
`Proxy`有13种拦截方法。
不限于`apply`、`ownKeys`、`deleteProperty`、`has`等等。
`Object.defineProperty`不具备的。

`defineProperty`有问题。不完美。
导致要辅助。
增加`set`、`delete`方法。

```js
// 数组重写
const originalProto = Array.prototype
const arrayProto = Object.create(originalProto)

['push', 'pop', 'shift', 'unshift', 'splice'].forEach(method => {
  arrayProto[method] = function() {
    originalProto[method].apply(this.arguments)
    dep.notice()
  }
})

// set、delete
Vue.set(obj, 'bar', 'newbar')
Vue.delete(obj, 'bar')
```
`Proxy`不兼容`IE`。
也没有`plyfill`。

`defineProperty`能支持到`IE9`。