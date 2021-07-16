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
