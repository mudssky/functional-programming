# functional-programming



## 01.纯函数(Purity)

### 1.纯函数的定义

输出仅由输入决定，且不产生副作用。

```javascript
const greet = (name) => `hello, ${name}`
greet('world')
```

以下代码不是纯函数：

```javascript
window.name = 'Brianne'

const greet = () => `Hi, ${window.name}`

greet() // "Hi, Brianne"
```

以上示例中，函数依赖外部状态。

```javascript
let greeting

const greet = (name) => {
    greeting = `Hi, ${name}`
}

greet('Brianne')
greeting // "Hi, Brianne"
```

以上实例中，函数修改了外部状态。

**纯函数的几个特性**:

- 无**副作用(Side effects)**
- 可缓存性 (Cacheable)
- 可移植性,自文档化（Portable / Self-Documenting）
- 可测试性（Testable）
- 合理性,引用透明性（Reasonable）
- 并行运算

### 2.特性1:无副作用(Side effects)

如果函数与外部可变状态进行交互，则它是有副作用的。

副作用可能包含，但不限于：

- 更改文件系统
- 往数据库插入记录
- 发送一个 http 请求
- 可变数据
- 打印/log
- 获取用户输入
- DOM 查询
- 访问系统状态
- ...

```javascript
const differentEveryTime = new Date()//可变日期函数是副作用
console.log('IO is a side effect!')//log函数也是副作用
```

### 3.特性2:可缓存性 (Cacheable)

由于纯函数的输入就决定了输出,就和数学中的函数一样(所以我们也可以像数学公式一样推导),一个确定的输入对应一个确定的输出,

因此我们可以根据传入的参数把结果缓存起来,这样后续以同样的参数调用的时候就可以直接返回结果,而不是重新执行一遍算法.



实现缓存的一种典型方式是memoize技术,

下面的代码是一个粗略的实现,	传入纯函数作为参数,就能返回一个带缓存的纯函数.

```javascript
var memoize = function(f) {
  var cache = {};

  return function() {
    var arg_str = JSON.stringify(arguments);
    cache[arg_str] = cache[arg_str] || f.apply(f, arguments);
    return cache[arg_str];
  };
};
```



下面是我参考lodash的代码用typescript写的memoize函数，

lodash的代码里面用给函数加cache属性的方式，但是在typescript里面函数是不能用`.`语法随便添加属性的。

所以我实现的版本没办法查看缓存究竟有多少

```typescript
/**
 *
 * 传入一个函数,返回它的带缓存版本,
 * 缺点是缓存在闭包里面没办法获取,也没办法消除.
 * 第二个参数resolver是用来产生缓存的key的函数,如果你不提供这个函数,将会用函数的第一个参数作为key
 * @param func 需要缓存的函数
 * @param resolver 生成缓存key的映射的函数
 */
function memoize(
  func: (...args: any) => any,
  resolver?: (...args: any) => any
): (...args: any) => any {
  // func 和 resolve需要都是函数类型
  if (
    typeof func !== 'function' ||
    (resolver != null && typeof resolver !== 'function')
  ) {
    throw new TypeError('Expected a function')
  }
  const cache = new Map()
  const memoized = function (...args: any): any {
    const key = resolver ? resolver(args) : args[0]
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = func(args)
    cache.set(key, result)
    return result
  }
  return memoized
}
export default memoize
```

下面是编译成es2015的代码，基本上除了没有类型也没什么变化了。

```javascript
/**
 *
 * 传入一个函数,返回它的带缓存版本,
 * 缺点是缓存在闭包里面没办法获取,也没办法消除.
 * 第二个参数resolver是用来产生缓存的key的函数,如果你不提供这个函数,将会用函数的第一个参数作为key
 * @param func 需要缓存的函数
 * @param resolver 生成缓存key的映射的函数
 */
function memoize(func, resolver) {
    // func 和 resolve需要都是函数类型
    if (typeof func !== 'function' ||
        (resolver != null && typeof resolver !== 'function')) {
        throw new TypeError('Expected a function');
    }
    var cache = new Map();
    var memoized = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key = resolver ? resolver(args) : args[0];
        if (cache.has(key)) {
            return cache.get(key);
        }
        var result = func(args);
        cache.set(key, result);
        return result;
    };
    return memoized;
}
```

### 4.特性3：可移植性,自文档化（Portable / Self-Documenting）

纯函数的依赖很明确，因此更易于观察和理解

因为他们与环境无关，所以可以拷贝到任何地方运行，提高了代码的复用性。

