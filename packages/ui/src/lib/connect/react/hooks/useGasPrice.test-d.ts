import { expectTypeOf, test } from 'vitest'

import { useGasPrice } from './useGasPrice.js'

test('select data', () => {
  const result = useGasPrice({
    query: {
      select(data) {
        return data?.toString()
      },
    },
  })
  expectTypeOf(result.data).toEqualTypeOf<string | undefined>()
})
