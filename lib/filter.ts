/**
 *
 * @param array 需要过滤的数组
 * @param predicate 对数组的每个值进行判断
 * @returns 返回筛选后的数组
 */
function filter<T>(
  array: Array<T>,
  predicate: (arg0: T, arg1: number, arg2: T[]) => boolean
): Array<T> {
  let index = -1
  let resIndex = 0
  const length = array == null ? 0 : array.length
  const result = []
  while (++index < length) {
    const value = array[index]
    if (predicate(value, index, array)) {
      // 数组length处赋值相当于push的效果
      result[resIndex++] = value
    }
  }
  return result
}
export default filter
