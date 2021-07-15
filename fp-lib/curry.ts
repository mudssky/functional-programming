/**
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
 *
 * @param fn 柯里化的原函数
 * @param length 原函数需要的参数个数
 * @param placeHolder 接收的占位符
 * @param argsCopy 已接收的参数列表
 * @param holdersCopy 已接收的占位符位置列表
 */
function _curry(
  fn: (...args: any) => any,
  length: number = fn.length,
  placeHolder: any,
  args: any[],
  holders: number[]
) {
  return function (..._args: any) {
    // console.log(`_args:${_args}`)
    // console.log(`args:${args}`)
    //   复制一份，不能作为
    let argsCopy = args.slice()
    let holdersCopy = holders.slice()
    _args.forEach((value: any, index: number) => {
      if (argsCopy.length < length) {
        //   如果新增参数中包含占位符，除了加入args列表，还要再在holders里面添加记录位置
        if (value === placeHolder) {
          // 占位符的位置就是当前参数数组末尾
          holdersCopy.push(argsCopy.length)
          argsCopy.push(placeHolder)
        } else {
          // 如果是普通参数，直接加入args现存参数列表
          argsCopy.push(value)
        }
        // console.log('<length')
      }
      //   参数列表等于函数形参个数，此时占位符全部忽略,开始清理占位符，并且替换占位符为新增参数
      else {
        if (value !== placeHolder && holdersCopy.length > 0) {
          const holdIdx = holdersCopy[0]
          holdersCopy.shift()
          argsCopy[holdIdx] = value
        }
      }
    })
    //现存参数等于形参，并且占位符全部替换完成
    if (argsCopy.length >= length && holdersCopy.length <= 0) {
      return fn(...argsCopy)
    } else {
      // 参数没有收集齐，则进入下一轮收集
      return _curry(fn, length, placeHolder, argsCopy, holdersCopy)
    }
    // if (!_args) {
    //   //   如果
    // }
    // //   当前收集到的所有参数
    // const allArgs = [...args, ..._args]
    //   包含占位符的参数个数,不会超过形参个数，因为后续的操作是替换占位符，不会增加列表长度
    // let argCount = args.length

    //   当收集到占位符和普通参数的总和大于等于函数形参数目时开始处理,此时以后占位符holders列表不会再增加了，
    //   因为这个表只存储要替换的占位符的位置
    //     if (allArgs.length >= length) {
    //       //   当前收集到的有效参数
    //       const allArgsNoHolders = allArgs.filter((x: any) => {
    //         return x !== placeHolder
    //       })
    //       if (allArgsNoHolders.length === length) {
    //         return fn(...allArgsNoHolders)
    //       } else if (allArgsNoHolders.length < length) {
    //         //   遍历新增的参数,如果_args是0个参数也不影响遍历
    //         _args.forEach(function (value: any, index: number) {
    //           // 新增参数包含占位符的情况,在占位符+有效字符等于形参个数后不进行增加
    //           if (value === placeHolder) {
    //             if (args.length < length) {
    //               holders.push(index)
    //               //   用占位符占位
    //               args.push(placeHolder)
    //             }
    //             //   不是占位符的情况
    //           } else {
    //             if (args.length < length) {
    //               args.push(value)
    //               // 此时开始替换占位符
    //             } else {
    //               if (holders.length > 0) {
    //                 const holdIdx = holders[0]
    //                 holders.shift() //删除首个占位符
    //                 args[holdIdx] = value
    // 			  } else {

    //               }
    //             }
    //           }
    //         })
    //       }
    //     }
  }
}
let _ = {}
let fn = function (a: any, b: any, c: any, d: any, e: any) {
  console.log([a, b, c, d, e])
}
const _fn = curry(fn, 5, _)

_fn(1, 2, 3, 4, 5) // print: 1,2,3,4,5
_fn(_, 2, 3, 4, 5)(1) // print: 1,2,3,4,5
_fn(1, _, 3, 4, 5)(2) // print: 1,2,3,4,5
_fn(1, _, 3)(_, 4, _)(2)(5) // print: 1,2,3,4,5
_fn(1, _, _, 4)(_, 3)(2)(5) // print: 1,2,3,4,5
_fn(_, 2)(_, _, 4)(1)(3)(5) // print: 1,2,3,4,5
