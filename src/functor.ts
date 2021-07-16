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
}

Container.of(2)
  .map((x: any) => {
    console.log(x)
    return x
  })
  .map((x: any) => {
    console.log(x)
  })
// console.log(Array.of(1, 2, 3, 4))
// Container.of(3)
// Container.of('hotdogs')
// Container.of(Container.of({ name: 'yoda' }))
