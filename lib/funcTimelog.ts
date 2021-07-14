/**
 * 传入一个函数,使得函数执行完会log执行时间
 * @param func 需要计算执行时间的函数
 * @returns
 */
function funcTimelog(func: (...args: any) => any) {
  return function (...args: any) {
    console.time(func.name)
    const result = func(args)
    console.timeEnd(func.name)
    return result
  }
}

export default funcTimelog
