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

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // 递增被点击的计数器数值
        return c + 1;
      } else {
        // 其余部分不发生变化
        return c;
      }
    });
    setCounters(nextCounters);
  }

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

## 向数组中插入元素

有时，你也许想向数组特定位置插入一个元素，这个位置既不在数组开头，也不在末尾。为此，你可以将数组展开运算符`...`和`slice()`方法一起使用。`slice()`方法让你从数组中切出"一片"。为了将元素插入数组，你需要先展开原数组在插入点之前的切片，然后插入新元素，最后展开数组中剩下的部分。

下面的例子中，插入按钮总是会将元素插入到数组中索引为`1`的位置。

```js
// App.js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade'},
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
]

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(initialArtists);

  function handleClick() {
    const insertAt = 1; // 可能是任何索引

    const nextArtists = [
      // 插入点之前的元素；
      ,,,artists.slice(0, insertAt),
      // 新的元素；
      { id: nextId++, name: name },
      // 插入点之前的元素
      ...artists.slice(insertAt)
    ];

    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>振奋人心的雕塑家们：</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        插入
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  )
}
```
## 其他改变数组的情况

总会有一些事，是你仅仅依靠展开运算符和`map()`或者`filter()`等不会直接修改原值的方法所无法做到的。例如，你可能想翻转数组，或是对数组排序。而 JavaScript 中的 reverse() 和 sort() 方法会改变原数组，所以你无法直接使用它们。

然而，你可以先拷贝这个数组，再改变这个拷贝后的值。

```js
// App.js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army'},
]

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        翻转
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  )
}
```

在这段代码中，你先使用`[...list]`展开运算符创建了一份数组的拷贝值。当你有了这个拷贝值后，你就可以使用像`nextList.reverse()`或`nextList.sort()`这样直接修改原数组的方法。你甚至可以通过`nextList[0] = "something"`这样的方法对数组中的特定元素进行赋值。

然而，`即使你拷贝了数组，你还是不能直接修改其内部的元素`。这是因为数组的拷贝是浅拷贝 -- 新的数组中依然保留了与原始数组相同的元素。因此，如果你修改了拷贝数组内部的某个对象，其实你正在直接修改当前的 state 。举个例子，像下面的代码就会带来问题。

