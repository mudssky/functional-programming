import reduceArray from '../lib/reduce'
test('normal test', () => {
  const testFn = (x, y) => x + y
  const inputArr = [1, 2, 3]
  const expected = 6
  expect(reduceArray(inputArr, testFn)).toEqual(expected)
})
test('null', () => {
  const testFn = (x, y) => x + y
  const inputArr = null
  const expected = undefined
  expect(reduceArray(inputArr, testFn)).toBeFalsy()
})
