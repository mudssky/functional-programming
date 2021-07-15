import curry from '../../fp-lib/curry'

test('normal curry test', () => {
  const testFn = (a, b, c, d, e) => {
    return [a, b, c, d, e]
  }
  const input = [1, 2, 3, 4, 5]
  const expected = [1, 2, 3, 4, 5]
  const curriedFn = curry(testFn)
  expect(curriedFn(1)(2)(3)(4)(5)).toEqual(expected)
  expect(curriedFn(1)(2, 3)(4)(5)).toEqual(expected)
  expect(curriedFn(1)(2, 3)(4, 5)).toEqual(expected)
  expect(curriedFn(...input)).toEqual(expected)
})

test('curry placeholder', () => {
  const testFn = (a, b, c, d, e) => {
    return [a, b, c, d, e]
  }
  const input = [1, 2, 3, 4, 5]
  const expected = [1, 2, 3, 4, 5]
  const curriedFn = curry(testFn)
  // 默认占位符是curry函数本身
  expect(curriedFn(1)(curry)(3)(4)(5)(2)).toEqual(expected)
  expect(curriedFn(1)(curry, 3)(4)(5)(2)).toEqual(expected)
  expect(curriedFn(1)(2, 3)(curry, curry)(4)(5)).toEqual(expected)
})
