地址栏输入URL敲下回车后发生了什么？

输入URL后

## 简单分析
## 详细分析

## URL解析
## DNS查询
## TCP连接
## HTTP请求
## 响应请求
## 页面渲染

## 一、简单分析

简单的分析，
从输入`URL`到回车后发生的行为如下：

- URL解析
- DNS查询
- TCP连接
- HTTP请求
- 响应请求
- 页面渲染

## 二、详细分析

**URL解析**

首先判断你输入的是一个合法的`URL`还是一个待搜索的关键词，
并且根据你输入的内容进行对应操作。

`URL`的解析过程中的第一步，

一个`url`的结构解析如下：

![URL 解析的过程](../images/http/地址栏输入URL敲下回车后发生了什么/1.png)

**DNS查询**

在之前文章中讲过`DNS`的查询，
这里就不再讲述了。

整个查询过程如下图所示：

![DNS 查询的过程](../images/http/地址栏输入URL敲下回车后发生了什么/2.png)

最终，
获取到了域名对应的目标服务器`IP`地址。

**TCP连接**

在之前文章中，
了解到`tcp`是一种面向有连接的传输层协议。

在确定目标服务器的`IP`地址后，
则经历三次握手建立`TCP`连接，
路程如下：

![TCP连接 三次握手过程](../images/http/地址栏输入URL敲下回车后发生了什么/3.png)

**发送http请求**

当建立`tcp`连接之后，
就可以在这基础上进行通信，
浏览器发送`http`请求到目标服务器。

请求的内容包括：

- 请求行
- 请求头
- 请求主体

![发送http请求](../images/http/地址栏输入URL敲下回车后发生了什么/4.png)

**响应请求**

当服务器接收到浏览器的请求之后，
就会进行逻辑操作，
处理完成之后返回一个`HTTP`响应信息，
包括：

- 状态行
- 响应头
- 响应正文

![响应请求回来的消息](../images/http/地址栏输入URL敲下回车后发生了什么/5.png)

在服务器响应之后，
由于现在`http`默认开始长连接`keep-alive`，
当页面关闭之后，
`tcp`丽娜姐则会经过四次挥手完成断开。

**页面渲染**

当浏览器接收到服务器响应的资源后，
首先会对资源进行解析：

- 查看响应头的信息，
根据不同的指示做对应处理，
比如重定向，
存储cookie，
解压gzip，
缓存资源等等。

- 查看响应头的Content-TYpe的值，
根据不同的资源类型采用不同的解析方式。

关于页面的渲染过程如下：

- 解析HTML，
构建DOM树。

- 解析CSS，，
生成CSS规则树。

- 合并DOM树和CSS规则，
生成render树。

- 布局render树（Layout/reflow），
负责各元素尺寸、
位置的计算。

- 绘制render树（paint），
绘制页面像素信息。

- 浏览器会将各层的信息发送给GPU，
GPU会将各层合成（composite），
显示在屏幕上。

![页面渲染的过程](../images/http/地址栏输入URL敲下回车后发生了什么/6.png)