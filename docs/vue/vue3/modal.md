## 设计

ui和逻辑。
拆出来。

标题和主体。

传参。

显示不同内容。

下次直接用，
代码少，
效率高，
体积小。

---

## 分析。

遮罩层。
标题。
主体。
确定和取消按钮。

主体变得多。
所以可以字符串。
可以html代码。

在当前`vue`独立存在。
挂载到`body`上。

通过`import`。
通过`api`形式调用。

包括。
配置样式。
国际化。
ts结合。

## 实现
大致：
- 目录结构。
- 组件内容。
- api形式。
- 事件处理。
- 其他细节。

```js
|-- plugins
|   |-- modal
        |-- Content.tsx // 维护 Modal 的内容，用于 h 函数和 jsx 语法。
        |-- config.ts // 全局默认配置
        |-- index.ts // 入口
        |-- locale // 国际化
            |-- index.ts
            |-- lang
                |-- en-US.ts
                |-- zh-CN.ts
                |-- zh-TW.ts
        |-- modal.type.ts // ts 类型定义
```
这样用`app.use(Modal)`。
`plugins`目录下。

## 组件

`modal.vue`。
```js
<Teleport to="body" :disabled="!isTeleport">
  <div v-if="modelValue" class="modal">
    <div
      class="mask"
      :style="style"
      @click="maskClose && !loading && handleCancel()"
      >
    </div>
    <div class="modal__main">
      <div class="modal__title line line--b">
        <span>{{ title || t("r.title") }}</span>
        <span
          v-if="close"
          :title="t('r.close')"
          class="close"
          @click="!loading && handleCancel()"
        >
          x
        </span>
      </div>
      <div class="modal__content">
        <Content v-if="typeof content === 'function'" :render="content" />
        <slot v-else>
          {{ content }}
        </slot>
      </div>
      <div class="modal__btns line line--t">
        <button :disabled="loading" @click="handleConfirm">
          <span class="loading" v-if="loading">❍</span>{{ t("r.confirm") }}
        </button>
        <button @click="!loading && handleCancel()">
          {{ t("r.cancel")}}
        </button>
      </div>
    </div>
  </div>
</Teleport>
```

用`teleport`去搞到`body`上。
挂到上面。

里面有：
遮罩层。
标题。
内容。
底部按钮。

```js
<div class="modal__conent">
  <Content v-if="typeof content === 'function'" :render="content" />

  <slot v-else>{{ content }}</slot>
</div>
```
可以看到根据传入`content`的类型不同。
对应显示不同得到内容。

可以看到根据传入`content`的类型不同。
1、调用字符串。
2、默认插槽。
```js
// 默认插槽
<Modal v-model="show" title="演示  slot">
  <div>hello world</div>
</Modal>
```
```js
// 字符串
<Modal v-model="show" title="演示 content" content="hello world" />
```

api调用`Modal`。
`content`以下两种:

h函数

```js
$modal.show({
  title: '演示 h 函数',
  content(h) {
    return h(
      'div',
      {

      },
      'hello world'
    )
  }
})
```
jsx

```js
$modal.show({
  title: '演示 jsx 语法',
  content() {
    return (
      <div onClick={($event: Event) => console.log('clicked', $event.target)}>
        hello world
      </div>
    )
  }
})
```

## api

用`api`调`modal`。

`vue2`。用`Vue`实例和`Vue.extend`获得组件实例。
挂到`body`上。

```js
import Modal from './modal.vue';
const ComponentClass = Vue.extend(Modal);
const instance = new ComponentClass({ el: document.createElement('div') })
document.body.appendChild(instance.$el)
```

`vue3`没有`extend`方法。
通过`createVNode`实现。
```js
import Modal from './Modal.vue';
const container = document.createElement('div');
const vnode = createVNode(Modal);
render(vnode, container);
const instance = vnode.component;
document.body.appendChild(container);
```

`vue2`。
用`this`调用全局`API`。
```js
export default {
  install(vue) {
    vue.prototype.$create = create
  }
}
```

`vue3`。
`setup`没`this`。
调用`app.config.globalProperties`搞到全局。

```js
export default {
  install(app) {
    app.config.globalProperties.$create = create
  }
}
```

## 事件处理

`vue3`

```js
// Modal.vue
setup(props, ctx) {
  let instance = getCurrentInstance(); // 获得当前组件实例
  onBeforeMount(() => {
    instance._hub = {
      'on-cancel': () => {},
      'on-confirm': () => {}
    }
  });

  const handleConfirm = () => {
    ctx.emit('on-confirm');
    instance._hub['on-confirm']();
  };

  const handleCancel = () => {
    ctx.emit('on-cancel');
    ctx.emit('update:modelValue', false);
    instance._hub['on-cancel']();
  }

  return {
    handleConfirm,
    handleCancel
  }
}
```
使用`emit`让父组件监听。
通过`_hub`添加`on-cancel`。`on-confirm`。实现在`api`里监听。

```js
app.config.globalProperties.$modal = {
  show({}) {
    /* 监听 确定、取消 事件 */
  }
}
```

`_hub`：

```js
/// index.ts
app.config.globalProperties.$modal = {
  show({
    /* 其他选项 */
    onConfirm,
    onCancel
  }) {
    const { props, _hub } = instance

    const _closeModal = () => {
      props.modelValue = false;
      container.parentNode!.removeChild(container);
    };

    Object.assign(_hub, {
      async 'on-confirm'() {
        if (onConfirm) {
          const fn = onConfirm();
          // 当方法返回为 Promise
          if (fn && fn.then) {
            try {
              props.loading = true;
              await fn;
              props.loading = false;
              _closeModal();
            } catch (err) {
              // 发生错误时，不关闭弹窗
              console.error(err);
              props.loading = false;
            }
          } else {

          }
        } else {
          _closeModal();
        }
      },
      'on-cancel'() {
        onCancel && onCancel();
        _closeModal();
      }
    })

  }
}
```
## 完善

用`ts`做。