对比面向对象，你从类中拷贝一个方法，就要麻烦得多。

### 5.特性4：可测试性（Testable）

纯函数让测试更加容易。

只需要给定输入，断言输出就可以了。

甚至有专门的测试工具帮我们自动生成输入，并断言输出。

比如**Quickcheck**

### 6.特性5：引用透明性(referential transparency)，合理性（Reasonable）

一个表达式能够被它的值替代而不改变程序的行为称为引用透明。

```typescript
const greet = () => 'hello, world.'
```

引用透明有利于我们使用一种 “等式推导”（equational reasoning）的技术来分析代码，



### 7.特性6：可以并行运行

我们可以并行运行任意纯函数。因为纯函数根本不需要访问共享的内存，而且根据其定义，纯函数也不会因副作用而进入竞争态（race condition）。

js毕竟是个单线程的语言，在其他多线程的语言里面这个作用就比较明显了，比如golang，比如julia，利用纯函数的特性并行计算，可以充分利用计算机的性能。

## 02.柯里化(Currying)

**柯里化**  将一个多元函数转变为一元函数的过程。 每当函数被调用时，它仅仅接收一个参数并且返回带有一个参数的函数，直到传递完所有的参数。

下面是例子

```javascript
const sum = (a, b) => a + b

const curriedSum = (a) => (b) => a + b

curriedSum(3)(4)         // 7

const add2 = curriedSum(2)

add2(10)     // 
```

当我们编写柯里化相关的函数的时候，通常会把内存占用大的参数放在列表的后面，比如map，第一个参数是函数，第二个才是数值，这样柯里化之后，可以再最后传入数值，减少性能浪费，也更符合充分利用函数作为一等公民的便利性。

下面我们从介绍柯里化相关的术语开始

### 1.Arity 函数参数的个数

函数参数的个数。来自于单词 unary, binary, ternary 等等。这个单词是由 -ary 与 -ity 两个后缀拼接而成。例如，一个带有两个参数的函数被称为二元函数或者它的 arity 是2。它也被那些更喜欢希腊词根而非拉丁词根的人称为 `dyadic`。同样地，带有可变数量参数的函数被称为 `variadic`，而二元函数只能带两个参数。

```javascript
const sum = (a, b) => a + b

const arity = sum.length
console.log(arity)        // 2
```

在JavaScript的api里面，函数的参数个数可以通过函数的`length`属性来获取。

如何定义一个任意个参数的函数,我们可以用到es6的语法，下面`...arg`就表示任意个参数

获取的时候，args相当于数组，`...`是数组解构的语法，另外我们在函数的内部的时候，作用域里面有一个argument参数，用过这个也可以获取到函数的参数和参数个数。

```javascript
function(...args){
 args.forEach(()=>{
     
 })   
}
```

### 2.高阶函数 (Higher-Order Function / HOF)

以函数为参数或返回值。

柯里化函数算是典型的高阶函数

```javascript
const filter = (predicate, xs) => xs.filter(predicate)

const is = (type) => (x) => Object(x) instanceof type

filter(is(Number), [0, '1', 2, null]) // 0, 2
```

### 3.偏函数 (Partial Function)

对原始函数预设参数作为一个新的函数。

当我们柯里化函数之后，部分传参后返回的函数也就是偏函数。

```JavaScript
// 创建偏函数，固定一些参数
const partical = (f, ...args) =>
  // 返回一个带有剩余参数的函数
  (...moreArgs) =>
    // 调用原始函数
    f(...args, ...moreArgs)

const add3 = (a, b, c) => a + b + c

// (...args) => add3(2, 3, ...args)
// (c) => 2 + 3 + c
const fivePlus = partical(add3, 2, 3)

fivePlus(4)  // 9
```

也可以使用 `Function.prototype.bind` 实现偏函数。

```javascript
const add1More = add3.bind(null, 2, 3)
```

偏函数应用通过对复杂的函数填充一部分数据来构成一个简单的函数。柯里化通过偏函数实现。

### 4.自动柯里化 (Auto Currying)

`lodash`，`understore` 和 `ramda` 有 `curry` 函数可以自动完成柯里化。

```javascript
const add = (x, y) => x + y

const curriedAdd = _.curry(add)

curriedAdd(1, 2)   // 3
curriedAdd(1)(2)   // 3
curriedAdd(1)      // (y) => 1 + y
```

#### typescript 实现两个参数函数的柯里化

