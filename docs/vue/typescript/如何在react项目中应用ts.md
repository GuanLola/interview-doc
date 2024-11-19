如何在react项目中应用ts？

## 一、前言
## 二、使用方式
## 三、总结

react typescript

## 一、前言

单独的使用ts并不会导致学习成本很高，但是绝大部分前端开发者的项目都是依赖于框架的。

例如与vue、react这些框架结合使用的时候，会有一定的门槛。

使用ts编写react代码，除了需要ts这个库之外，还需要安装@types/react、@types/react-dom
```js
npm i @types/react -s
npm i @types/react-dom -s
```

至于上述使用@types的库的原因在于，目前非常多的js库并没有提供自己关于ts的声明文件。

所以，ts并不知道这些库的类型以及对应导出的内容，这里@types实际就是社区中definitelyTyped库，定义了目前市面上绝大多数的js库的声明。

所以下载相关的js对应的@types声明时，就能够使用该库对应的类型定义。

## 二、使用方式

在编写react项目的时候，最常见的使用的组件就是：

- 无状态组件

- 有状态组件

- 受控组件

**无状态组件**

主要作用是用于展示UI，如果使用js声明，则如下所示：
```js
import * as React from 'react';

export const Logo = () => {
  const { logo, className, alt } = props;

  return <img src={logo} className={className} alt={alt} />;
};
```
但这时候ts会出现报错提示，原因在于没有定义props类型，这时候就可以使用interface接口去定义props即可，如下：
```js
import * as React from 'react';

interface IProps {
  logo?: string;
  className?: string;
  alt?: string;
}

export const Logo = (props: IProps) => {
  const { logo, className, alt } = props;

  return <img src={logo} className={className} alt={alt} />;
}
```
但是我们都知道props里面存在children属性，我们不可能每个props接口定义多个children，如下：
```js
interface IProps {
  logo?: string;
  className?: string;
  alt?: string;
  children?: ReactNode;
}
```
更加规范的写法是使用react里面定义好的FC属性，里面已经定义好children类型，如下：
```js
export const Logo: React.FC<IProps> = (props) => {
  const { logo, className, alt } = props;

  return <img src={logo} className={className} alt={alt} />;
};
```
- React.FC 显式地定义了返回类型，其他方式是隐式推导的。

- React.FC 对静态属性： displayName、propTypes、defaultProps提供了类型检查和自动补全。

- React.FC 为 children 提供了隐式的类型(`ReactElement | null`)

**有状态组件**

可以是一个类组件且存在props和state属性。

如果使用typescript声明则如下所示：
```js
import * as React from 'react';

interface IProps {
  logo?: string;
  className?: string;
  alt?: string;
}
interface IState {
  count: number;
}

class App extends React.Component<IProps, IState> {
  public state = {
    count: 1,
  };
  public render() {
    return <div>Hello world</div>
  }
}
```
上述通过泛型对`props`、`state`进行类型定义，然后在使用的时候就可以在编译器中获取更多的智能提示。

关于`Component`泛型类的定义，可以参考下React的类型定义文件 `node_modules/@types/react/index.d.ts`，如下所示：
```js
class Component<P, S> {
  readonly props: Readonly<{ children?: ReactNode }> & Readonly<P>;

  state: Readonly<S>;
}
```
从上述可以看到，state属性也定义了可读类型，目的是为了防止直接调用`this.state`更新状态。

**受控组件**

受控组件的特性在于元素的内容通过组件的状态state进行控制。

由于组件内部的事件是合成事件，不等同与原生事件，

例如一个input组件修改内部的状态，常见的定义的时候如下所示：
```js
private updateValue (e: React.ChangeEvent<HTMLInputElement>) {
  this.setState({ itemText: e.target.value })
}
```
常见Event事件对象类型：

- ClipboardEvent<T = Element> 剪贴板事件对象

- DragEvent<T = Element> 拖拽事件对象

- ChangeEvent<T = Element> 改变事件对象

- keyboardEvent<T = Element> 键盘事件对象

- MouseEvent<T = Element> 鼠标事件对象

- TouchEvent<T = Element> 触摸事件对象

- WheelEvent<T = Element> 滚轮事件对象

- AnimationEvent<T = Element> 动画事件对象

- TransitionEvent<T = Element> 过渡事件对象

T接收一个DOM元素类型。

## 三、总结

上述只是简单的在React项目使用TypeScript，但在编写React项目的时候，还存在hooks、默认参数、以及store等等......

TypeScript在框架中使用的学习成本相对会更高，需要不断编写才能熟练。