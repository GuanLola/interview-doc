# Intersection Observer

来看三个效果。

## 第一个效果：图片懒加载

这些图片一开始是一个默认图片。当你滑过去的时候，它会加载出真实的图片。

## 第二个效果：加载更多

在瀑布流布局中，会加载一个小圈圈在转。当滑过去的时候，更多内容会被加载。

## 第三个效果：广告播放

这个广告在这里播放，但当你滑下去时，它会暂停。用户必须完整看到广告后，才能继续播放。

---

这三个效果看似无关，但实际上都使用了同一个前端技术——**Intersection Observer**。

这是一套API，用于创建一个观察器，观察某个元素与视口是否有交叉。使用这个API可以轻松实现上述效果，而不需要手动监控滚动条的位置。

### 实现过程

#### 图片懒加载

1. **设置默认图片**，同时为每张图片添加一个`data-src`属性，用于存储真实图片地址。
2. **创建观察器**：

   ```js
   const ob = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               const img = entry.target;
               img.src = img.dataset.src; // 加载真实图片
               ob.unobserve(img); // 停止观察
           }
       });
   });
   ```

3. **观察所有带有`data-src`的图片**：

   ```js
   const imgs = document.querySelectorAll('img[data-src]');
   imgs.forEach(img => ob.observe(img));
   ```

#### 加载更多效果

1. 创建一个观察器，观察“加载更多”按钮：

   ```js
   const ob = new IntersectionObserver((entries) => {
       if (entries[0].isIntersecting) {
           loadMoreImages(10); // 加载更多图片
       }
   });
   ob.observe(document.querySelector('.load-more'));
   ```

#### 广告效果

1. 创建一个观察器，用于控制广告播放：

   ```js
   const vd = document.querySelector('video');
   const ob = new IntersectionObserver((entries) => {
       if (entries[0].isIntersecting) {
           vd.play();
       } else {
           vd.pause();
       }
   }, { threshold: 1 }); // 完整可见时播放
   ob.observe(vd);
   ```

---

通过这套API，能轻松实现这三个效果，提升开发效率与用户体验。


----

### IntersectionObserver 使用概述

**IntersectionObserver** 是一个现代浏览器提供的API，用于异步观察一个元素与视口（或其他元素）之间的交叉情况。它可以有效地监控元素何时进入或离开视口，而无需监听滚动事件。

### 基本用法

1. **创建观察器**：需要提供一个回调函数，当观察的元素与视口交叉状态变化时，会调用这个函数。

   ```javascript
   const observer = new IntersectionObserver((entries) => {
       entries.forEach(entry => {
           if (entry.isIntersecting) {
               // 当元素进入视口时执行的代码
           }
       });
   });
   ```

2. **观察元素**：使用 `observe` 方法将目标元素添加到观察列表中。

   ```javascript
   const target = document.querySelector('.target');
   observer.observe(target);
   ```

3. **可选配置**：可以传递一个配置对象，设置观察的根元素、边距和阈值。

   ```javascript
   const options = {
       root: null, // 默认为视口
       rootMargin: '0px',
       threshold: 0.5 // 50% 进入视口时触发
   };
   const observer = new IntersectionObserver(callback, options);
   ```

### 示例案例

#### 1. 图片懒加载

实现图片懒加载，只有当图片进入视口时才加载实际的图片。

```html
<img data-src="real-image.jpg" src="default-image.jpg" class="lazy">
```

```javascript
const images = document.querySelectorAll('img.lazy');

const loadImage = (image) => {
   image.src = image.dataset.src; // 替换为真实图片
   image.classList.remove('lazy');
};

const observer = new IntersectionObserver((entries) => {
   entries.forEach(entry => {
       if (entry.isIntersecting) {
           loadImage(entry.target);
           observer.unobserve(entry.target); // 停止观察
       }
   });
});

images.forEach(img => observer.observe(img));
```

#### 2. 无限滚动加载更多内容

当用户滚动到页面底部时，自动加载更多内容。

```javascript
const loadMoreContent = () => {
   // 加载更多内容的逻辑
};

const sentinel = document.querySelector('.load-more');

const observer = new IntersectionObserver((entries) => {
   if (entries[0].isIntersecting) {
       loadMoreContent();
   }
});

observer.observe(sentinel);
```

#### 3. 广告播放控制

根据广告元素是否在视口内来控制播放和暂停。

```html
<video class="ad-video" src="ad.mp4" controls></video>
```

```javascript
const video = document.querySelector('.ad-video');

const observer = new IntersectionObserver((entries) => {
   if (entries[0].isIntersecting) {
       video.play(); // 播放广告
   } else {
       video.pause(); // 暂停广告
   }
}, { threshold: 1 }); // 100% 可见

observer.observe(video);
```

### 总结

**IntersectionObserver** 提供了一种高效的方式来处理元素与视口的交互，避免了繁琐的滚动事件监控，使得性能优化变得简单而直观。