```typescript
/**
 * 对有两个参数的函数进行柯里化
 * @param func 有两个参数的函数
 * @returns 柯里化后的函数
 */
function curry2(func: (x: any, y: any) => any) {
  return function f2(a?: any, b?: any) {
    switch (arguments.length) {
      case 0:
        return f2
      case 1:
        return (_b: any): any => {
          return func(a, _b)
        }
      case 2:
        return func(a, b)
      default:
        throw new Error(
          'curry2 arity must be a non-negative integer no greater than 2'
        )
    }
  }
}
export default curry2
```

经过tsc编译后，es6的代码如下

```javascript
function curry2(func) {
    return function f2(a, b) {
        switch (arguments.length) {
            case 0:
                return f2;
            case 1:
                return (_b) => {
                    return func(a, _b);
                };
            case 2:
                return func(a, b);
            default:
                throw new Error('curry2 arity must be a non-negative integer no greater than 2');
        }
    };
}
```

#### typescript 实现任意个参数函数的柯里化

柯里化的实质很简单，就是随便你分几次传参，每次传几个参数，每次传参都会把传进去的参数存到闭包里，直到传入了函数所有的参数才会进行调用。

讲究的是延迟调用，也使得函数的传参更加灵活。



下面实现了任意个参数的函数的柯里化，主要逻辑是不断收集传入函数的参数，直到收集齐参数后，用这些参数调用原来的函数即可。如果没有收集齐参数，则是递归调用，再次返回同一个函数，并且把收集到的参数都传入。



```typescript
/**
 *
 * @param fn  需要柯里化的函数
 * @param length 柯里化的参数个数，默认值为传入函数的参数个数
 * @returns 返回柯里化后的函数，可以传入任意小于原函数参数个数的参数，参数全部传递完成就会返回执行结果
 */
function curryN(fn: (...args: any) => any, length: number = fn.length) {
  return _curry(fn, length)
}

function _curry(fn: (...args: any) => any, length: number, ...args: any) {
  // args 是已经收集到的数据，函数第一次执行时不传入相当于0
  // param用来收集这次传入的参数
  // _args则是把两者拼起来，累计已经收集到的数据
  return function (...params: any) {
    //   收集所有输入的参数
    let _args = [...args, ...params]
    // 如果收集参数的个数达到最初得到的函数参数总个数,直接传入收集到的所有参数并返回执行结果
    if (_args.length >= length) {
      return fn(..._args)
    } else {
      // 如果收集的参数未达到目标,继续收集参数
      return _curry(fn, length, ..._args)
    }
  }
}

export default curryN
```

下面是编译成es6

```javascript
/**
 *
 * @param fn  需要柯里化的函数
 * @param length 柯里化的参数个数，默认值为传入函数的参数个数
 * @returns 返回柯里化后的函数，可以传入任意小于原函数参数个数的参数，参数全部传递完成就会返回执行结果
 */
function curryN(fn, length = fn.length) {
    return _curry(fn, length);
}
function _curry(fn, length, ...args) {
    // args 是已经收集到的数据，函数第一次执行时不传入相当于0
    // param用来收集这次传入的参数
    // _args则是把两者拼起来，累计已经收集到的数据
    return function (...params) {
        //   收集所有输入的参数
        let _args = [...args, ...params];
        // 如果收集参数的个数达到最初得到的函数参数总个数,直接传入收集到的所有参数并返回执行结果
        if (_args.length >= length) {
            return fn(..._args);
        }
        else {
            // 如果收集的参数未达到目标,继续收集参数
            return _curry(fn, length, ..._args);
        }
    };
}
exports.default = curryN;
```

#### typescript 给curryN添加占位符功能

lodash的curry函数有用占位符，调整参数传入顺序的功能，简单来说就是占位符所在的参数可以延后传入的时间。

下面是例子

```javascript
let fn = function(a, b, c, d, e) {
    console.log([a, b, c, d, e]);
}

let _fn = _.curry(fn);  
_fn(1, 2, 3, 4, 5);                 // print: 1,2,3,4,5
_fn(_, 2, 3, 4, 5)(1);              // print: 1,2,3,4,5
_fn(1, _, 3, 4, 5)(2);              // print: 1,2,3,4,5
```

lodash采用了lodash对象来做占位符，但是我们的curry函数没有挂载对象，因此采用了curry函数自身作为默认的占位符



下面是具体实现

相比之前就复杂了很多，因为我们还要记录占位符和占位符的位置。

