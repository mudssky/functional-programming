import compose from './compose'
class IO {
  // 保存函数的容器
  __fn: (...args: any) => any

  constructor(fn: (...args: any) => any) {
    this.__fn = fn
  }

  static of(x: any) {
    return new IO(function () {
      return x
    })
  }

  map(f: (...args: any) => any) {
    return new IO(compose(f, this.__fn)).join()
  }
  join() {
    return this.__fn
  }
}

function printll() {
  // console.log('ll')
  return 'hello'
}
const io1 = IO.of(printll)
// console.log(io1)
// io1.fn()()
const io2 = io1.map(function (x) {
  return x
})
console.log(io2()())
