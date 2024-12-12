no.1

## 漂亮的文字阴影

这是一个立体文字效果。
这个效果呢。
其实代码只有一行哈。
不过这个效果特别好看。
所以呢怎么做呢。
分享给大家。
这个效果里边呢。
主要是通过文字阴影来实现的。
你看这个右上角有个阴影是吧。
首先呢。
给这个文字。
给它设置一个右上角的阴影。
```css
h1 {
  margin: 0;
  letter-spacing: 5px;
  color: #e6e6e6;
  text-align: center;
  /* text-shadow: 1px -1px #fff; // 左边 上边 然后白色阴影。你看右上角就有阴影了是吧。然后接下来。 */
  /* text-shadow: 1px -1px #fff, -1px 1px #999; // 接下来左下角还有一个灰色的阴影。-1px 1px #999 : 左边 下边 然后灰色的阴影。你看现在的文字已经很好看了是吧。有一个立体效果了。然后呢，我再给他远处呢。加上一个模糊的阴影。 */
  text-shadow: 1px -1px #fff, -1px 1px #999, -10px 10px 5px #80808080; // 这个阴影是可以加多个的哈。来个左边下边模糊程度。 -10px 10px 5px #80808080 ：左边 下边 阴影的颜色、保存，这个立体文字的效果就实现了哈。
}
```


no.2

## 奇妙的头像特效

这个玩意绝对不简单的。

有的同学可能会以为，
在这边套一个div

```html
 transition: 0.5s;

 overflow: hidden; // 那也是不对的
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: 0.5s;
}

.avatar:hover img {
  transform: scale(1.3);
}
</style>
</head>

<body>
  <div class="avatar">
    <img src="https://picsum.photos/200" alt="" />
  </div>
</body>
</html>
```

在这边套个div，
里边放个图片。

然后把这个div
和这个图片设置成一个圆

当鼠标移入div的时候呢
把这个图片放大。

绝对不行的哈。

它出来的话会是这个样子。

不对呀
那你说加上一个overflow hidden。


就变成了这个样子了。

而我们的是这个样子的。

咋整啊这个
我们尝试着做一下哈

整个过程呢
虽然不会写一行的js

但是这个玩意绝对不简单啊

同学们要做好心理准备

首先呢我就一张图片
这个图片呢也没啥东西啊

设置个变量来表示它的尺寸
```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: 5px solid; // 用outline属性用于设置一个元素的轮廓线。当你设置`outline`属性时，可以指定轮廓线的宽度、样式和颜色。在outline属性中，如果只指定了宽度和样式，没有指定颜色，则会使用默认颜色（通常是用户代理样式表中的默认颜色）。
}

img:hover {
  transform: scale(1.35);
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```

然后呢两个颜色备用。
其他的没啥了。

加了一个外边框便于看得清楚。

目前呢是这个样子。
然后呢，
接下来，
我再想办法画这么一个圆圈。

这个圆圈用啥画呢。
你肯定不能用border。
不然的话，
你一放大的话。
它的border会跟着放大的。

