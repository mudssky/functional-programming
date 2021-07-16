/**
 * 组合任意多个函数
 * @param funcs 被组合的函数
 * @returns 返回组合后的函数
 */

function compose(...funcs: ((...args: any) => any)[]) {
  if (funcs.length === 0) {
    //   compose不传入参数的情况,返回一个返回输入的函数,也就是id函数
    return (x: any) => x
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce(function (
    a: (...args: any) => any,
    b: (...args: any) => any
  ): (...args: any) => any {
    return (...args: any) => {
      return a(b(...args))
    }
  })
}
export default compose
