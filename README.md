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

## 02.柯里化

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