我们得用啥呢
我这里想到的办法是使用`径向渐变`。
给它一个background radial-gradient
```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍

  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: 5px solid; // 用outline属性用于设置一个元素的轮廓线。当你设置`outline`属性时，可以指定轮廓线的宽度、样式和颜色。在outline属性中，如果只指定了宽度和样式，没有指定颜色，则会使用默认颜色（通常是用户代理样式表中的默认颜色）。

  background: radial-gradient(); // 给它一个background radial-gradient

  /**
  * 径向渐变呢，我先给他扩散一个黄色的内容，然后再扩散一个红色的边框。这是可以的对吧。那么首先呢你要思考一个问题，就是你对这个圆啊有没有限制，
  * background: radial-gradient(circle )
  * 因为默认情况下呢，他扩散100%的时候呢，他的圆是这个样子的，
  * 而我们希望的是什么呢，他扩散100%的时候，圆是这个样子的，因此呢我们要限制一下这个圆他的范围怎么限制呢
  * 怎么限制呢，我们可以使用`closest-side`表示以最短边作为圆的半径。
  * background: raidal-gradient(circle closest-side);
  * 那么之后呢写颜色的时候
  * 百分比就相对这个最短边的
  * 颜色的话, 首先就用这个c2这个颜色，就是这个淡黄的颜色
  * background: radial-gradient(circle closest-side var(--c2) 50% var(--c1) 100%)) 扩散多少呢，50%
  * 扩散多少呢，我们来研究一下，是不是扩散成这个样子，也就是说扩散到100%
  * 100% 减去这个圆形的边框值
  * 然后边框的的粗细呢是5
  * 那么就是100%减去5个像素来填充这个黄色
  * 所以呢这里要用一个计算
  * calc(100% - 5px)
  * background: radial-gradient(circle closest-side, var(--c2) calc(100% - var(--b)) var(--c1) 100%);
  * 那么边框的尺寸呢
  * 我干脆弄一个变量得了
  * --b: 5px;
  * 那后续的颜色是啥呀
  * 接下来是不是红色的边框了
  * background: radial-gradient(circle closest-side, var(--c2) calc(100% - var(--b)) var(--c1) 100%);
  * c1 那么他要从这个位置开始，
  * background: radial-gradient(circle closest-side, var(--c2) calc(100% - var(--b)), var(--c1) calc(100% - var(--b)), var(--c1) 100%);
  * var(--c1) calc(100% - var(--b)), var(--c1) 100% 扩散到100%
  * 那么它的颜色之后呢，我就随便用一个颜色填充吧。
  * background: radial-gradient(circle closest-side, var(--c2) calc(100% - var(--b)), var(--c1) calc(100% - var(--b)), var(--c1) 100%, lightblue 100%);
  * 便于同学们看得清楚哈
  * 于是呢，变成了这个样子，来，出来看上帝。
  * 现在呢还有一个小问题哈
  * 就是这个边框呢有锯齿
  * 这是渐变的老问题了对吧
  * 解决方式呢
  * 基本上都是把两个颜色之间呢
  * 相隔那么一点点距离
  * background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%);
  * 这里和这里都填充99%来消除这个锯齿
  * 那么现在就好多了是吧

  * 然后接下来呢。
  * 接下来的问题就是当我鼠标移入过后，它会放大。你放大归放大
  * 但是呢我这个背景图
  * 它的尺寸要保持原始尺寸
  * 也就是说啥意思呢
  * background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat;
  * 我先让这个背景图不重复哈
  * 位置设为center
  * background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center;
  * 接下来就是尺寸了
  * 纵向的话我不管他
  * 关键是横向的尺寸
  * 我要始终保持这个背景图的尺寸
  * 看上去是不变的
  * 即便整个元素放大了
  * 那怎么做呢
  * 你放大了两倍
  * 那么是不是就意味着
  * 我这个背景图要缩减为原来的1/2
  * 对吧
  * 也就是说啥呢
  * 我这里的背景图横向尺寸呢
  * background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100%);
  * 应该是100%除以放大倍数
  * background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / 放大倍数);
  * 是这意思吗
  * 放大两倍
  * 它就相当于背景图变成了以前的50%
  * 这样子呢就保证这个背景图看上去不变
  * 那么这个放大倍数呢
  * 我们就需要用变量来表示
  * 默认是1倍
  * 那么有这个变量之后呢
  * 我们将来鼠标移入的时候
  * 改动的是这个变量
  * 然后呢这边使用transform scale对吧
  *
  */
}

img:hover {
  transform: scale(1.35);
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>

```

```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍

  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: 5px solid;

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / 放大倍数); -->

  background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / var(--f)) 100%;

  transform: scale(var(--f));

}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```
用这种模式来处理
那么这样子呢这边就方便了
我就可以使用变量了

纵向呢我们可以保持不变哈

现在来看一下
是不是有点意思了
背景图的尺寸保持不变

现在我们还要解决一个问题
因为这是个背景
就导致了这个图片内容呢
它是覆盖背景的
覆盖背景倒是没啥
关键是我要在这里拼接上那个红线

我得用啥玩意
才能在这里拼接一个曲线呢。

哎
我们就可以借助这个`outline`
这个outline我们已经有5个像素了哈
把它的宽度呢使用变量

```html
 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍



  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;

  <!-- outline-offset: 10px; // 边框和内容之间的距离 距离设置得越大呢 就越远，当然呢它可以设置为负数，比方说负的5个像素， -->
  <!-- outline-offset: -5px; // 那么这样子不就重叠了吗 这个圈圈不就出来了吗 -->
  outline-offset: calc(0 - var(--b)); // 那这最好还是要用变量哈, 0 减去 边框的值就是负数嘛

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / 放大倍数); -->

  background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / var(--f)) 100%;

  transform: scale(var(--f));

}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```
它的颜色呢使用变量
那么outline呢变成这个样子
然后我们可以使用border-radius
左上角不变右上角不变
左下和右下给它设大一点。
我要做成这么一个效果。
现在外边框离它的内容之间呢有点间隙这个简单

