## dom
## 创建节点
## 查询节点
## 更新节点
## 添加节点
## 删除节点

## dom

文档对象模型`dom`。
是`html`和`xml`文档的编程接口。

它提供了对文档的结构化的表述。
并`定义了一种方式`可以使从`程序中对结构进行访问`。
从而改变文档的`结构`，`样式`和`内容`。

任何`HTML`或`XML`文档都可以用`DOM`表示为一个节点构成的层级结构。

`节点`分很多`类型`。
每种类型对应着`文档`中`不同的信息`和（或）`标记`。
也都有自己`不同的特性`、`数据`和`方法`。
而且与`其他类型`有`某种关系`。
如下所示：
```html
<html>
  <head>
    <title>Page</title>
  </head>

  <body>
    <p>Hello World!</p>
  </body>
</html>
```
`dom`像原子包含着亚原子微粒那样。
也有很多类型的`dom`节点。
包含着其他类型的节点。
接下来我们先看看其中的三种：
```html
<div>
  <p title="title">
    content
  </p>
</div>
```
上述结构中。
`div`、`p`就是`元素`节点。
`content`就是`文本`节点。
`title`就是`属性`节点。

## 操作

日常前端开发。
离不开`dom`操作。

在以前。
我们用`jq`.`zepto`等库来操作`dom`。
之后在`vue`、`angular`、`react`等框架出现后。
通过操作数据来控制`dom`（绝大多数时候）。
越来越少的去直接操作`dom`。

但这并不代表原生操作不重要。
相反，
`DOM`操作才能有助于我们理解框架深层的内容。

分析`DOM`常见的操作。
主要分为：

- `创建`节点。
- `查询`节点。
- `更新`节点。
- `添加`节点。
- `删除`节点。

## 创建节点

`createElement`

创建新元素，接受一个参数，即要创建元素的标签名。
```js
const divEl = document.createElement('div');
```

`createTextNode`

创建一个文本节点。
```js
const textEl = document.createTextNode('content');
```

`createDocumentFragment`

用来创建一个`文档碎片`。
它表示一种`轻量级的文档`。
主要是用来`存储临时`节点。
然后把`文档碎片`的内容一次性添加到`dom`中。
```js
const fragment = document.createDocumentFragment();
```
当请求把一个`DocumentFragment`节点插入文档树时。
插入的不是`DocumentFragment`自身。
而是它的所有子孙节点。

`createAttribute`

创建属性节点，可以是自定义属性。
```js
const dataAttribute = document.createAttribute('custom');
console.log(dataAttribute);
```
## 获取节点

`querySelector`

传入任何有效的`css`选择器。
即可选中单个`dom`元素（首个）：
```js
document.querySelector('.element')
document.querySelector('#element')
document.querySelector('div')
document.querySelector('[name="username"]')
document.querySelector('div + p > span')
```
如果页面上没有指定的元素时，返回`null`。

`querySelectorAll`

返回一个包含节点子树内所有与之相匹配的`element`节点列表。
如果没有相匹配的。
则返回一个`空节点列表`。
```js
const notLive = document.querySelectorAll('p');
```
需要注意的是。
该方法返回的是一个`NodeList`的静态实例。
它是一个静态的”快照“。
而非”实时“的查询。

关于获取`DOM`元素的方法还有如下，
就不一一诉说了。
```js
document.getElementById('id属性值'); // 返回拥有指定id的对象的引用
document.getElementByClassName('class属性值'); // 返回拥有指定`class`的对象集合
document.getElementByTagName('标签名'); // 返回拥有指定标签名的对象集合
document.getElementByName('name属性值'); // 返回拥有指定名称的对象结合
document/element.querySelector('CSS选择器'); // 仅返回第一个匹配的元素

document.documentElement; // 获取页面中的`HTML`标签。
document.body; // 获取页面中的BODY标签。
document.all['']; // 获取页面中的所有元素节点的对象集合型。
```

