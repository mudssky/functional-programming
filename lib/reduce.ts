/**
 *
 * @param category Array
 * @param array 遍历用的数组
 * @param iteratee 遍历执行的函数
 * @param accumulater 累加值
 * @returns 返回值是最终的累加值
 */
function arrayReduce<T>(
  array: Array<T>,
  iteratee: (arg0: T | undefined, arg1: T, arg2: number, arg3: T[]) => T,
  accumulater?: T
): T | undefined {
  let index = -1
  let length = array == null ? 0 : array.length
  // 如果不存在累加值就用第一个元素作为初始累加值
  if (!accumulater && length > 0) {
    accumulater = array[++index]
  }

  // 从第二个元素开始遍历
  while (++index < length) {
    accumulater = iteratee(accumulater, array[index], index, array)
  }
  return accumulater
}

export default arrayReduce
