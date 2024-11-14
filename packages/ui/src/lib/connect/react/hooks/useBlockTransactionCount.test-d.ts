import { expectTypeOf, test } from 'vitest'

import { useBlockTransactionCount } from './useBlockTransactionCount'

test('select data', () => {
  const result = useBlockTransactionCount({
    query: {
      select(data) {
        return data
      },
    },
  })
  expectTypeOf(result.data).toEqualTypeOf<number | undefined>()
})
