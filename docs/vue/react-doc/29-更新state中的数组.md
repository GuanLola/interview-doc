## 更新 state 中的数组

数组是另外一种可以存储在 `state` 中的 JavaScript 对象，它虽然是可变的，但是却应该被视为不可变。同对象一样，当你想要更新储存于state中的数组时，你需要创建一个新的数组（或者创建一份已有数组的拷贝值），并使用新数组设置state。

- 如何添加、删除或者修改 React state 中的数组中的元素

- 如何更新数组内部的对象

- 如果通过 Immer 降低数组拷贝的重复度

## 在没有 mutation 的前提下更新数组

在 JavaScript 中，数组只是另一种对象。[同对象一样](https://zh-hans.react.dev/learn/updating-objects-in-state)，`你需要将 React state中的数组视为只读的`。这意味着你不应该使用类似于 `arr[0] = 'bird'` 这样的方式来重新分配数组中的元素，也不应该使用会直接修改原始数组的方法，例如`push()`和`pop()`。

相反，每次要更新一个数组时，你需要把一个新的数组传入 `state` 的 `setting` 方法中。为此，你可以通过使用像`filter()`和`map()`这样不会直接修改原始值的方法，从原始数组生成一个新的数组。然后你可以将state设置为这个新生成的数组。

下面是常见数组操作的参考表。当你操作 React state 中的数组时，你需要避免使用左列的方法，而首选右列的方法：

|  | 避免使用（会改变数原始数组） | 推荐使用（会返回一个新数组） |
|---|---|---|
| 添加元素 | push, unshift | concat, [...arr]展开语法（[例子](https://zh-hans.react.dev/learn/updating-arrays-in-state#adding-to-an-array)） |
| 删除元素 | pop, shift, splice | filter, slice([例子](https://zh-hans.react.dev/learn/updating-arrays-in-state#removing-from-an-array)) |
| 替换元素 | splice, arr[i] = ... 赋值 | map([f例子](https://zh-hans.react.dev/learn/updating-arrays-in-state#replacing-items-in-an-array)) |
| 排序 | reverse, sort | 先将数组复制一份([例子](https://zh-hans.react.dev/learn/updating-arrays-in-state#making-other-changes-to-an-array)) |

或者，你可以[使用Immer](https://zh-hans.react.dev/learn/updating-arrays-in-state#write-concise-update-logic-with-immer)，这样你便可以使用表格中的所有方法了。

不幸的是，虽然[slice](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)和[splice](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)的名字相似，但作用却迥然不同：

- `slice`让你可以拷贝数组或是数组的一部分。

- `splice`会`直`接修`改`原始数组（插入或者删除元素）。

在React中，更多情况下你会使用`slice`（没有`p`！），因为你不想改变 state 中的对象或数组。[`更新对象`](https://zh-hans.react.dev/learn/updating-objects-in-state)这一章节解释了什么是`mutation`，以及为什么不推荐在 state 里这样做。

## 向数组添加元素

`push()`会直接修改原始数组，而你不希望这样：

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>振奋人心的雕塑家们：</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() =>{
        {/* artists.push({
          id: nextId++,
          name: name,
        }); */}
        setArtists([...artists, { is: nextId++, name: name }])
      }}>添加</button>
      <ul>
        {artists.map(artist => {
          <li key={artist.id}>{artist.name}</li>
        })}
      </ul>
    </>
  )
}
```

相反，你应该创建一个新数组，其包含了原始数组的所有元素 以及 一个末尾的新元素。这可以通过很多种方法实现，最简单的一种就是使用`...`[数组展开](https://zh-hans.react.dev/a-javascript-refresher#array-spread)语法：

```js
setArtists( // 替换 state
  [ // 是通过闯入一个新数组实现的
    ...artists, // 新数组包含原数组的所有元素
    { id: nextId++, name: name } // 并在末尾添加了一个新的元素
  ]
);
```
现在代码可以正常运行了：

```js
// App.js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>振奋人心的雕塑家们：</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>添加</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  )
}
```

这样一来，展开操作就可以完成`push()`和`unshift()`的工作，将新元素添加到数组的末尾和开头。你可以在上面的`sandbox`中尝试一下！

## 从数组中删除元素

从数组中删除一个元素最简单的方法就是将`它过滤出去`。换句话说，你需要生成一个不包含该元素的新数组。这可以通过`filter`方法实现，例如：

```js
// App.js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Marta Colvin Andrade' },
  { id: 2, name: 'Marta Colvin Andrade' },
]

export default function List() {
  const [artists, setArtists] = useState(initialArtists);

  return (
    <>
      <h1>振奋人心的雕塑家们：</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a => a.id !== artist.id)
              );
            }}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
```
点击“删除”按钮几次，并且查看按钮处理点击事件的代码。

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```
这里，`artists.filter(s => s.id !== artist.id)` 表示“创建一个新的数组，该数组由那些 ID 与 `artists.id` 不同的`artists`组成”。换句话说，每个`artist`的“删除”按钮会把 那一个 artist 从原始数组中过滤掉，并使用过滤后的数组再次进行渲染，注意，`filter` 并不会改变原始数组。

## 转换数组

如果你想改变数组中的某些或全部元素，你可以用`map()`创建一个新数组。你传入`map`的函数决定了要根据每个元素的值或索引（或第二者都要）对元素做何处理。

在下面的例子中，一个数组记录了两个圆形和一个正方形的坐标。当你点击按钮时，仅有两个圆形会向下移动 100 像素。这是通过使用`map()`生成一个新数组实现的。

```js
// App.js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 50 },
  { id: 0, type: 'square', x: 150, y: 100 },
  { id: 0, type: 'circle', x: 150, y: 100 },
];

export default function ShapeEditor() {

  const [shapes, setShapes] = useState(initialShapes);

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'circle') {
        // 返回一个新的圆形，位置在下方 50px 处
        return { ...shape, y: shape.y + 50 };
      } else {
        // 不作改变
        return shape;
      }
    })
    // 使用新的数组进行重渲染
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>所有圆形向下移动！</button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
            background: 'purple',
            position: 'absolute',
            left: shape.x,
            top: shape.y,
            borderRadius:
              shape.type === 'circle'
              ? '50%'
              : '',
            width: 20,
            height: 20,
          }}
        />
      ))}
    </>
  )
}
```

## 替换数组中的元素

想要替换数组中一个或多个元素是非常常见的。类似`arr[0] = 'bird'这样的赋值语句会直接修改原始数组，所以在这种情况下，你也应该使用`map`。

要替换一个元素。请使用`map`创建一个新数组。在你的`map`回调里，第二个参数是元素的索引。使用索引来判断最终是返回原始的元素（即回调的第一个参数）还是替换成其他值：

```js
// App.js
import { useState } from 'react';

let initialCounters = [0, 0, 0];

export default function CounterList() {
  const [counters, setCounters] = useState(initialCounters);

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => { handleIncrementClick(i)}}>+1</button>
        </li>
      ))}
    </ul>
  )
}
```