```typescript
/**
 * 返回柯里化后的函数，支持用占位符改变参数的传递顺序，
 * 默认的占位符是curry函数本身
 *
 * @param fn 柯里化的原函数
 * @param length 需要的参数个数，默认为函数的形参个数
 * @param placeHolder 占位符，默认当前柯里化函数
 * @returns 柯里化后的函数
 */
function curry(
  fn: (...args: any) => any,
  length: number = fn.length,
  placeHolder: any = curry
) {
  return _curry(fn, length, placeHolder, [], [])
}
/**
 * 递归调用实现柯里化的中间函数
 * @param fn 柯里化的原函数
 * @param length 原函数需要的参数个数
 * @param placeHolder 接收的占位符
 * @param argsCopy 已接收的参数列表
 * @param holdersCopy 已接收的占位符位置列表
 * @returns 柯里化后的函数,或是递归调用收集参数的函数
 */
function _curry(
  fn: (...args: any) => any,
  length: number = fn.length,
  placeHolder: any,
  args: any[],
  holders: number[]
) {
  return function (..._args: any) {
    //   两个参数列表是引用类型，复制一份后再操作，防止函数重复调用操作初始值地址把初始值搞乱影响结果
    let argsCopy = args.slice()
    let holdersCopy = holders.slice()

    _args.forEach((value: any, index: number) => {
      if (argsCopy.length < length) {
        //   如果新增参数中包含占位符，除了加入args列表，还要再在holders里面添加位置索引
        if (value === placeHolder) {
          // 占位符的位置就是当前参数数组末尾
          holdersCopy.push(argsCopy.length)
          argsCopy.push(placeHolder)
        } else {
          // 如果是普通参数，直接加入args现存参数列表
          argsCopy.push(value)
        }
      }
      // 参数列表等于函数形参个数，此时占位符全部忽略,开始清理占位符，替换占位符为新增参数
      else {
        if (value !== placeHolder && holdersCopy.length > 0) {
          const holdIdx = holdersCopy[0]
          holdersCopy.shift()
          argsCopy[holdIdx] = value
        }
      }
    })
    //现存参数等于形参，并且占位符全部替换完成,说明参数收集完成=
    if (argsCopy.length >= length && holdersCopy.length <= 0) {
      return fn(...argsCopy)
    } else {
      // 参数没有收集齐，则进入下一轮收集
      return _curry(fn, length, placeHolder, argsCopy, holdersCopy)
    }
  }
}

export default curry
```

编译成es6

```javascript
/**
 * 递归调用实现柯里化的中间函数
 * @param fn 柯里化的原函数
 * @param length 原函数需要的参数个数
 * @param placeHolder 接收的占位符
 * @param argsCopy 已接收的参数列表
 * @param holdersCopy 已接收的占位符位置列表
 * @returns 柯里化后的函数,或是递归调用收集参数的函数
 */
function _curry(fn, length = fn.length, placeHolder, args, holders) {
    return function (..._args) {
        //   两个参数列表是引用类型，复制一份后再操作，防止函数重复调用操作初始值地址把初始值搞乱影响结果
        let argsCopy = args.slice();
        let holdersCopy = holders.slice();
        _args.forEach((value, index) => {
            if (argsCopy.length < length) {
                //   如果新增参数中包含占位符，除了加入args列表，还要再在holders里面添加位置索引
                if (value === placeHolder) {
                    // 占位符的位置就是当前参数数组末尾
                    holdersCopy.push(argsCopy.length);
                    argsCopy.push(placeHolder);
                }
                else {
                    // 如果是普通参数，直接加入args现存参数列表
                    argsCopy.push(value);
                }
            }
            // 参数列表等于函数形参个数，此时占位符全部忽略,开始清理占位符，替换占位符为新增参数
            else {
                if (value !== placeHolder && holdersCopy.length > 0) {
                    const holdIdx = holdersCopy[0];
                    holdersCopy.shift();
                    argsCopy[holdIdx] = value;
                }
            }
        });
        //现存参数等于形参，并且占位符全部替换完成,说明参数收集完成=
        if (argsCopy.length >= length && holdersCopy.length <= 0) {
            return fn(...argsCopy);
        }
        else {
            // 参数没有收集齐，则进入下一轮收集
            return _curry(fn, length, placeHolder, argsCopy, holdersCopy);
        }
    };
}
```

#### jest为curry函数编写单元测试

