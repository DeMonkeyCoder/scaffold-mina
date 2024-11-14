import { expectTypeOf, test } from 'vitest'

import { useToken } from './useToken'

test('select data', () => {
  const result = useToken({
    query: {
      select(data) {
        return data?.name
      },
    },
  })
  expectTypeOf(result.data).toEqualTypeOf<string | undefined>()
})
