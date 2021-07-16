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