```typescript
import curry from '../../fp-lib/curry'

test('normal curry test', () => {
  const testFn = (a, b, c, d, e) => {
    return [a, b, c, d, e]
  }
  const input = [1, 2, 3, 4, 5]
  const expected = [1, 2, 3, 4, 5]
  const curriedFn = curry(testFn)
  expect(curriedFn(1)(2)(3)(4)(5)).toEqual(expected)
  expect(curriedFn(1)(2, 3)(4)(5)).toEqual(expected)
  expect(curriedFn(1)(2, 3)(4, 5)).toEqual(expected)
  expect(curriedFn(...input)).toEqual(expected)
})

test('curry placeholder', () => {
  const testFn = (a, b, c, d, e) => {
    return [a, b, c, d, e]
  }
  const input = [1, 2, 3, 4, 5]
  const expected = [1, 2, 3, 4, 5]
  const curriedFn = curry(testFn)
  // 默认占位符是curry函数本身
  expect(curriedFn(1)(curry)(3)(4)(5)(2)).toEqual(expected)
  expect(curriedFn(1)(curry, 3)(4)(5)(2)).toEqual(expected)
  expect(curriedFn(1)(2, 3)(curry, curry)(4)(5)).toEqual(expected)
})
```

## 03.函数组合 (Function Composing)

接收多个函数作为参数，从右到左，一个函数的输入为另一个函数的输出。

```javascript
const compose = (f, g) => (a) => f(g(a))    // 定义
const floorAndToString = compose((val) => val.toString(), Math.floor) // 使用
floorAndToString(12.12)   // '12'
```

下面从相关的术语开始介绍.

### 1.范畴 (Category)

在范畴论中，范畴是指对象集合及它们之间的态射 (morphism)。在编程中，数据类型作为对象，函数作为态射。

一个有效的范畴遵从以下三个原则：

1. 必有一个 identity 态射，使得 map 一个对象是它自身。`a` 是范畴里的一个对象时，必有一个函数使 `a -> a`。
2. 态射必是可组合的。`a`，`b`，`c` 是范畴里的对象，`f` 是态射 `a -> b`，`g` 是 `b -> c` 态射。`g(f(x))` 一定与 `(g ● f)(x)` 是等价的。
3. 组合满足结合律。`f ● (g ● h)` 与 `(f ● g) ● h` 是等价的。

由于组合的结合律,我们一连串函数的组合,就可以像积木一样任意拆分了,具有很大的灵活性.

下面是一个典型的例子

```javascript
var loudLastUpper = compose(exclaim, toUpperCase, head, reverse);

// 或
var last = compose(head, reverse);
var loudLastUpper = compose(exclaim, toUpperCase, last);

// 或
var last = compose(head, reverse);
var angry = compose(exclaim, toUpperCase);
var loudLastUpper = compose(angry, last);

// 更多变种...
```

#### 态射 (Morphism)

一个变形的函数。

**自同态 (Endomorphism)**

输入输出是相同类型的函数。

```js
// uppercase :: String -> String
const uppercase = (str) => str.toUpperCase()

// decrement :: Number -> Number
const decrement = (x) => x - 1
```



**同构 (Isomorphism)**

不用类型对象的变形，保持结构并且不丢失数据。

例如，一个二维坐标既可以表示为数组 `[2, 3]`，也可以表示为对象 `{x: 2, y: 3}`。

```js
// 提供函数在两种类型间互相转换
const pairToCoords = (pair) => ({x: pair[0], y: pair[1]})

const coordsToPair = (coords) => [coords.x, coords.y]

coordsToPair(pairToCoords([1, 2])) // [1, 2]

pairToCoords(coordsToPair({x: 1, y: 2})) // {x: 1, y: 2}
```



### 2.identity态射

让我们介绍一个名为 `id` 的实用函数。这个函数接受随便什么输入然后原封不动地返回它：

```javascript
var id = function(x){ return x; };
```

有下面的例子

```javascript
// identity
compose(id, f) == compose(f, id) == f;
// true
```

因为id函数返回传入的参数的特性,相当于它就什么都没做,有他没他一个样,所以就有了上面的等式.

id函数就相当于乘法运算里的1,加法运算里的0.同时compose和这两种运算一样都是满足结合律的.

下面我们要实现的compose函数,当你不传入参数进行调用时,就是返回一个id函数



### 3.Point-Free 风格 (Point-Free Style)

定义函数时，不显式地指出函数所带参数。这种风格通常需要柯里化或者高阶函数。也叫 Tacit programming。

```javascript
const map = (fn) => (list) => list.map(fn)
const add = (a) => (b) => a + b

# Points-Free   list 是显式参数
const incrementAll = (numbers) => map(add(1))(numbers)

# Points-Free   list 是隐式参数
const incrementAll2 = map(add(1))
```

