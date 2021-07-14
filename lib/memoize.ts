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
): any {
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
}
import funcTimelog from './funcTimelog'
function factorial(n: number): number {
  if (n == 1) {
    return n
  }
  return n * factorial(n - 1)
}

const facT = funcTimelog(factorial)
const memof = memoize(factorial)
// const fact2 = funcTimelog(memof)

facT(10)
console.log(memof(10))
// fact2(10)
export default memoize
