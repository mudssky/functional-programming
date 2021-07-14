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
- 可缓存性
- 可移植性,自文档化
- 可测试性
- 合理性,引用透明性

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

