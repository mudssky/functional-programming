/**
 * 容器类，实现了map方法
 */
class Container {
  private value: any
  constructor(value: any) {
    this.value = value
  }

  static of(value: any) {
    return new Container(value)
  }

  map(f: (...args: any) => any) {
    return Container.of(f(this.value))
  }
  ap(other_container: Container) {
    return other_container.map(this.value)
  }
}

export default Container
