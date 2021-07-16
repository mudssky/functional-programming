import curry from './curry'
/**
 * 用于debug ,compose的函数
 */
const trace = curry(function (tag: string, x: any): any {
  console.log(tag, x)
  return x
})

export default trace
