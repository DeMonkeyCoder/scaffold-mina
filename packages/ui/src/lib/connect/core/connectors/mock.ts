import {
  type Address,
  type Hex,
  type JSAPIStandardRequestFn,
  RpcRequestError,
  SwitchChainError,
  type Transport,
  UserRejectedRequestError,
  type WalletCallReceipt,
  type WalletRpcSchema,
  custom,
  getAddress,
} from 'vimina'
import { rpc } from 'vimina/utils'

import {
  ChainNotConfiguredError,
  ConnectorNotConnectedError,
} from '../errors/config'
import { createConnector } from './createConnector'

export type MockParameters = {
  accounts: readonly [Address, ...Address[]]
  features?:
    | {
        connectError?: boolean | Error | undefined
        switchChainError?: boolean | Error | undefined
        signMessageError?: boolean | Error | undefined
        signTypedDataError?: boolean | Error | undefined
        reconnect?: boolean | undefined
        watchAssetError?: boolean | Error | undefined
      }
    | undefined
}

mock.type = 'mock' as const

export function mock(parameters: MockParameters) {
  const transactionCache = new Map<string, string[]>()
  const features = parameters.features ?? {}

  type Provider = ReturnType<
    Transport<'custom', unknown, JSAPIStandardRequestFn<WalletRpcSchema>>
  >
  let connected = false
  let connectedNetworkId: string

  return createConnector<Provider>((config) => ({
    id: 'mock',
    name: 'Mock Connector',
    type: mock.type,
    async setup() {
      connectedNetworkId = config.chains[0].id
    },
    async connect({ networkId } = {}) {
      if (features.connectError) {
        if (typeof features.connectError === 'boolean')
          throw new UserRejectedRequestError(new Error('Failed to connect.'))
        throw features.connectError
      }

      const provider = await this.getProvider()
      const accounts = await provider.request({
        method: 'mina_requestAccounts',
      })

      let currentNetworkId = await this.getNetworkId()
      if (networkId && currentNetworkId !== networkId) {
        const chain = await this.switchChain!({ networkId })
        currentNetworkId = chain.id
      }

      connected = true

      return {
        accounts: accounts.map((x) => getAddress(x)),
        networkId: currentNetworkId,
      }
    },
    async disconnect() {
      connected = false
    },
    async getAccounts() {
      if (!connected) throw new ConnectorNotConnectedError()
      const provider = await this.getProvider()
      const accounts = await provider.request({ method: 'mina_accounts' })
      return accounts.map((x) => getAddress(x))
    },
    async getNetworkId() {
      const provider = await this.getProvider()
      return provider.request({ method: 'mina_networkId' })
    },
    async isAuthorized() {
      if (!features.reconnect) return false
      if (!connected) return false
      const accounts = await this.getAccounts()
      return !!accounts.length
    },
    async switchChain({ networkId }) {
      const provider = await this.getProvider()
      const chain = config.chains.find((x) => x.id === networkId)
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())

      await provider.request({
        method: 'mina_switchChain',
        params: [networkId],
      })
      return chain
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect()
      else
        config.emitter.emit('change', {
          accounts: accounts.map((x) => getAddress(x)),
        })
    },
    onChainChanged(networkId) {
      config.emitter.emit('change', { networkId })
    },
    async onDisconnect(_error) {
      config.emitter.emit('disconnect')
      connected = false
    },
    async getProvider({ networkId } = {}) {
      const chain =
        config.chains.find((x) => x.id === networkId) ?? config.chains[0]
      const url = chain.rpcUrls.default.http[0]!

      const request: JSAPIStandardRequestFn = async ({ method, params }) => {
        // eth methods
        if (method === 'mina_networkId') return connectedNetworkId
        if (method === 'mina_requestAccounts') return parameters.accounts
        if (method === 'mina_signTypedData_v4')
          if (features.signTypedDataError) {
            if (typeof features.signTypedDataError === 'boolean')
              throw new UserRejectedRequestError(
                new Error('Failed to sign typed data.'),
              )
            throw features.signTypedDataError
          }

        // wallet methods
        if (method === 'mina_switchChain') {
          if (features.switchChainError) {
            if (typeof features.switchChainError === 'boolean')
              throw new UserRejectedRequestError(
                new Error('Failed to switch chain.'),
              )
            throw features.switchChainError
          }
          type Params = [{ networkId: string }]
          connectedNetworkId = (params as Params)[0].networkId
          this.onChainChanged(connectedNetworkId.toString())
          return
        }

        if (method === 'wallet_watchAsset') {
          if (features.watchAssetError) {
            if (typeof features.watchAssetError === 'boolean')
              throw new UserRejectedRequestError(
                new Error('Failed to switch chain.'),
              )
            throw features.watchAssetError
          }
          return connected
        }

        if (method === 'wallet_getCapabilities')
          return {
            '0x2105': {
              paymasterService: {
                supported:
                  (params as [Hex])[0] ===
                  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
              },
              sessionKeys: {
                supported: true,
              },
            },
            '0x14A34': {
              paymasterService: {
                supported:
                  (params as [Hex])[0] ===
                  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
              },
            },
          }

        if (method === 'wallet_sendCalls') {
          const hashes = []
          const calls = (params as any)[0].calls
          for (const call of calls) {
            const { result, error } = await rpc.http(url, {
              body: {
                method: 'mina_sendTransaction',
                params: [call],
              },
            })
            if (error)
              throw new RpcRequestError({
                body: { method, params },
                error,
                url,
              })
            hashes.push(result)
          }
          // const id = keccak256(stringToHex(JSON.stringify(calls)));
          const id = JSON.stringify(calls)
          transactionCache.set(id, hashes)
          return id
        }

        if (method === 'wallet_getCallsStatus') {
          const hashes = transactionCache.get((params as any)[0])
          if (!hashes) return null
          const receipts = await Promise.all(
            hashes.map(async (hash) => {
              const { result, error } = await rpc.http(url, {
                body: {
                  method: 'mina_getTransactionReceipt',
                  params: [hash],
                  id: 0,
                },
              })
              if (error)
                throw new RpcRequestError({
                  body: { method, params },
                  error,
                  url,
                })
              if (!result) return null
              return {
                blockHash: result.blockHash,
                blockNumber: result.blockNumber,
                gasUsed: result.gasUsed,
                logs: result.logs,
                status: result.status,
                transactionHash: result.transactionHash,
              } satisfies WalletCallReceipt
            }),
          )
          if (receipts.some((x) => !x))
            return { status: 'PENDING', receipts: [] }
          return { status: 'CONFIRMED', receipts }
        }

        if (method === 'wallet_showCallsStatus') return

        // other methods
        if (method === 'personal_sign') {
          if (features.signMessageError) {
            if (typeof features.signMessageError === 'boolean')
              throw new UserRejectedRequestError(
                new Error('Failed to sign message.'),
              )
            throw features.signMessageError
          }
          // Change `personal_sign` to `mina_sign` and swap params
          method = 'mina_sign'
          type Params = [data: Hex, address: Address]
          params = [(params as Params)[1], (params as Params)[0]]
        }

        const body = { method, params }
        const { error, result } = await rpc.http(url, { body })
        if (error) throw new RpcRequestError({ body, error, url })

        return result
      }
      return custom({ request })({ retryCount: 0 })
    },
  }))
}
