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

