import uu from '../lib/index'

test('map', () => {
  const testFn = (x: number) => x * x
  const input = [1, 2, 3]
  const expected = [1, 4, 9]
  expect(uu.map(input, testFn))
})
