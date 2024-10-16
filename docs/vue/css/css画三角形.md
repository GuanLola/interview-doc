css 如何画一个三角形，
原理是什么？

画三角形

## 前言
## 实现过程
## 实现原理

## 一、前言

在前端开发的时候，
我们有时候会需要用到一个三角形的形状，
比如地址选择或者播放器里面播放按钮。

![小三角形的用处](../images/css/css画三角形/1.png)

通常情况下，
我们会使用图片或者`svg`去完成三角形效果图，
但如果单纯使用`css`如何完成一个三角形呢？

实现过程似乎也并不困难，
通过边框就可完成。

## 二、实现过程

在以前也讲过盒子模型，
默认情况下是一个矩形，
实现也很简单。

```html
<div class="border"></div>

<style>
  .border {
    width: 50px;
    height: 50px;
    border: 2px solid;
    border-color: #96ceb4 #ffeead #d9534f #ffad60;
  }
</style>
```
效果如下图所示：

![css画小正方形](../images/css/css画三角形/2.png)

将`border`设置`50px`，
效果图如下所示：

![边框设宽的例子](../images/css/css画三角形/3.png)

白色区域则为`width`、`height`，
这时候只需要你将白色区域部分宽高逐渐`变小`，
最终变为`0`，
则变成如下图所示：

![border内容长宽设置为0](../images/css/css画三角形/4.png)

这时候就已经能够看到4个不同颜色的三角形，
如果需要下方三角形，
只需要将
上、
左、
右
边框设置为`0`就可以得到下方的红色三角形。

![左上右的边框设置为0，就得到下方的红色三角形](../images/css/css画三角形/5.png)

但这种方式，
虽然视觉上是实现了三角形，
但实际上，
隐藏的部分仍然占据部分高度，
需要将上方的宽度去掉。

最终实现代码如下：

```css
.border {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 50px 50px;
  border-color: transparent transparent #d9534f;
}
```
如果想要实现一个只有边框是空心的三角形，
由于这里不能再使用`border`属性，
所以最直接的方法是利用伪类新建一个小一点的三角形定位上去。

```css
.border {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 50px 50px;
  border-color: transparent transparent #d9534f;
}
```
如果想要实现一个`只有边框`是`空心`的三角形，
由于这里不能再使用`border`属性，
所以最直接的方法是利用伪类新建一个小一点的三角形定位上去。

```css
.border {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 50px 50px;
  border-color: transparent transparent #d9534f;
  position: relative;
}

.border::after {
  content: '';
  border-style: solid;
  border-width: 0 40px 40px;
  border-color: transparent transparent #d9534f;
  position: absolute;
  top: 0;
  left: 0;
}
```
效果图如下所示：

![用伪类来做](../images/css/css画三角形/6.png)

伪类元素`定位`参照对象的`内容区域宽高`都为`0`，
则内容区域即可以理解成中心一点，
所以伪元素相对中心这点定位。

将元素定位进行微调以及改变颜色，
就能够完成下方效果图：

![伪类三角形改颜色和定位微调](../images/css/css画三角形/7.png)

最终代码如下：

```css
.border:after {
  content: '';
  border-style: solid;
  border-width: 0 40px 40px;
  border-color: transparent transparent #d9534f;
  position: absolute;
  top: 6px;
  left: -40px;
}
```

## 三、原理分析

可以看到，
边框是实现三角形的部分，
边框实际上并不是一个直线，

如果我们将四条边设置不同的颜色，
将边框逐渐放大，
可以得到每条边框都是一个梯形。

![边框实际上是个梯形，并不是一条直线](../images/css/css画三角形/8.png)

当分别`取消边框`的时候，
发现下面几种情况：

- 取消`一条边`的时候，
与`这条边相邻`的`两条边`的`接触部分`会`变成直`的。

- 当`仅有邻边`时，
`两个边`会变成`对分`的`三角`。

- 当保留边没有其他接触时，
几线情况所有东西都会消失。

![三角形各种边的变化](../images/css/css画三角形/9.png)

通过上图的变化规则，
利用
旋转、
隐藏、
以及设置内容宽高等属性，
就能够实现其他类型的三角形。

如设置直角三角形，
如上图倒数第三行实现过程，
我们就能知道整个实现原理。

实现代码如下：

```css
.box {
  /* 内部大小 */
  width: 0px;
  height: 0px;

  /* 边框大小 值设置 */
  border-top: #4285f4 solid;
  border-right: transparent solid;
  border-width: 85px;

  /* 其他设置 */
  margin: 50px;
}
```
