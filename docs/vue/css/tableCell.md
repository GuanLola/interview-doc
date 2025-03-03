`display - table-cell属性`。

===

## 目录

1、`多`行文`字`居`中`。
2、制作`自适应`搜索`框`。
3、大小`不固定`的垂直居`中`。
4、`俩列`自适应`布局`（宽度`自动`调节）。
5、`列表`布局。

## 正文

`display`的`table`和`table-cell`一般情况下用的不多。
所以很少有人去关注它。
但他们两个联手起来会给你惊喜！

当
两个或者两个以上标签
一起使用
显示在
同一行
时。

以前常用的是`float`、`position`进行布局。
在高版本的浏览器可以使用`flex`、`grid`进行布局。

无意中发现使用`display:table-cell`也是一个很好用的自适应布局，
本文就`display: table-cell`做学习总结。

`display:table-cell`指
让标签元素以表格单元格的形式呈现，
使元素类似于`td`标签。

`IE8+`及现代版本的饿浏览器都支持此属性，
`IE6/7`不支持（可用其他方法实现类似效果）。

同样，
`display:table-cell`属性也会
被`float`，
`position: absolute`等
属性`破坏效果`。
应避免同时使用。

| 值 | 描述 |
| ---| --- |
| `none` | 此元素不会被显示。 |
| `block` | 此元素将显示微块级元素，此元素前后会带有换行符。 |
| `inline` | 默认。此元素会被显示为内联元素，元素前后没有换行符。 |
| `inline-block` | 行内块元素。（css2.1新增的值）。 |
| `list-item` | 此元素会作为列表显示。 |
| `run-in` | 此元素会根据上下文作为块级元素或内联元素显示。 |
| `compact` | `css`中有值`compact`，不过由于缺乏广泛支持，已经从`css2.1`中删除。 |
| `marker` | `css`中有值`marker`，不过由于缺乏广泛支持，已经从`css2.1`中删除。 |
| `table` | 此元素作为块级表格来显示（类似`<table>`），表格前后带有换行符。 |
| `inline-table` | 此元素会作为内联表格来显示（类似`<table>`），表格前后没有换行符。 |
| `table-row-group` | 此元素会作为一个或多个行的分组来显示（类似`<tbody>`） |
| `table-footer-group` | 此元素会作为一个或多个行的分组来显示（类似`<tfoot>`）。 |
| `table-row` | 此元素会作为一个表格行显示（类似`<tr>`）。 |
| `table-column-group` | 此元素会作为一个或多个列的分组来显示（类似`<colgroup>`）。 |
| `table-column` | 此元素会作为一个单元格列显示（类似`<col>`）。 |
| `table-cell` | 此元素会作为一个表格单元显示（类似`<caption>`）。 |
| `inherit` | 规定应该从父元素继承`display`属性的值。 |

`display: table-cell`可以代替浮动布局。
但是其不是最好的方法。
其他方法有待进一步学习！

这里抛出这样一个问题，
如下，
让块里的多行文字垂直居中？

一说到垂直居中就会想到，
单行文字垂直居中`line-height`等于`height`；

块级元素垂直居中，
`position`定位或者`flex`布局。

但这里我介绍`display: table`和`table-cell`是如何让多行文字垂直居中的。

虽然感觉用的不多，
但是在某些时候还是挺管用的，
如下：

## 1. 多行文字居中

```html

```

