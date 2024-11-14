import { expect, test } from 'vitest'

import { deepEqual } from './deepEqual.js'

test('compares primitive values', () => {
  expect(deepEqual(true, true)).toBe(true)
  expect(deepEqual(true, false)).toBe(false)

  expect(deepEqual(1, 1)).toBe(true)
  expect(deepEqual(1, 2)).toBe(false)

  expect(deepEqual('zustand', 'zustand')).toBe(true)
  expect(deepEqual('zustand', 'redux')).toBe(false)
})

test('compares objects', () => {
  expect(deepEqual({ foo: 'bar', asd: 123 }, { foo: 'bar', asd: 123 })).toBe(
    true,
  )

  expect(
    deepEqual({ foo: 'bar', asd: 123 }, { foo: 'bar', foobar: true }),
  ).toBe(false)

  expect(
    deepEqual({ foo: 'bar', asd: 123 }, { foo: 'bar', asd: 123, foobar: true }),
  ).toBe(false)
})

test('compares arrays', () => {
  expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true)

  expect(deepEqual([1, 2, 3], [2, 3, 4])).toBe(false)

  expect(
    deepEqual([{ foo: 'bar' }, { asd: 123 }], [{ foo: 'bar' }, { asd: 123 }]),
  ).toBe(true)

  expect(deepEqual([{ foo: 'bar' }], [{ foo: 'bar', asd: 123 }])).toBe(false)
})
