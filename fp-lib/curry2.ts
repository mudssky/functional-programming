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
// const add = (x: number, y: number) => x + y
// const addc = curry2(add)

// console.log(addc() === addc)
// console.log(addc(2))

// const add2 = addc(1)
// console.log(add2(5))
