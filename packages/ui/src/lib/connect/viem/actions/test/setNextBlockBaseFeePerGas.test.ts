import { expect, test } from 'vitest'

import { parseGwei } from '../../utils/unit/parseGwei'

import { getBlock } from '../public/getBlock'

import { anvilMainnet } from '../../../test/src/anvil'

import { mine } from './mine'
import { setNextBlockBaseFeePerGas } from './setNextBlockBaseFeePerGas'

const client = anvilMainnet.getClient()

test('set next block base fee per gas', async () => {
  const block1 = await getBlock(client, {
    blockTag: 'latest',
  })
  await expect(
    setNextBlockBaseFeePerGas(client, {
      baseFeePerGas: block1.baseFeePerGas! + parseGwei('10'),
    }),
  ).resolves.toBeUndefined()

  await mine(client, { blocks: 1 })

  const block2 = await getBlock(client, { blockTag: 'latest' })
  expect(block2.baseFeePerGas).toEqual(block1.baseFeePerGas! + parseGwei('10'))
  await setNextBlockBaseFeePerGas(client, {
    baseFeePerGas: block1.baseFeePerGas!,
  })
})
