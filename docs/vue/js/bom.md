## window
## location
## navigator
## screen
## history

## what

`bom（browser object model）`。
浏览器对象模型。提供了`独立于内容`与`浏览器窗口`进行`交互`的对象。

其作用就是跟浏览器做一些`交互效果`。
比如如何进行页面的`后退`。
`前进`、`刷新`、`浏览器`的窗口发生变化。

滚动条的滚动。
以及`获取客户`的一些`信息`如:
`浏览器品牌版本`。
`屏幕分辨率`。

`浏览器`的`全部内容`可以看成`dom`。
整个`浏览器`可以看成`bom`。

区别如下:

![dom和bom的区别](../images//js/bom/1.png)

## window

`bom`的核心对象是`window`。
表示浏览器的一个实例。

在浏览器中，
`window`对象有双重角色。
即是`浏览器窗口`的一个`接口`。
又是`全局对象`。

因此。
所有在全局作用域中声明的`变量`、`函数`。
都会变成`window`对象的`属性`和`方法`。
```js
var name = 'js每日一题';

function lookName() {
  alert(this.name);
}

console.log(window.name); // js每日一题
lookName(); // js每日一题
window.lookName(); // js每日一题
```
关于`窗口控制方法`如下：

- `moveBy(x,y)`:
从当前位置水平移动窗体`x`个像素。
垂直移动窗体`y`个像素。
`x`为负数。
将向左移动窗体。
`y`为负数。
将向上移动窗体。

- `moveTo(x,y)`:
移动窗体左上角到相对于屏幕左上角的`(x,y)`点。

- `resizeBy(w,h)`：
相对窗体当前的大小。
宽度调整`w`个像素。
高度调整`h`个像素。
如果参数为负数。
将缩小窗体。
反之扩大窗体。

- `resizeTo(w,h)`:
把窗体宽度调整为`w`个像素。
高度调整为`h`个像素。

- `scrollTo(x,y)`:
如果有滚动条。
将横向滚动条移动到相对于窗体宽度为`x`个像素的位置。
将纵向滚动条移动到相对于窗体高度为`y`个像素的位置。

- `scrollBy(x,y)`：
如果有滚动条。
将横向滚动条向左移动`x`个像素。
将纵向滚动条向下移动`y`个像素。

`window.open()`既可以导航到一个特定的`url`。
也可以打开一个新的浏览器窗口。

如果`window.open()`传递了第二个参数。
且该参数是已有窗口或者框架的名称。
那么就会在目标窗口加载第一个参数指定的`url`。
```js
window.open('http://www.vue3js.cn', 'topFrame')

==> <a href="" target="topFrame"></a>
```

`window.open()`会返回新窗口的引用。
也就是新窗口的`window`对象。
```js
const myWin = window.open('http://www.vue3js.cn', 'myWin')
```
`window.close()`仅用于通过`window.open()`打开的窗口。

新创建的`window`对象有一个`opener`属性。
该属性指向`打开`他的`原始窗口对象`。

## location

url地址如下：
```js
http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents
```

`location`属性描述如下：

| 属性名 | 例子 | 说明 |
| --- | --- | --- |
| hash | "#contents" | url中#后面的字符，没有则返回空串 |
| host | www.wrox.com:80 | 服务器名称和端口号 |
| hostname | www.wrox.com | 域名，不带端口号 |
| href | http://www.wrox.com:80/WileyCDA/?q=javascript#contents | 完整url |
| pathname | "/WileyCDA/" | 服务器下面的文件路径 |
| port | 80 | url的端口号，没有则为空 |
| protocol | http: | 使用的协议 |
| search | ?q=javascript | url的查询字符串，通常为`?`后面的内容 |

除了`hash`之外。
只要修改`location`的一个属性。
就会导致页面重新加载新`URL`。

`location.reload()`。
此方法可以重新刷新当前页面。
这个方法会根据最有效的方式刷新页面。

如果页面自`上一次请求以来`没有改变过。
页面就会从`浏览器缓存`中重新加载。

如果要强制从服务器中重新加载。
传递一个参数`true`即可。

## navigator

`navigator`对象主要用来`获取浏览器`的属性。
区分浏览器类型。
属性较多。
且兼容性比较复杂。

列出`navigator`对象接口定义的`属性`和`方法`:

![navigator对象](../images//js/bom/2.png)
![navigator对象](../images//js/bom/3.png)

## screen

保存的纯粹是客户端能力信息。
也就是浏览器窗口外面的客户端显示器的信息。

比如`像素宽度`和`像素高度`。

![screen](../images//js/bom/4.png)

## history

`history`对象主要用来操作浏览器`URL`的历史记录。
可以通过参数向前，向后，
或者向指定`URL`跳转。

常用的属性如下：

- `history.go()`。

接收一个`整数数字`或者`字符串`参数：
向最近的一个记录中包含`指定字符串`的页面跳转。
```js
history.go('mixaofei.com')
```

当参数为整数数字的时候。
正数表示向前跳转指定的页面。
负数为向后跳转指定的页面。
```js
history.go(3) // 向前跳转三个记录
history.go(-1) // 向后跳转一个记录
```

- `history.forward()`：向前跳转一个页面。
- `history.back()`：向后跳转一个页面。
- `history.length`：获取历史记录数。