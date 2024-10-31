在react中组件间过渡动画如何实现？

组件过渡动画

## 是什么
## CSSTransition
## SwitchTransition
## TransitionGroup

## 一、是什么

在日常开发中，
`页面切换`时的`转场`动画是比较基础的一个场景。

当一个组件在显示与消失过程中存在过渡动画，
可以很好的增加用户的体验。

在`react`中实现过渡动画效果会有很多种选择，
如
`react-transition-group`，
`react-motion`，
`Animated`。

以及原生的`css`都能完成切换动画。

## 二、如何实现

在`react`中，
`react-transition-group`是一种很好的解决方案，
其为元素添加
`enter`,
`enter-active`,
`exit`,
`exit-active`这一系列勾子。

可以帮助我们方便的`实现`组件的`入场`和`离场`动画。

其主要提供了三个主要的组件：

- `CSSTransition`：
在前端开发中，
结合`CSS`来完成过渡动画效果。

- `SwitchTransition`：
两个组件显示和隐藏切换时，
使用该组件。

- `TransitionGroup`：
将`多个动画组件`包裹在其中，
一般用于列表中元素的`动画`。

**CSSTransition**

其实现动画的原理在于，
当`CSSTransition`的`in`属性设置为`true`时，
`CSSTransition`首先会给其子组件加上
`xxx-enter`、
`xxx-enter-active`的`class`执行动画。

当动画执行结束后，
会移除两个`class`，
并且添加`-enter-done`的`class`。

如下例子：

```js
export default class App2 extends React.PureComponent {

  state = {
    show: true
  };

  onToggle = () => this.setState({
    show: !this.state.show
  })

  render() {
    const { show } = this.state;

    return (
      const { show } = this.state;
      return (
        <div className={'container'}>
          <div className={'square-wrapper'}>
            <CSSTransition
              in={show}
              timeout={500}
              classNames={'fade'}
              unmountOnExit={true}
            >
              <div className={'square'} />
            </CSSTransition>
          </div>
          <Button onClick={this.onToggle}>toggle</Button>
        </div>
      )
    )
  }
}
```
对应`css`样式如下：

```css
.fade-enter {
  opacity: 0;
  transform: translateX(100%);
}

.fade-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: all 500ms;
}

.fade-exit {
  opacity: 1;
  transform: translateX(0);
}

.fade-exit-active {
  opacity: 0;
  transform: translateX(-100%);
  transition: all 500ms;
}
```

**SwitchTransition**

`SwitchTransition`可以完成`两个组件之间`切换的炫酷`动画`。

比如有一个按钮需要在`on`和`off`之间切换，
我们希望看到`on`先从左侧退出，
`off`再从右侧进入。

`SwitchTransition`中主要有一个属性`mode`，
对应两个值：

- `in-out`：
表示`新`组件`先进`入，
`旧`组件再移`除`；

- `out-in`：
表示`旧`组件先移`除`，
`新`组建再进`入`。

`SwitchTransition`组件里面要有`CSSTransition`，
不能直接`包裹`你想要`切换`的组件。

里面的`CSSTransition`组件不再像以前那样接受`in`属性来判断元素是何种状态，
取而代之的是`key`属性。

下面给出一个按钮入场和出场的示例，
如下：
```js
export default class SwitchAnimation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isOn: true
    }
  }

  btnClick() {
    this.setState({
      isOn: !this.state.isOn
    })
  }

  render() {
    const {isOn} = this.state;

    return (
      <SwitchTransition mode="out-in">
        <CSSTransition classNames="btn" timeout={500} key={isOn ? 'on' : 'off'}>
          <button onClick={this.btnClick.bind(this)}>
            { isOn ? 'on' : 'off' }
          </button>
        </CSSTransition>
      </SwitchTransition>
    )
  }
}
```
`css`文件对应如下：

```css
.btn-enter {
  transform: translate(100%, 0)
}

.btn-enter-active {
  transform: translate(0, 0);
  opacity: 1;
  transition: all 500ms;
}

.btn-exit {
  transform: translate(0, 0);
}

.btn-exit-active {
  transform: translate(-100%, 0);
  opacity: 0;
  transition: all 500ms;
}
```
**TransitionGroup**

当有一组动画的时候，
就可将这些`CSSTransition`放入到一个`TransitionGroup`中来完成动画。

同样`CSSTransition`里面没有`in`属性，
用到了`key`属性。

`TransitionGroup`在感知`children`发生变化的时候，
先保存移除的节点，
当`动画结束`后才真正`移除`。

其处理方式如下：

- 插入的节点，
先渲染`dom`，
然后再做`动画`。

- 删除的节点，
先做动画，
然后再删除`dom`。

如下：

```js
export default class GroupAnimation extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      friends: []
    }
  }

  addFriend() {
    this.setState({
      friends: [...this.state.friends, 'code']
    })
  }

  render() {
    return (
      <div>
        <TransitionGroup>
          {
            this.state.friends.map((item, index) => {
              return (
                <CSSTransition classNames="friends" timeout={300} key={index}>
                  <div>{item}</div>
                </CSSTransition>
              )
            })
          }
        </TransitionGroup>
        <button onClick={e => this.addFriend()}>+friend</button>
      </div>
    )
  }
}
```
对应`css`如下：

```css
.friends-enter {
  transform: translate(100%, 0);
  opacity: 0;
}

.friend-enter-active {
  transform: translate(0, 0);
  opacity: 1;
  transition: all 500ms;
}

.friend-exit {
  transform: translate(0, 0);
  opacity: 1;
}

.friend-exit-active {
  transform: translate(-100%, 0);
  opacity: 0;
  transition: all 500ms;
}
```