`incrementAll` 识别并且使用了 `numbers` 参数，因此它不是 Point-Free 风格的。 `incrementAll2` 连接函数与值，并不提及它所使用的参数，因为它是 Point-Free 风格的。

Point-Free 风格的函数就像平常的赋值，不使用 `function` 或者 `=>`。

point free最明显的好处是,能够帮助我们减少不必要的命名，让代码保持简洁和通用。毕竟现在的ide都很智能了,如果我们要看函数的参数,直接光标移到函数上就能显示出来了,没必要特意写出参数,这样代码会更简洁.

### 4.typescript实现接收任意个函数参数的compose函数

我们只需要接收任意个函数参数,然后用reduce循环套娃就可以了.

```typescript
/**
 * 组合任意多个函数
 * @param funcs 被组合的函数
 * @returns 返回组合后的函数
 */

function compose(...funcs: ((...args: any) => any)[]) {
  if (funcs.length === 0) {
    //   compose不传入参数的情况,返回一个返回输入的函数,也就是id函数
    return (x: any) => x
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce(function (
    a: (...args: any) => any,
    b: (...args: any) => any
  ): (...args: any) => any {
    return (...args: any) => {
      return a(b(...args))
    }
  })
}
export default compose

```

下面是编译成es6后的代码

```javascript
"use strict";
/**
 * 组合任意多个函数
 * @param funcs 被组合的函数
 * @returns 返回组合后的函数
 */
function compose(...funcs) {
    if (funcs.length === 0) {
        //   compose不传入参数的情况,返回一个返回输入的函数,也就是id函数
        return (x) => x;
    }
    if (funcs.length === 1) {
        return funcs[0];
    }
    return funcs.reduce(function (a, b) {
        return (...args) => {
            return a(b(...args));
        };
    });
}
```

### 5.使用jest测试组合函数

```typescript
import compose from '../../fp-lib/compose'

test('normal compose', () => {
  const add = (x) => x + 1
  expect(compose(add, add, add, add, add)(0)).toBe(5)

  // 测试0个参数时
  expect(compose()(add)).toBe(add)
  // 测试1个参数时
  expect(compose(add)).toBe(add)
})
```

### 6.组合中的debug

组合就类似于shell中的管道,因此比较常见的debug方法就是把在管道的某处把数据打印出来查看.

我们可以实现一个trace函数来进行debug.

下面是typescript中的一个具体的实现,

这样我们在组合中加入这个函数,可以查看某处的数据,并且不会影响后续的数据流

```typescript
import curry from './curry'

const trace = curry(function (tag: string, x: any): any {
  console.log(tag, x)
  return x
})

export default trace
```

## 04.类型签名(Type Signatures)

虽然typescript也有类型,但是当你用compose把函数串联起来的最终函数,是显示不出中间的路径的.

所以我们要给自己的代码添加类型注释,以便让自己以后还能看懂自己的代码.



这次我们介绍的是一种比较通用的类型注释系统 Hindley-Milner函数签名 .

下面是一些常见函数类型的写法,一个箭头表示一次传参.

```js
//  capitalize :: String -> String
var capitalize = function(s){
  return toUpperCase(head(s)) + toLowerCase(tail(s));
}

capitalize("smurf");
//=> "Smurf"
```

```js
//  strLength :: String -> Number
var strLength = function(s){
  return s.length;
}

//  join :: String -> [String] -> String
var join = curry(function(what, xs){
  return xs.join(what);
});

//  match :: Regex -> String -> [String]
var match = curry(function(reg, s){
  return s.match(reg);
});

//  replace :: Regex -> String -> String -> String
var replace = curry(function(reg, sub, s){
  return s.replace(reg, sub);
});

// 下面的a,b属于任意类型
//  id :: a -> a
var id = function(x){ return x; }

//  map :: (a -> b) -> [a] -> [b]
var map = curry(function(f, xs){
  return xs.map(f);
});
//  head :: [a] -> a
var head = function(xs){ return xs[0]; }

//  filter :: (a -> Bool) -> [a] -> [a]
var filter = curry(function(f, xs){
  return xs.filter(f);
});

//  reduce :: (b -> a -> b) -> b -> [a] -> b
var reduce = curry(function(f, x, xs){
  return xs.reduce(f, x);
});
```

### 自由定理（free theorems）

类型签名除了能够帮助我们推断函数可能的实现，还能够给我们带来*自由定理*（free theorems）