我们可以使用`outline-offset`
你看这个效果
你肚子里边没点货手都下不了

这个表示外边框和元素之间的距离
你把这个距离设得越大呢
它的距离就越远。

---

好，
目前是这个样子
现在问题又来了

我需要搞定的事情是
当鼠标移入的时候这图片放大
但是
外边框的尺寸保持不变
也就是说哈
我们要根据目前的信息
动态地调整这个offset的值

那咋调整呢
别怕有我在
我给你们算个账

比方说现在的外边框是这个样子的
图片被放大了两倍

那么
外边框自然而然也会跟着放大两倍
现在我们要让这个外边框往回缩
是不是调整那个offset的值

也就是说我们要求的是这一段的值
那等于多少啊
是不是等于这一段放大过后的宽度
减去放大之前的宽度
然后再除以2

也就是说啥呢
这一段的值
他应该等于原始的宽度乘以放大倍率
那么得到放大之后的宽度 减去 原始的宽度， 再把这个相减的结果呢除以2
(s*f - s) / 2
没问题吧
真的没问题吗
哈哈你再好好想一想
由于我们那个offset

它设置的值是相对于原始尺寸的
也就是说原始的宽度为200
你offset的值最多只能是-100
对吧
已经缩到中心了
那如果说放大了`1000`倍
你
想一想这一段距离
是不是远远就超过100了
说的啥意思呢
就是你算出来这个值哈
是被放大过后的值
你要得到原始的收缩的话
你还要去除以一个放大倍率
(s*f - s) / 2 / f
才能得到真正的应该被收缩的值
这个玩意要好好想通
稍微得算一算哈
我就不说这个具体的运算过程了
每个同学都会算
算出来是个啥呢
算出来就是s减去s除以f再除一个2
(s - s / f) / 2
当然这个算出来是个正值
我们要往里边收缩

所以说我们把它变成负值
那反过来相减就可以了
(s / f - s) / 2
好了
我们把这个公式替换到这个位置。

```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍



  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;

  <!-- outline-offset: 10px; // 边框和内容之间的距离 距离设置得越大呢 就越远，当然呢它可以设置为负数，比方说负的5个像素， -->
  <!-- outline-offset: -5px; // 那么这样子不就重叠了吗 这个圈圈不就出来了吗 -->
  <!-- outline-offset: calc(0 - var(--b)); // 那这最好还是要用变量哈, 0 减去 边框的值就是负数嘛 -->
  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / 放大倍数); -->

  background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / var(--f)) 100%;

  transform: scale(var(--f));

}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```
好了保存看一下

好了那么接下来还有个问题
就是他放大过后啊
上面这根线
你看把他头发给他挡住了
我不能让上面的线
对我们的图片有任何遮挡
那这个玩意还是比较简单的哈
我可以使用一个padding-top

```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍



  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  <!-- outline-offset: 10px; // 边框和内容之间的距离 距离设置得越大呢 就越远，当然呢它可以设置为负数，比方说负的5个像素， -->
  <!-- outline-offset: -5px; // 那么这样子不就重叠了吗 这个圈圈不就出来了吗 -->
  <!-- outline-offset: calc(0 - var(--b)); // 那这最好还是要用变量哈, 0 减去 边框的值就是负数嘛 -->
  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / 放大倍数); -->

  background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / var(--f)) 100%;

  transform: scale(var(--f));

}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```
那现在背景图又不对了
中间那个圆圈又不对了
那是因为背景图默认覆盖的是填充和
记住哈
覆盖的是padding范围内的东西
我们只需要跟他更爱一下哈
让背景图呢覆盖的内容盒就可以了
```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍



  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  <!-- outline-offset: 10px; // 边框和内容之间的距离 距离设置得越大呢 就越远，当然呢它可以设置为负数，比方说负的5个像素， -->
  <!-- outline-offset: -5px; // 那么这样子不就重叠了吗 这个圈圈不就出来了吗 -->
  <!-- outline-offset: calc(0 - var(--b)); // 那这最好还是要用变量哈, 0 减去 边框的值就是负数嘛 -->
  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / 放大倍数); -->

  background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / var(--f)) 100% content-box;

  transform: scale(var(--f));

}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```
好
再看一下
上面是padding哈
是不是可以了

