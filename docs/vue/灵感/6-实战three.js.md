五个块：

1、光线
2、模型
3、着色器
4、标签
5、three场景初始化。

![分块](../images/灵感/6-实战three.js/1.awebp)

![块的配置放的位置](../images/灵感/6-实战three.js/2.awebp)

## 块1 场景初始化。

- 生成3d场景、
- 背景设置、
- 提供将模型添加到场景方法、

- 鼠标点击事件和动画播放。

```js
// 添加模型
addModel(mesh: Object3D<Object3DEventMap>, actions?: THREE.AnimationMixer[]) {
  this.modelGroup.add(mesh);
  if (actions) this.addActionsMixer(mesh.name, actions);
  console.log(this.modelGroup);
}
// 添加光线
addLight(mesh: any) {
  this.addScene(mesh);
}
// 添加到场景
addScene(mesh: any) {
  this.scene.add(mesh);
  console.log(this.scene);
}
```

![加模型、加光线、加场景](../images/灵感/6-实战three.js/3.awebp)

## 模型2、模型

模型模块的功能是

加载`gltf`模型，
模型巡逻动画、
获取模型内动画并注册。

![加gltf模型](../images/灵感/6-实战three.js/4.awebp)

## 模块3、着色器

蓝色光圈

推荐“古柳”，跟着他学。

![加gltf模型](../images/灵感/6-实战three.js/5.awebp)

![加gltf模型](../images/灵感/6-实战three.js/6.awebp)

## 其他模块

还有
标签模块、
光线。

## 项目

**1、路线巡逻、循环轨迹展示**

路线巡逻就是根据传递过来的坐标数组。

将模型根据这些坐标进行位移。

`Patrol`类就是`模型模块里写的巡航`。

![巡逻](../images/灵感/6-实战three.js/7.awebp)

**2、第一人称视角**

将摄像头绑人身上，

人移动调用传递回调函数，

根据回调函数将摄像头位置绑定。

![第一人视角](../images/灵感/6-实战three.js/8.awebp)

**3、设备定位，视角切换**

将摄像头移到指定位置。

使用`tween.js`。

原本写的`Patrol`类去调用摄像头，但不流畅。

就改用`tween.js`。

![设备定位](../images/灵感/6-实战three.js/9.awebp)

![视角切换](../images/灵感/6-实战three.js/10.awebp)

**4、区域检测、区域告警**

![告警](../images/灵感/6-实战three.js/11.awebp)