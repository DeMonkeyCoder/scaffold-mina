import { expect, test } from 'vitest'
import { anvilSepolia } from '../../../test/src/anvil'
import { optimismSepolia } from '../../op-stack/chains'
import { getGames } from './getGames'
import { waitForNextGame } from './waitForNextGame'

const sepoliaClient = anvilSepolia.getClient()

const games = await getGames(sepoliaClient, {
  limit: 10,
  targetChain: optimismSepolia,
})
const [defaultGame] = games

test('default', async () => {
  const game = await waitForNextGame(sepoliaClient, {
    limit: 10,
    l2BlockNumber: defaultGame.l2BlockNumber - 10n,
    targetChain: optimismSepolia,
  })
  expect(game).toHaveProperty('l2BlockNumber')
  expect(game).toHaveProperty('index')
  expect(game).toHaveProperty('metadata')
  expect(game).toHaveProperty('timestamp')
  expect(game).toHaveProperty('rootClaim')
  expect(game).toHaveProperty('extraData')
}, 20_000)
