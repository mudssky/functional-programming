import compose from '../../fp-lib/compose'

test('normal compose', () => {
  const add = (x) => x + 1
  expect(compose(add, add, add, add, add)(0)).toBe(5)

  // 测试0个参数时
  expect(compose()(add)).toBe(add)
  // 测试1个参数时
  expect(compose(add)).toBe(add)
})
