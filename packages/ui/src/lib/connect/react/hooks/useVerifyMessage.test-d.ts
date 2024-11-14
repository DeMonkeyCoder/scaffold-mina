import { expectTypeOf, test } from 'vitest'

import { useVerifyMessage } from './useVerifyMessage'

test('select data', () => {
  const result = useVerifyMessage({
    query: {
      select(data) {
        return data
      },
    },
  })
  expectTypeOf(result.data).toEqualTypeOf<boolean | undefined>()
})
