css 动画

## 是什么
## 实现方式
## 总结

## 一、是什么

`CSS`动画（`CSS Animations`）是
为层叠样式表建议的
允许可扩展标记语言（`XML`）元素
使用`CSS`的动画的模块。

即指元素从`一种`样式逐渐`过渡`为`另一`种样式的`过程`。

常见的`动画效果`有很多，
如
`平移`、
`旋转`、
`缩放`
等等，
`复杂`动画则是`多个简单动画`的`组合`。

`css`实现动画的方式，
有如下几种：

- `transition`实现`渐变`动画。
- `transform`转变动画。
- `animation`实现`自定义`动画。

## 二、实现方式

**transition 实现渐变动画**

`transition`的属性如下：

- `property`：填写需要变化的`css`属性。
- `duration`：完成过渡效果需要的`时间`单位（`s`或者`ms`）。
- `timing-function`：完成效果的速度`曲线`。
- `delay`：动画效果的`延迟`触发事件。

其中`timing-function`的值有如下：

| 值 | 描述 |
| --- | --- |
| linear | 匀速（等于`cubic-bezier(0, 0, 1, 1)`） |
| ease | 从慢到快再到慢（`cubic-bezier(0.25, 0.1, 0.25, 1)`） |
| ease-in | 慢慢变快（等于 `cubic-bezier(0.42, 0, 1, 1)`） |
| ease-out | 慢慢边慢（等于`cubic-bezier(0, 0, 0.58, 1)`） |
| ease-in-out | 先变快再到慢（等于`cubic-bezier(0.42, 0, 0.58, 1)`），渐显渐隐效果 |
| cubic-bezier(n, n, n, n) | 在`cubic-bezier`函数中定义自己的值。可能的值是`0`至`1`之间的数值 |

注意：并`不是所有`的属性`都能使用过渡`的，如`display: none <-> display: block`。

举个例子，
实现`鼠标移动`上去发生`变化动画`效果。

```css
<div class="base"></div>

<style>
.base {
  width: 100px;
  height: 100px;
  display: inline-block;
  background-color: #0EA9FF;
  border-width: 5px;
  border-style: solid;
  border-color: #5daf34;
  transition-property: width, height, background-color, border-width;
  transition-duration: 2s;
  transition-timing-function: ease-in;
  transition-delay: 500ms;
}

/* 简写 */
/* transition: all 2s ease-in 500ms; */
.base:hover {
  width: 200px;
  height: 200px;
  background-color: #5daf34;
  border-width: 10px;
  border-color: #3a8ee6;
}
</style>
```

**transform转变动画**

包含四个常用的功能：

- `translate`：位移。
- `scale`：缩放。
- `rotate`：旋转。
- `skew`：倾斜。

一般配合`transition`过度使用。

注意的是，
`transform`不支持`inline`元素，使用前把它变成`block`。

举个例子。

```html
<div class="base base2"></div>

<style>
.base {
  width: 100px;
  height: 100px;
  display: inline-block;
  background-color: #0EA9FF;
  border-width: 5px;
  border-style: solid;
  border-color: #5daf34;
  transition-property: width, height, background-color, border-width;
  transition-duration: 2s;
  transition-timing-function: ease-in;
  transition-delay: 500ms;
}
.base2 {
  transform: none;
  transition-property: transform;
  transition-delay: 5ms;
}
.base2:hover {
  transform: scale(0.8, 1.5) rotate(35deg) skew(5deg) translate(15px, 25px);
}
</style>
```

**animation实现自定义动画**

`animation`是由`8`个属性的简写，分别如下：

| `属性` | 描述 | 属性值 |
| --- | --- | --- |
| `animation-duration` | 指定动画完成一个周期所需要`时间`，单位秒`（s）`或毫秒`（ms）`，默认是`0` ||
| `animation-timing-function` | 指定动画计时函数，即动画的`速度`曲线，默认是`"ease"` | `linear`、`ease`、`ease-in`、`ease-out`、`ease-in-out` |
| `animation-delay` | 指定动画`延迟`时间，即动画何时开始，默认是`0` ||
| `animation-iteration-count` | 指定动画`播放`的`次数`，默认是`1` ||
| `animation-direction`指定动画播放的`方向` | 默认是`normal` | `normal`、`reverse`、`alternate`、`alternate-reverse` |
| `animation-fill-mode` | 指定动画填充`模式`。默认是`none` | `forwards`、`backwards`、`both` |
| `animation-play-state` | 指定动画播放`状态`，正在运行或暂停。默认是`running` | `running`、`pauser` |
| `animation-name` | 指定`@keyframes`动画的`名称` ||

`CSS`动画只需要定义`一些关键`的`帧`，
而`其余的帧`，
浏览器会根据`计时函数`插值`计算`出来，

通过`@keyframes`来定义关键帧。

因此，如果我们想要让元素`旋转一圈`，只需要`定义开始`和`结束两帧`即可：

```css
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```
`from`表示最开始的那一帧，
`to`表示结束时的那一帧。

也可以使用百分比刻画生命周期。
```css
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
```
定义好了关键帧后，
下来就可以直接用它了：

```css
animation: rotate 2s;
```
## 三、总结

| 属性 | 含义 |
| --- | --- |
| `transition`（过渡）| 用于设置元素的样式过渡，和`animation`有着类似的效果，但细节上有很大的不同。 |
| `transform`（变形）| 用于元素进行`旋转`、`缩放`、`移动`或`倾斜`，和设置样式的动画并没有什么关系，就相当于`color`一样用来`设置元素`的"外表"。 |
| `translate`（移动）| 只是`transform`的一个属性值，即移动。 |
| `animation`（动画）| 用于设置`动画`属性，他是一个简写的属性，包含`6`个属性。 |