下面是两个例子

```js
// head :: [a] -> a
compose(f, head) == compose(head, map(f));

// filter :: (a -> Bool) -> [a] -> [a]
compose(map(f), filter(compose(p, f))) == compose(filter(p), map(f));
```

这些等式是直接根据类型可以推断出来的

第一个例子中，等式左边说的是，先获取数组的`头部`，然后对它调用函数 `f`；等式右边说的是，先对数组中的每一个元素调用 `f`，然后再取其返回结果的`头部`。这两个表达式的作用是相等的，但是前者要快得多。

第二个例子 `filter` 也是一样。等式左边是说，先组合 `f` 和 `p` 检查哪些元素要过滤掉，然后再通过 `map` 实际调用 `f`（别忘了 `filter` 是不会改变数组中元素的，这就保证了 `a` 将保持不变）；等式右边是说，先用 `map` 调用 `f`，然后再根据 `p` 过滤元素。这两者也是相等的。

### 类型约束（type constraints）

签名也可以把类型约束为一个特定的接口

```js
// sort :: Ord a => [a] -> [a]
```

比如上面的注释表明 a变量是一个Ord对象.



## 05.函子 (Functor)

一个实现了map 函数的对象，map 会遍历对象中的每个值并生成一个新的对象。遵守两个准则

**一致性 (Preserves identity)**

```js
object.map(x => x) ≍ object
```

**组合性 (Composable)**

```js
object.map(compose(f, g)) ≍ object.map(g).map(f)  // f, g 为任意函数
```

在 javascript 中一个常见的函子是 Array, 因为它遵守因子的两个准则。

```js
const f = x => x + 1
const g = x => x * 2

;[1, 2, 3].map(x => f(g(x)))
;[1, 2, 3].map(g).map(f)
```

**Pointed Functor**

一个实现了 of 函数的对象。

ES2015 添加了 `Array.of`，使 Array 成为了 Pointed Functor。

```
Array.of(1)
```

下面我们从关于functor开始介绍

### 1.容器（container）

下面我们封装一个能装载任意类型值的容器.

容器是一个对象,使用of作为构造器(Pointed Functor),因为对象默认的new关键字在函数式编程里还是太别扭了.

使用typescript的实现如下

其中我们把of作为一个static方法,这样就可以直接通过类名调用了,相当于一个简单工厂函数.

```typescript
class Container {
  private value: any
  constructor(value: any) {
    this.value = value
  }

  static of(value: any) {
    return new Container(value)
  }
}
```

下面我们可以试试这个容器

```javascript
> Container.of(3)
Container { value: 3 }
> Container.of('hotdogs')
Container { value: 'hotdogs' }
> Container.of(Container.of({ name: 'yoda' }))
Container { value: Container { value: { name: 'yoda' } } }
```



- `Container` 是个只有一个属性的对象。尽管容器可以有不止一个的属性，但大多数容器还是只有一个。
- `value` 不能是某个特定的类型，不然 `Container` 就对不起它这个名字了。
- 数据一旦存放到 `Container`，就会一直待在那儿。我们*可以*用 `.value` 获取到数据，但这样做有悖初衷,所以这里使用了private关键字防止外部访问.

### 2.map函数

容器有了值以后,我们还需要一个让别的函数能够操作它的方法.

我们可以定义一个map方法,类似于数组的map.

只不过这个map和数组map的区别是,这个map的参数是容器,作用是把容器里的值交给你定义好的函数处理.

下面是这个map方法的实现

```typescript
// (a -> b) -> Container a -> Container b
map(f: (...args: any) => any):any {
      return Container.of(f(this.value))
  }
```



```js
Container.of(2).map(function(two){ return two + 2 })
//=> Container(4)


Container.of("flamethrowers").map(function(s){ return s.toUpperCase() })
//=> Container("FLAMETHROWERS")


Container.of("bombs").map(concat(' away')).map(_.prop('length'))
//=> Container(10)
```

这个map方法使得我们可以直接处理容器,而不用把容器中的值拿出来这一步.而且map函数执行完后,容器内的值并不会变化,保持了不变性.

因为map的返回值是container,所以只要我们在map调用后再返回容器,就可以无限地用map链式调用下去...



### 3.Maybe  一种带空值检查的functor

Container类似于Identity函数,会返回传入的值.

过于单纯了,其实我们还可以添加对传入值的处理,比如检查传入的值是否为空

下面是代码实现