如果说你现在不看圆圈外边的东西
你看是不是就已经完成了
那么接下来的问题就是
我要给他框一个范围
就是在这个范围内的东西我显示
其他的地方我不显示
那这个玩意还是比较好做的
我们可以使用mask

这个我在之前多节视频里面都讲过哈
这个玩意给它提供一张图片
```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍



  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  <!-- outline-offset: 10px; // 边框和内容之间的距离 距离设置得越大呢 就越远，当然呢它可以设置为负数，比方说负的5个像素， -->
  <!-- outline-offset: -5px; // 那么这样子不就重叠了吗 这个圈圈不就出来了吗 -->
  <!-- outline-offset: calc(0 - var(--b)); // 那这最好还是要用变量哈, 0 减去 边框的值就是负数嘛 -->
  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) no-repeat center/ calc(100% / 放大倍数); -->

  background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) content-box no-repeat center/ calc(100% / var(--f)) 100%;

  transform: scale(var(--f));

  -webkit-mask: xxx; // 这个玩意给它提供一张图片，只有被这个图片覆盖的区域才会显示，其他地方都不会显示
  // 那么我首先要把这个图片呢 做成这么一个圆 对吧 我首先要做成这个样子 我们可以使用radial-gradient哈

  -webkit-mask: radial-gradient(circle closest-side, #000 99%);
  // 同样的圆 我只是把颜色给他换一下
  // 黑色
  // 到哪呢 到99%吧
  // 那么剩下的部分呢
  // 我们使用透明色来填充
  -webkit-mask: radial-gradient(circle closest-side, #000 99%, transparent) content-box no-repeat center/ calc(100% / var(--f)) 100%;

  // 那目前圆出来了
  // 还是一样的问题，就是背景图呢， 它应该是占用内容盒然后不重复居中的 这一堆东西跟之前是一样的。
  // 所以呢我们把这一块整成一个变量得了

}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```


```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍

  --bgOption:  content-box no-repeat center/ calc(100% / var(--f)) 100%;


  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) var(--bgOption);

  transform: scale(var(--f));

  -webkit-mask: radial-gradient(circle closest-side, #000 99%, transparent) var(--bgOption);
  // 把这个变量应用进去
  // 这里就可以替换成变量了
  // 同样道理，这边也是把它替换成变量


}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```

好
你看
由于这个mask就刚好是这个区域
被mask里边的颜色覆盖的区域呢
它就显示出来
没有覆盖的区域它颜色就不显示
所以说移入


是不是还是不对啊
接下来
我还得有一块懂你心是这样的是不是

那么这个懂你心又怎么做呢
为了让同学们看得清楚呢

我先把背景图呢暂时给他注释掉

```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍

  --bgOption:  content-box no-repeat center/ calc(100% / var(--f)) 100%;


  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) var(--bgOption); -->

  transform: scale(var(--f));

  <!-- -webkit-mask: radial-gradient(circle closest-side, #000 99%, transparent) var(--bgOption); -->
  // 把这个变量应用进去
  // 这里就可以替换成变量了
  // 同样道理，这边也是把它替换成变量


}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```

mask也暂时注释掉

目前是这个样子一个外边框是吧

然后接下来我要做的背景呢
到时占用的是这块区域
我们把这块区域跟之前的
这一块圆一拼接
哎
不就是我们想要的吗
对不对

那么这块区域写下来是比较容易的哈
我们先用背景来试一试
做个线性渐变就可以了

```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍

  --bgOption:  content-box no-repeat center/ calc(100% / var(--f)) 100%;


  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) var(--bgOption); -->

  transform: scale(var(--f));

  <!-- -webkit-mask: radial-gradient(circle closest-side, #000 99%, transparent) var(--bgOption); -->

  background: linear-gradient(#000 0 0) no-repeat center;


}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```

全黑的渐变
没问题吧
好呢嘛这个背景图呢
不重复
横向居中

好
现在要考虑一个问题哈
就当鼠标移入的时候
你看由于它放大了
背景图也跟着放大了
但是呢我们这个outline它并没有动
所以说这个背景图的位置上
你首先得往下移 移多少呢
那就要看这个outline它收缩了多少

