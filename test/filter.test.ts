import filter from '../lib/filter'
test('normal test', () => {
  const testFn = (x) => x % 2 === 0
  const inputArr = [1, 2, 3, 4, 5, 6]
  const expected = [2, 4, 6]
  expect(filter(inputArr, testFn)).toEqual(expected)
})
