node西鞥呢如何进行监控以及优化？

node性能

## 是什么
## 如何监控
## 如何优化

## 一、是什么

`Node`作为一门服务端语言，
性能方面尤为重要，
其衡量指标一般有如下：

- `CPU`。
- `内存`。
- `I/O`。
- `网络`。

**CPU**

主要分成了两部分：

- `CPU负载`：
在某个时间段内，
占用以及等待`CPU`的进程总数。

- `CPU使用率`：
`CPU`时间占用状况，
等于`1-`空间`CPU`时间（`idle time`）/ CPU总时间

这两个指标都是用来评估系统当前`CPU`的繁忙程度的量化指标。

`Node`应用一般不会消耗很多的`CPU`，
如果`CPU`占用率高，
则表明应用存在很多同步操作，
导致异步任务回调被阻塞。

**内存指标**

内存是一个非常容易量化的指标。
内存占用率是评判一个系统的内存瓶颈的常见指标。

对于`Node`来说，
`内部内存堆栈`的使用状态也是一个可以量化的指标。

```js
// /app/lib/memory.js
const os = require('os');

// 获取当前Node内存堆栈情况
const { res, heapUsed, heapTotal } = process.memoryUsage();

// 获取系统空闲内存
const sysFree = os.freemem();

// 获取系统总内存
const sysTotal = os.totalmem();

module.exports = {
  memory: () => {
    return {
      sys: 1 - sysFree / sysTotal, // 系统内存占用率
      heap: heapUsed / headTotal, // Node堆内存占用率
      node: rss / sysTotal, // Node占用系统内存的比例
    }
  }
}
```
- `rss`：表示`node`进程占用的内存总量。

- `heapTotal`：表示堆内存的总量。

- `headUsed`：实际堆内存的使用量。

- `external`：外部程序的内存使用量，包含`Node`核心的`C++`程序的内存使用量。

在`Node`中，
一个进程的最大内存容量为`1.5GB`。
因此我们需要减少内存泄露。

**磁盘I/O**

磁盘的`IO`开销是非常昂贵的，
硬盘`IO`花费的`CPU`时钟周期是内存的`164000`倍。

内存`IO`比磁盘`IO`快非常多，
所以使用内存缓存数据是有效的优化方法。
常用的工具如`redis`、`memcached`等。

并不是所有数据都需要缓存，
访问频率高，
生成代价比较高的才考虑是否缓存，

也就是说影响你性能瓶颈的考虑去缓存，
并且缓存还有缓存雪崩、缓存穿透等问题要解决。

## 二、如何监控

关于性能方面的监控，
一般情况都需要借助工具来实现。

这里采用`Easy-Monitor 2.0`，
其是轻量级的`Node.js`项目内核性能监控+分析工具，

在默认模式下，
只需要在项目入口文件`require`一次，
无需改动任何业务代码即可开启内核级别的性能监控分析。

使用方法如下：

在你的项目入口文件中按照如下方式引入，当然请传入你的项目名称：

```js
const easyMonitor = require('easy-monitor');
easyMonitor('你的项目名称');
```

打开你的浏览器，
访问`http://localhost:12333`，
即可看到进程界面。

关于定制化开发、
通用配置项以及如何动态更新配置项详见官方文档。

## 三、如何优化

关于`Node`的性能优化的方式有：

- 使用最新版本`Node.js`。
- 正确使用流`Stream`。
- `代码`层面优化。
- `内存`管理优化。

**使用最新版本Node.js**

每个版本的性能提升主要来自于两个方面：

- `V8`的版本更新。
- `Node.js`内部代码的更新优化。

**正确使用流Stream**

在`Node`中，
很多对象都实现了流，
对于一个大文件可以通过`流的形式`发送，
不需要将其完全读入内存。

```js
const http = require('http');
const fs = require('fs');

// bad 直接读文件这个不够好
http.createServer(function (req, res) {
  fs.readFile(__dirname + '/data.txt', function(err, data) {
    res.end(data);
  });
});

// good 读流会比较好点。
http.createServer(function (req, res) {
  const stream = fs.createReadStream(__dirname + '/data.txt');
  stream.pipe(res);
})
```

