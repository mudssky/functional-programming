import compose from './compose'
class IO {
  fn: (...args: any) => any
  constructor(fn: (...args: any) => any) {
    this.fn = fn
  }
  static of(x: any) {
    return new IO(function () {
      return x
    })
  }
  map(f: (...args: any) => any) {
    return new IO(compose(f, this.fn))
  }
}