```js
const nextList = [...list];
nextList[0].seen = true; // 问题：直接修改了`list[0]`的值
setList(nextList);
```
虽然`nextList`和`list`是两个不同的数组，`nextList[0]`和`list[0]`却指向了同一个对象。因此，通过改变`nextList[0].seen`，`list[0].seen`的值也被改变了。这是一种`state`的`mutation`操作，i应该避免这样做！你可以用类似于[`更新嵌套的 JavaScript 对象`](https://zh-hans.react.dev/learn/updating-objects-in-state#updating-a-nested-object)的方式解决这个问题 ———— 拷贝想要修改的特定元素，而不是直接修改它。下面是具体的操作。

## 更新数组内部的对象

对象并不是真的位于数组“内部”。可能他们在代码中看起来像是在数组“内部”，但其实数组中的每个对象都是这个数组“指向”的一个存储与其他位置的值。这就是当你在处理类似`list[0]`这样的嵌套字段时需要格外小心的原因。其他人的艺术品清单可能指向了数组的同一个元素！

`当你更新一个嵌套的state时，你需要从想要更新的地方创建拷贝值，一直这样，直到顶层。`让我们看一下这该怎么做。

在下面的例子中，两个不同的艺术品清单有着相同的初始 state。他们本应该互不影响，但是因为一次`mutation`，他们的 state 被意外地共享了，勾选一个清单中事项会影响另外一个清单：

```js
// App.js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
]

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle{
                  artwork.id,
                  e.target.checked,
                };
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  )
}

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(initialList);

  function handleToggleMyList(artworkId, nextSeen) {
    const yourNextList = [...yourLIst];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id = artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>艺术愿望清单</h1>
      <h2>我想看的艺术清单：</h2>

      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList}
      />

      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList}
      />
    </>
  )
}
```

问题出在下面这段代码中：

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // 问题：直接修改了已有的元素
setMyList(myNextList);
```
虽然`myNextList`这个数组是新的，但是其内部的元素本身与原数组`myList`是相同的。因此，修改`artwork.seen`,其实是在修改原始的`artwork`对象。而这个`artwork`对象也被`yourList`使用，这样就带来了 bug。这样的`bug`可能难以想到，但好在如果你避免直接修改 state，它们就会消失。

`你可以使用 map 在没有 mutation 的前提下将一个旧的元素替换成更新的版本。`

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // 创建包含变更的新对象
    return { ...artwork, seen: nextSeen };
  } else {
    // 没有变更
    return artwork;
  }
}));
```
此处的`...`是一个对象展开语法，被用来[创建一个对象的拷贝](https://zh-hans.react.dev/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)

通过这种方式，没有任何现有的 state 中的元素会被改变， bug 也就被修复了。

```js
// App.js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
]

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                )
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  )
}

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(initialList);

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }))
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }))
  }

  return (
    <>
      <h1>艺术愿望清单</h1>

      <h2>我想看的艺术清单：</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList}
      />

      <h2>你想看的艺术清单：</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList}
      />
    </>
  )
}
```

通常来讲，`你应该只直接修改你刚刚创建的对象`。如果你正在插入一个新的`artwork`，你可以修改它，但是如果你想要改变的是 state 中已经存在的东西，你就需要先拷贝一份了。

## 使用 Immer 编写简洁的更新逻辑

在没有 mutation 的前提下更新嵌套数组可能会变得有点重复。[就像对对象一样](https://zh-hans.react.dev/learn/updating-objects-in-state#write-concise-update-logic-with-immer)：

- 通常情况下，你应该不需要更新处于非常深层及的 state 。如果你有此类需求，你或许需要 [调整一下数据的结构](https://zh-hans.react.dev/learn/choosing-the-state-structure#avoid-deeply-nested-state)，让数据变得扁平一些。

- 如果你不想改变 state 的数据结构，你也许会更喜欢使用 [Immer](https://github.com/immerjs/use-immer)，它让你可以继续使用方便的，但会直接吸怪原值的语法，并负责为你生成拷贝值。

下面是我们用 Immer 来重写的艺术愿望清单的例子：

```js
// package.json

{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env-jsdom",
    "eject": "react-scripts eject"
  },
  "devDependencies": {}
}
```

```js
// App.js

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                )
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  )
}

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'The Last Supper', seen: true },
]

export default function BucketList() {
  const [myList, updateMyList] = useImmer(initialList);
  const [yourList, updateYourList] = useImmer(initialList);

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a => a.id === id);
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a => a.id === artworkId);
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>艺术愿望清单</h1>
      <h2>我想看的艺术清单：</h2>

      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList}
      />

      <h2>你想看的艺术清单：</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList}
      />
    </>
  )
}
```
请注意当使用 Immer 时，类似 `artwork.seen = nextSeen` 这种会产生 mutation 的语法不会再有任何问题了：

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artWorkId);
  artwork.seen = nextSeen;
});
```

这是因为你并不是在直接修改原始的 state， 而是在修改 Immer 提供的一个特殊的 `draft` 对象。同理，你也可以为`draft`的内容使用`push()`和`pop()`这些直接修改原值的方法。

在幕后，Immer 总是会根据你对 `draft` 的修改来从头开始构建下一个 state 。这使得你的事件处理程序非常的简洁，同时也不会直接修改 state。

## 摘要

- 你可以把数组放入 state 中，但你不应该直接修改它。

- 不要直接修改数组，而是创建它的一份 新的 拷贝，然后使用新的数组来更新它的状态。

- 你可以使用 `[...arr, newItem]` 这样的数组展开语法来向数组中添加元素。

- 你可以使用 `filter()` 和 `map()` 来创建一个经过过滤或者变换的数组。

- 你可以使用 `Immer` 来保持代码简洁。

## 尝试一些挑战

1、更新购物车中的商品

填写 `handleIncreaseClick`的逻辑，以便按下“+”时递增对应数字：

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [products, setProducts] = useState(initialProducts);

  function handleIncreaseClick(productId) {
    setProducts(products.map(v => {
      if (productId === v.id) {
        return { ...v, count: v.count + 1 };
      } else {
        return v;
      }
    }))
  }

  return (
    <ul>
      {products.map(product) => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => handleIncreaseClick(product.id);}>
            +
          </button>
        </li>
      )}
    </ul>
  )
}
```

2、删除购物车中的商品

现在购物车有了一个正常工作的“+”按钮，但是“-”按钮却没有任何作用。你需要为它添加 一个事件处理程序，以便按下它时可以减少对应商品的`count`。如果在数字为`1`时按下“-”按钮，商品需要自动从购物车中移除。确保商品计数永远不出现`0`。

```js
// App.js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}]

export default function ShoppingCart() {
  const [products, setProducts] = useState(initialProducts);

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, count: product.count + 1 };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return { ...product, count: product.count - 1 };
      } else {
        return product;
      }
    })

    setProducts(nextProducts.filter(product => product.count > 0));
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => { handleIncreaseClick(product.id); }}>
            +
          </button>
          <button onClick={() => { handleDecreaseClick(product.id); }}>
            -
          </button>
        </li>
      ))}
    </ul>
  )
}
```

3、使用不会直接修改原始值的方法修复 mutation 的问题。

在下面的例子中，`App.js`中所有的事件处理程序都会产生`mutation`。这导致编辑和删除待办事项的功能无法正常运行。使用不会直接修改原始值的方法重写 `handleAddTodo`、`handleChangeTodo`和`handleDeleteTodo`这三个函数：

```js

```

在`handleAddTodo`中，你可以使用数组展开语法：在`handleChangeTodo`中，你可以使用`map`创建一个新数组；在`handleDeleteTodo`中，你可以使用`filter`创建一个新数组。现在列表可以正常工作了：

```js
// AddTodo.js
import { useStat } from 'react';

export function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');

  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>添加</button>
    </>
  )
}
```

```js
// TaskList.js
import { useState } from 'react';

export default function TaskList({ todos, onChangeTodo, onDeleteTodo }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  )
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  let todoContent;

  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            ...todo,
            title: e.target.value
          }}
        />
        <button onClick={() => setIsEditing(false)}>
          保存
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          编辑
        </button>
      </>
    )
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>删除</button>
    </label>
  )
}
```

```js
// App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Learn React', completed: false },
  { id: 1, title: 'Build a Todo App', completed: true },
  { id: 2, title: 'Eat lunch', completed: false }
]

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      { id: nextId++, title: title, done: false }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(todos.filter(t => t.id !== todoId));
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />

      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  )
}
```

4、使用 Immer 修复 mutation 的问题

下面的例子和上一个挑战的相同。这次，你需要使用 Immer 来修复 mutation 的问题。为了方便，`useImmer`已经被引入了，你需要使用它来替换`todos`的`state`变量。

通过使用 Immer，只要你仅仅直接修改 `Immer` 提供给你的 draft 的一部分，你就可以 `mutation` 的方式写代码。这里所有的 mutation 都在 `draft` 上执行，因此代码可以正常运行：

```js
// package.json

{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "devDependencies": {}
}
```

```js
// App.js

import { useState } from 'react';
import { useImmer } from 'use=immer';
import AddTodo from './AddTodo.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Learn React', done: false },
  { id: 2, title: 'Eat lunch', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(initialTodos);

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({ id: nextId++, title, done: false })
    })
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t => t.id === nextTodo.id);
      if (todo) {
        todo.title = nextTodo.title;
        todo.done = nextTodo.done;
      }
    })
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t => t.id === todoId);
      if (index !== -1) {
        draft.splice(index, 1);
      }
    })
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />

      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  )
}
```

```js
// AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');

  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>添加</button>
    </>
  )
}
```

```js
// TaskList.js
import { useState } from 'react';

export default function TaskList({ todos, onChangeTodo, onDeleteTodo }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  let todoContent;

  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }}
        />
        <button onClick={() => {
          setIsEditing(false);
        }}>保存</button>
      </>
    )
  } else {
    todoContent = (
      <>
        { todo.title }
        <button onClick={() => setIsEditing(true)}>
          编辑
        </button>
      </>
    );
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        删除
      </button>
    </label>
  )
}

```

你还可以在 Immer 中混合使用会改变和不会改变原始值的方法。

例如，在下面的代码中，`handleAddTodo`是通过直接修改 Immer 的 `draft`实现的，而`handleChangeTodo`和`handleDeleteTodo`则使用了不会直接修改原始值的`map`和`filter`方法：

通过使用 Immer, 你可以为每个单独的场景选择最为自然的代码风格。