它收缩了多少我就往下移动了多少
那么我把它呢也做成一个变量


```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍

  --bgOption:  content-box no-repeat center/ calc(100% / var(--f)) 100%;

  --shrink:


  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) var(--bgOption); -->

  transform: scale(var(--f));

  <!-- -webkit-mask: radial-gradient(circle closest-side, #000 99%, transparent) var(--bgOption); -->

  // 收缩了多少，我们是不是这里就要往下移动多少 注意之前那个收缩的值是负数 所以这个要变成正数
  // 那就再来一个0去减去这个负数
  background: linear-gradient(#000 0 0) no-repeat center calc(0 - var(--shrink));


}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```

你看这个
背景图的位置至少正确了对吧
好
就是尺寸的问题了

首先横向的尺寸放大了两倍
我就缩减两倍
跟中间的圆圈道理是一样的
100% / 放大倍率
```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍

  --bgOption:  content-box no-repeat center/ calc(100% / var(--f)) 100%;

  --shrink:


  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  <!-- background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) var(--bgOption); -->

  transform: scale(var(--f));

  <!-- -webkit-mask: radial-gradient(circle closest-side, #000 99%, transparent) var(--bgOption); -->

  // 收缩了多少，我们是不是这里就要往下移动多少 注意之前那个收缩的值是负数 所以这个要变成正数
  // 那就再来一个0去减去这个负数
  background: linear-gradient(#000 0 0) no-repeat center calc(0 - var(--shrink)) / cal(100% / var(--f)) 50%; // 这是横向的
  // 纵向始终保持50%就可行了
  // 因为纵向整个过程中没有被处理
}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```

你看
很舒服了是吧
那么我们把这个玩意
作为mask的其中一张图片
下面这个圆作为另一张图片
这样一拼接上
就完成了我们想要的效果了。

```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍

  --bgOption:  content-box no-repeat center/ calc(100% / var(--f)) 100%;

  --shrink:


  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  outline-offset: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));

  background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) var(--bgOption);

  transform: scale(var(--f));

  -webkit-mask: linear-gradient(#000 0 0) no-repeat center calc(0 - var(--shrink)) / cal(100% / var(--f)) 50%, radial-gradient(circle closest-side, #000 99%, transparent) var(--bgOption);
}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```
哎
为什么还有左右两个边框在这呢
这是因为这个背景图呢
它的宽度是这个样子的
因此你要在这个宽度的基础上
是不是要减去两个边框的宽度啊
因此呢
我们这里稍作处理哈
```html

 margin-top: -200px;
}

img {
  --s: 280px;
  --c1: #c02942;
  --c2: #ecd078;

  --b: 5px; // 边框的尺寸变量

  --f: 1; // 放大倍数 默认的是放大一倍

  --bgOption:  content-box no-repeat center/ calc(100% / var(--f)) 100%;

  --shrink: calc((var(--s) / var(--f) - var(--s)) / 2 - var(--b));


  width: var(--s);
  height: var(--s);
  cursor: pointer;
  transition: 0.5s;
  outline: var(--b) solid var(--c1);

  border-radius: 0 0 999px 999px;
  padding-top: 100px; // 上面有点距离，避免上面那条横线遮挡住图片

  outline-offset: var(--shrink);

  background: radial-gradient(circle closest-side, var(--c2) calc(99% - var(--b)), var(--c1) calc(99% - var(--b)), var(--c1) 100%, lightblue 100%) var(--bgOption);

  transform: scale(var(--f));

  -webkit-mask: linear-gradient(#000 0 0) no-repeat center calc(0 - var(--shrink)) / cal(100% / var(--f) - 2 * var(--b)) 50%, radial-gradient(circle closest-side, #000 99%, transparent) var(--bgOption);

  // 就是这个值还要去减2乘以边框宽度 乘以边框宽度
  // 保存
}

img:hover {
  --f: 1.35; // 鼠标移入之后，放大倍数变成1.35倍
}
</style>
</head>

<body>
  <img src="./avatar.webp" />
</body>
```

保存
走
这不就出来了吗


最后那个蓝色怎么办

蓝色的
简单就是个lightblue

把它设置为transparent
就完事了

大功告成
还可以是吧
应该是没有很多同学想的那么简单

啊
你把这个效果放到个人主页上去
秀一秀
只要懂的人看到这个效果
就会知道一定不简单
