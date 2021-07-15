// /**
//  *
//  * @param fn  需要柯里化的函数
//  * @param length 柯里化的参数个数，默认值为传入函数的参数个数
//  * @returns 返回柯里化后的函数，可以传入任意小于原函数参数个数的参数，参数全部传递完成就会返回执行结果
//  */
// function curryN(fn: (...args: any) => any, length: number = fn.length) {
//   return _curry(fn, length)
// }

// function _curry(fn: (...args: any) => any, length: number, ...args: any) {
//   // args 是已经收集到的数据，函数第一次执行时不传入相当于0
//   // param用来收集这次传入的参数
//   // _args则是把两者拼起来，累计已经收集到的数据
//   return function (...params: any) {
//     //   收集所有输入的参数
//     let _args = [...args, ...params]
//     // 如果收集参数的个数达到最初得到的函数参数总个数,直接传入收集到的所有参数并返回执行结果
//     if (_args.length >= length) {
//       return fn(..._args)
//     } else {
//       // 如果收集的参数未达到目标,继续收集参数
//       return _curry(fn, length, ..._args)
//     }
//   }
// }

// // function curryN(
// // 	fn: (...args: any) => any,

// // ) {

// // }

// const add = (a: any, b: any) => {
//   return a + b
// }

// const addc = curryN(add)
// console.log(addc(1))

function logards(...args: any) {
  console.log(args)
}

logards()
