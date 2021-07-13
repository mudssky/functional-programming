import map from '../lib/map'

test('map', () => {
  const testFn = (x: number) => x * x
  const input = [1, 2, 3]
  const expected = [1, 4, 9]
  expect(map(input, testFn)).toEqual(expected)
})
test('null', () => {
  const testFn = (x: number) => x * x
  const input = null
  const expected = []
  expect(map(input, testFn)).toEqual(expected)
})