```typescript
/**
 * Maybe 容器类，
 * 实现了map函数，并且map执行之前有空值检查
 */
class Maybe {
  private value: any
  constructor(value: any) {
    this.value = value
  }
  static of(value: any) {
    return new Maybe(value)
  }
  isNothing() {
    return this.value === null || this.value === undefined
  }
  map(f: (...args: any) => any) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.value))
  }
}
export default Maybe
```

使用这个Maybe容器的好处是,出现null的时候就不会报错了,因为每次执行之前都有空值检查,如果有一次是null,后续的map无论执行多少次都是null.



### 4.更通用的map

我们使用柯里化,可以定义一个map可以应用到所有functor上面.这样我们就能像处理普通函数的参数一样处理functor了.

```js
//  map :: Functor f => (a -> b) -> f a -> f b
var map = curry(function(f, any_functor_at_all) {
  return any_functor_at_all.map(f);
});
```

### 5.Maybe使用场景

`Maybe` 最常用在那些可能会无法成功返回结果的函数中。

```js
//  safeHead :: [a] -> Maybe(a)
var safeHead = function(xs) {
  return Maybe.of(xs[0]);
};

var streetName = compose(map(_.prop('street')), safeHead, _.prop('addresses'));

streetName({addresses: []});
// Maybe(null)

streetName({addresses: [{street: "Shady Ln.", number: 4201}]});
// Maybe("Shady Ln.")
```

有时候函数可以明确返回一个 `Maybe(null)` 来表明失败

### 6.纯错误处理

`throw/catch`并非纯错误处理,因为他们抛出错误的时候,函数不会收到返回值.

下面我们用一种更友好的方式来进行处理.

下面是使用Either进行错误处理的实现,其中Left和Right是Either的子类.

Left调用map只会返回自身,所以我们在出错的时候返回Left最后错误的结果就会传递到末尾.

```typescript
class Left {
  private value: any
  constructor(value: any) {
    this.value = value
  }
  static of(value: any) {
    return new Left(value)
  }
  map(f: (...args: any) => any): Left {
    return this
  }
}
class Right {
  private value: any
  constructor(value: any) {
    this.value = value
  }
  static of(value: any) {
    return new Right(value)
  }
  map(f: (...args: any) => any): Right {
    return Right.of(f(this.value))
  }
}

```

下面是具体的使用例子

```javascript
var moment = require('moment');

//  getAge :: Date -> User -> Either(String, Number)
var getAge = curry(function(now, user) {
  var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
  if(!birthdate.isValid()) return Left.of("Birth date could not be parsed");
  return Right.of(now.diff(birthdate, 'years'));
});

getAge(moment(), {birthdate: '2005-12-12'});
// Right(9)

getAge(moment(), {birthdate: 'balloons!'});
// Left("Birth date could not be parsed")
```

我们也可以使用柯里化,把either变成一个用于错误处理的函数

```js
//  either :: (a -> c) -> (b -> c) -> Either a b -> c
var either = curry(function(f, g, e) {
  switch(e.constructor) {
    case Left: return f(e.__value);
    case Right: return g(e.__value);
  }
});

//  zoltar :: User -> _
// 这里的id函数仅仅用于传递值给log
var zoltar = compose(console.log, either(id, fortune), getAge(moment()));

zoltar({birthdate: '2005-12-12'});
// "If you survive, you will be 10"
// undefined

zoltar({birthdate: 'balloons!'});
// "Birth date could not be parsed"
// undefined
```

### 7.副作用处理

## Lift

lifting指的是你取一个值把他放到对象中,比如说一个functor.如果你把一个函数lift到

Lifting is when you take a value and put it into an object like a [functor](https://github.com/hemanth/functional-programming-jargon#pointed-functor). If you lift a function into an [Applicative Functor](https://github.com/hemanth/functional-programming-jargon#applicative-functor) then you can make it work on values that are also in that functor.

Some implementations have a function called `lift`, or `liftA2` to make it easier to run functions on functors.

```
const liftA2 = (f) => (a, b) => a.map(f).ap(b) // note it's `ap` and not `map`.

const mult = a => b => a * b

const liftedMult = liftA2(mult) // this function now works on functors like array

liftedMult([1, 2], [3]) // [3, 6]
liftA2(a => b => a + b)([1, 2], [3, 4]) // [4, 5, 5, 6]
```

Lifting a one-argument function and applying it does the same thing as `map`.

```
const increment = (x) => x + 1

lift(increment)([2]) // [3]
;[2].map(increment) // [3]
```

