/**
 * 返回柯里化后的函数，支持用占位符改变参数的传递顺序，
 * 默认的占位符是curry函数本身
 *
 * @param fn 柯里化的原函数
 * @param length 需要的参数个数，默认为函数的形参个数
 * @param placeHolder 占位符，默认当前柯里化函数
 * @returns 柯里化后的函数
 */
function curry(
  fn: (...args: any) => any,
  length: number = fn.length,
  placeHolder: any = curry
) {
  return _curry(fn, length, placeHolder, [], [])
}
/**
 * 递归调用实现柯里化的中间函数
 * @param fn 柯里化的原函数
 * @param length 原函数需要的参数个数
 * @param placeHolder 接收的占位符
 * @param argsCopy 已接收的参数列表
 * @param holdersCopy 已接收的占位符位置列表
 * @returns 柯里化后的函数,或是递归调用收集参数的函数
 */
function _curry(
  fn: (...args: any) => any,
  length: number = fn.length,
  placeHolder: any,
  args: any[],
  holders: number[]
) {
  return function (..._args: any) {
    //   两个参数列表是引用类型，复制一份后再操作，防止函数重复调用操作初始值地址把初始值搞乱影响结果
    let argsCopy = args.slice()
    let holdersCopy = holders.slice()

    _args.forEach((value: any, index: number) => {
      if (argsCopy.length < length) {
        //   如果新增参数中包含占位符，除了加入args列表，还要再在holders里面添加位置索引
        if (value === placeHolder) {
          // 占位符的位置就是当前参数数组末尾
          holdersCopy.push(argsCopy.length)
          argsCopy.push(placeHolder)
        } else {
          // 如果是普通参数，直接加入args现存参数列表
          argsCopy.push(value)
        }
      }
      // 参数列表等于函数形参个数，此时占位符全部忽略,开始清理占位符，替换占位符为新增参数
      else {
        if (value !== placeHolder && holdersCopy.length > 0) {
          const holdIdx = holdersCopy[0]
          holdersCopy.shift()
          argsCopy[holdIdx] = value
        }
      }
    })
    //现存参数等于形参，并且占位符全部替换完成,说明参数收集完成=
    if (argsCopy.length >= length && holdersCopy.length <= 0) {
      return fn(...argsCopy)
    } else {
      // 参数没有收集齐，则进入下一轮收集
      return _curry(fn, length, placeHolder, argsCopy, holdersCopy)
    }
  }
}

export default curry
// let _ = {}
// let fn = function (a: any, b: any, c: any, d: any, e: any) {
//   console.log([a, b, c, d, e])
// }
// const _fn = curry(fn)

// _fn(1, 2, 3, 4, 5) // print: 1,2,3,4,5
// _fn(_, 2, 3, 4, 5)(1) // print: 1,2,3,4,5
// _fn(1, _, 3, 4, 5)(2) // print: 1,2,3,4,5

// _fn(1, curry, 3)(curry, 4, curry)(2)(5)
// _fn(1, _, _, 4)(_, 3)(2)(5)
// _fn(_, 2)(_, _, 4)(1)(3)(5)