除此之外。
每个`DOM`元素还有
- `parentNode`。
- `childNodes`。
- `firstChild`。
- `lastChild`。
- `nextSibling`。
- `previousSibling`。
属性。

![dom元素属性关系图](../images/js/dom/1.png)

## 更新节点

`innerHTML`

不但可以修改一个`DOM`节点的文本内容。
还可以直接通过`HTML`片段修改`DOM`节点内部的子树。
```js
// 获取<p id="p">...</p>
var p = document.getElementById('p');

// 设置文本为abc;
p.innerHTML = 'ABC'; // <p id="p">ABC</p>

// 设置HTML;
p.innerHTML = 'ABC <span style="color:red">RED</span XYZ';

// <p>...</p>的内部结构已修改。
```

`innerText`、`textContent`

自动对字符串进行`HTML`编码，保证无法设置任何`HTML`标签。
```js
// 获取<p id="p-id">...</p>
var p = document.getElementById('p-id');

// 设置文本:
p.innerText = '<script>alert("Hi")</script>';

// HTML被自动编码，无法设置一个<script>节点:
// <p id="p-id">&lt;script&gt;alert("Hi")&lt;/script&gt;</p>
```
两者的区别在于读取属性时。
`innerText`不返回隐藏元素的文本。
而`textContent`返回所有文本。

`style`

`DOM`节点的`style`属性对应所有的`CSS`。
可以直接获取或设置。
遇到`-`需要转化为驼峰命名。
```js
// 获取<p id="p-id">...</p>
const p = document.getElementById('p-id');

// 设置css:
p.style.color = '#ff0000';
p.style.fontSize = '20px'; // 驼峰命名
p.style.paddingTop = '2em';
```

## 添加节点

`innerHTML`

如果这个`dom`节点是空的。
例如。
`<div></div>`。
那么。
直接使用`innerHTML = '<span>child</span>'`就可以修改`dom`节点的内容。
相当于添加了新的`dom`节点。

如果这个`DOM`节点不是空的。
那就不能这么做。
因为`innerHTML`会直接替换掉原来的所有子节点。


`appendChild`。
把一个子节点添加到父节点的最后一个子节点。
举例子:
```html
<!-- HTML结构 -->
<p id="js">JavaScript</p>
<div id="list">
  <p id="java">Java</p>
  <p id="python">Python</p>
  <p id="scheme">Scheme</p>
  <p id="js">JavaScript</p> <!-- 添加元素 -->
</div>
```

上述代码中。
我们是获取`dom`元素后再进行添加操作。
这个`js`节点是已经存在当前文档树中。
因此这个节点首先从原先的位置删除。
再插入到新的位置。

如果动态添加新的节点。
则先创建一个新的节点。
然后插入到指定的位置。
```js
const list = document.getElementById('list'),
      haskell = document.createElement('p');

haskell.id = 'haskell';
haskell.innerText = 'Haskell';
list.appendChild(haskell);
```
`insertBefore`

把子节点插入到指定的位置。
使用方法如下:
```js
parentElement.insertBefore(newElement, referenceElement);
```
子节点会插入到`referenceElement`之前。

`setAttribute`。

在指定元素中添加一个属性及诶单。
如果元素中已有该属性改变属性值。
```js
const div = document.getElementById('id')
div.setAttribute('class', 'white'); // 第一个参数属性名，第二个参数属性值。
```

## 删除节点

删除一个节点。
首先要获得该节点本身以及它的父节点。
然后。
调用父节点的`removeChild`把自己删掉。
```js
// 拿到待删除节点：
const self = document.getElementById('to-be-removed');

// 拿到父节点:
const parent = self.parentElement;

// 删除:
const removed = parent.removeChild(self);
removed == self; // true
```
删除后的节点`虽然不在文档树`中了。
但其实它`还在内存中`。
可以随时`再次被添加`到别的位置。