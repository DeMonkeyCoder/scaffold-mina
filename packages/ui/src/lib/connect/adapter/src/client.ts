import {
  type Config,
  type Connector,
  type CreateConfigParameters,
  type CreateConnectorFn,
  connect,
  createConfig,
  getAccount,
  getBalance,
  getConnections,
  injected,
  reconnect,
  // signMessage,
  switchChain,
  disconnect as wagmiDisconnect,
  // writeContract as wagmiWriteContract,
  // waitForTransactionReceipt,
  watchAccount,
  watchConnections,
  watchConnectors,
  // watchPendingTransactions,
} from '@/lib/connect/core/exports'
import type { Chain } from '@/lib/connect/core/exports/chains'
import type UniversalProvider from '@walletconnect/universal-provider'
import type { Hex } from 'vimina'

import type { AppKit, AppKitOptions } from '@reown/appkit'
import type {
  AppKitNetwork,
  BaseNetwork,
  CaipNetwork,
  ChainNamespace,
} from '@reown/appkit-common'
import { ConstantsUtil as CommonConstantsUtil } from '@reown/appkit-common'
import { CoreHelperUtil, StorageUtil } from '@reown/appkit-core'
import type { ConnectorType, Provider } from '@reown/appkit-core'
import { CaipNetworksUtil, PresetsUtil } from '@reown/appkit-utils'
import type { W3mFrameProvider } from '@reown/appkit-wallet'
import { AdapterBlueprint } from '@reown/appkit/adapters'

import { formatMina, formatUnits, parseUnits } from '@mina-js/utils'
import { parseWalletCapabilities } from './utils/helpers'

interface PendingTransactionsFilter {
  enable: boolean
  pollingInterval?: number
}
// --- Constants ---------------------------------------------------- //
const DEFAULT_PENDING_TRANSACTIONS_FILTER = {
  enable: false,
  pollingInterval: 30_000,
}

export class WagmiAdapter extends AdapterBlueprint {
  public wagmiChains: readonly [Chain, ...Chain[]] | undefined
  public wagmiConfig!: Config
  public adapterType = 'wagmi'

  private pendingTransactionsFilter: PendingTransactionsFilter
  private unwatchPendingTransactions: (() => void) | undefined
  private balancePromises: Record<
    string,
    Promise<AdapterBlueprint.GetBalanceResult>
  > = {}

  constructor(
    configParams: Partial<CreateConfigParameters> & {
      networks: AppKitNetwork[]
      pendingTransactionsFilter?: PendingTransactionsFilter
      projectId: string
    },
  ) {
    super({
      projectId: configParams.projectId,
      networks: CaipNetworksUtil.extendCaipNetworks(configParams.networks, {
        projectId: configParams.projectId,
        customNetworkImageUrls: {},
        customRpcChainIds: configParams.transports
          ? Object.keys(configParams.transports).map(Number)
          : [],
      }) as [CaipNetwork, ...CaipNetwork[]],
    })

    this.pendingTransactionsFilter = {
      ...DEFAULT_PENDING_TRANSACTIONS_FILTER,
      ...(configParams.pendingTransactionsFilter ?? {}),
    }

    this.namespace = 'mina' as any

    this.createConfig({
      ...configParams,
      networks: CaipNetworksUtil.extendCaipNetworks(configParams.networks, {
        projectId: configParams.projectId,
        customNetworkImageUrls: {},
        customRpcChainIds: configParams.transports
          ? Object.keys(configParams.transports).map(Number)
          : [],
      }) as [CaipNetwork, ...CaipNetwork[]],
      projectId: configParams.projectId,
    })

    this.setupWatchers()
  }

  override async getAccounts(
    params: AdapterBlueprint.GetAccountsParams,
  ): Promise<AdapterBlueprint.GetAccountsResult> {
    const connector = this.getWagmiConnector(params.id)

    if (!connector) {
      return { accounts: [] }
    }

    if (connector.id === CommonConstantsUtil.CONNECTOR_ID.AUTH) {
      const provider = connector.provider as W3mFrameProvider
      const { address, accounts } = await provider.connect()

      return Promise.resolve({
        accounts: (accounts || [{ address, type: 'eoa' }]).map((account) =>
          CoreHelperUtil.createAccount('eip155', account.address, account.type),
        ),
      })
    }

    const { addresses, address } = getAccount(this.wagmiConfig)

    return Promise.resolve({
      accounts: (addresses || [address])?.map((val) =>
        CoreHelperUtil.createAccount('eip155', val || '', 'eoa'),
      ),
    })
  }

  private getWagmiConnector(id: string) {
    return this.wagmiConfig.connectors.find((c) => c.id === id)
  }

  private createConfig(
    configParams: Partial<CreateConfigParameters> & {
      networks: CaipNetwork[]
      projectId: string
    },
  ) {
    // this.caipNetworks = configParams.networks
    // this.wagmiChains = this.caipNetworks.filter(
    //   (caipNetwork) =>
    //     caipNetwork.chainNamespace === CommonConstantsUtil.CHAIN.EVM,
    // ) as unknown as [BaseNetwork, ...BaseNetwork[]]
    //
    // const transportsArr = this.wagmiChains.map((chain) => [
    //   chain.id,
    //   CaipNetworksUtil.getViemTransport(chain as CaipNetwork),
    // ])
    //
    // Object.entries(configParams.transports ?? {}).forEach(
    //   ([chainId, transport]) => {
    //     const index = transportsArr.findIndex(([id]) => id === Number(chainId))
    //     if (index === -1) {
    //       transportsArr.push([Number(chainId), transport as HttpTransport])
    //     } else {
    //       transportsArr[index] = [Number(chainId), transport as HttpTransport]
    //     }
    //   },
    // )
    //
    // const transports = Object.fromEntries(transportsArr)
    // const connectors: CreateConnectorFn[] = [...(configParams.connectors ?? [])]
    //
    // this.wagmiConfig = createConfig({
    //   ...configParams,
    //   chains: this.wagmiChains,
    //   transports,
    //   connectors,
    // })
    this.wagmiConfig = createConfig({
      ...configParams,
      chains: configParams.networks as unknown as [
        BaseNetwork,
        ...BaseNetwork[],
      ],
    } as any)
  }

  private setupWatchPendingTransactions() {
    // if (
    //   !this.pendingTransactionsFilter.enable ||
    //   this.unwatchPendingTransactions
    // ) {
    //   return
    // }
    //
    // this.unwatchPendingTransactions = watchPendingTransactions(
    //   this.wagmiConfig,
    //   {
    //     pollingInterval: this.pendingTransactionsFilter.pollingInterval,
    //     /* Magic RPC does not support the pending transactions. We handle transaction for the AuthConnector cases in AppKit client to handle all clients at once. Adding the onError handler to avoid the error to throw. */
    //     onError: () => {},
    //     onTransactions: () => {
    //       this.emit('pendingTransactions')
    //       LimitterUtil.increase('pendingTransactions')
    //     },
    //   },
    // )
    //
    // const unsubscribe = LimitterUtil.subscribeKey(
    //   'pendingTransactions',
    //   (val) => {
    //     if (val >= CommonConstantsUtil.LIMITS.PENDING_TRANSACTIONS) {
    //       this.unwatchPendingTransactions?.()
    //       unsubscribe()
    //     }
    //   },
    // )
    throw new Error('Not implemented')
  }

  private setupWatchers() {
    watchAccount(this.wagmiConfig, {
      onChange: (accountData, prevAccountData) => {
        if (accountData.status === 'disconnected' && prevAccountData.address) {
          this.emit('disconnect')
        }

        if (accountData.status === 'connected') {
          if (
            accountData.address !== prevAccountData?.address ||
            prevAccountData.status !== 'connected'
          ) {
            // this.setupWatchPendingTransactions()
            this.emit('accountChanged', {
              address: accountData.address,
            })
          }

          if (accountData.networkId !== prevAccountData?.networkId) {
            this.emit('switchNetwork', {
              address: accountData.address,
              chainId: accountData.networkId,
            })
          }
        }
      },
    })
    watchConnections(this.wagmiConfig, {
      onChange: (connections) => {
        if (connections.length === 0) {
          this.emit('disconnect')
        }
      },
    })
  }

  private async addThirdPartyConnectors(_options: AppKitOptions) {
    const thirdPartyConnectors: CreateConnectorFn[] = []
    // Add third party connectors if needed
    thirdPartyConnectors.forEach((connector) => {
      const cnctr = this.wagmiConfig._internal.connectors.setup(connector)
      this.wagmiConfig._internal.connectors.setState((prev) => [...prev, cnctr])
    })
  }

  private addWagmiConnectors(options: AppKitOptions, _appKit: AppKit) {
    const customConnectors: CreateConnectorFn[] = []

    // if (options.enableWalletConnect !== false) {
    //   customConnectors.push(
    //     walletConnect(
    //       options,
    //       appKit,
    //       this.caipNetworks as [CaipNetwork, ...CaipNetwork[]],
    //     ),
    //   )
    // }

    if (options.enableInjected !== false) {
      // customConnectors.push(injected({ shimDisconnect: true }))
      customConnectors.push(injected({ shimDisconnect: false }))
    }

    // const emailEnabled =
    //   options.features?.email === undefined
    //     ? CoreConstantsUtil.DEFAULT_FEATURES.email
    //     : options.features?.email
    // const socialsEnabled = options.features?.socials
    //   ? options.features?.socials?.length > 0
    //   : CoreConstantsUtil.DEFAULT_FEATURES.socials
    //
    // if (emailEnabled || socialsEnabled) {
    //   customConnectors.push(
    //     authConnector({
    //       chains: this.wagmiChains,
    //       options: {
    //         projectId: options.projectId,
    //         enableAuthLogger: options.enableAuthLogger,
    //       },
    //     }),
    //   )
    // }

    customConnectors.forEach((connector) => {
      const cnctr = this.wagmiConfig._internal.connectors.setup(connector)
      this.wagmiConfig._internal.connectors.setState((prev) => [...prev, cnctr])
    })
  }

  public async signMessage(
    _params: AdapterBlueprint.SignMessageParams,
  ): Promise<AdapterBlueprint.SignMessageResult> {
    throw new Error('not implemented')
  }

  public async sendTransaction(
    _params: AdapterBlueprint.SendTransactionParams,
  ): Promise<AdapterBlueprint.SendTransactionResult> {
    // const { chainId } = getAccount(this.wagmiConfig)
    // const txParams = {
    //   account: params.address,
    //   to: params.to as Hex,
    //   value: params.value as bigint,
    //   gas: params.gas as bigint,
    //   gasPrice: params.gasPrice as bigint,
    //   data: params.data as Hex,
    //   chainId,
    //   type: 'legacy' as const,
    // }
    //
    // await prepareTransactionRequest(this.wagmiConfig, txParams)
    // const tx = await wagmiSendTransaction(this.wagmiConfig, txParams)
    // await waitForTransactionReceipt(this.wagmiConfig, {
    //   hash: tx,
    //   timeout: 25000,
    // })
    //
    // return { hash: tx }
    throw new Error('not implemented')
  }

  public async writeContract(
    _params: AdapterBlueprint.WriteContractParams,
  ): Promise<AdapterBlueprint.WriteContractResult> {
    throw new Error('not implemented')
  }

  public async getEnsAddress(
    _params: AdapterBlueprint.GetEnsAddressParams,
  ): Promise<AdapterBlueprint.GetEnsAddressResult> {
    throw new Error('not implemented')
  }

  public async estimateGas(
    _params: AdapterBlueprint.EstimateGasTransactionArgs,
  ): Promise<AdapterBlueprint.EstimateGasTransactionResult> {
    throw new Error('not implemented')
  }

  public parseUnits(
    params: AdapterBlueprint.ParseUnitsParams,
  ): AdapterBlueprint.ParseUnitsResult {
    return parseUnits(params.value, params.decimals)
  }

  public formatUnits(
    params: AdapterBlueprint.FormatUnitsParams,
  ): AdapterBlueprint.FormatUnitsResult {
    return formatUnits(params.value, params.decimals)
  }

  private async addWagmiConnector(
    connector: Connector,
    options: AppKitOptions,
  ) {
    /*
     * We don't need to set auth connector or walletConnect connector
     * from wagmi since we already set it in chain adapter blueprint
     */
    if (
      connector.id === CommonConstantsUtil.CONNECTOR_ID.AUTH ||
      connector.id === CommonConstantsUtil.CONNECTOR_ID.WALLET_CONNECT
    ) {
      return
    }

    const provider = (await connector.getProvider().catch(() => undefined)) as
      | Provider
      | undefined

    this.addConnector({
      id: connector.id,
      explorerId: PresetsUtil.ConnectorExplorerIds[connector.id],
      imageUrl: options?.connectorImages?.[connector.id] ?? connector.icon,
      name: PresetsUtil.ConnectorNamesMap[connector.id] ?? connector.name,
      imageId: PresetsUtil.ConnectorImageIds[connector.id],
      type: PresetsUtil.ConnectorTypesMap[connector.type] ?? 'EXTERNAL',
      info:
        connector.id === CommonConstantsUtil.CONNECTOR_ID.INJECTED
          ? undefined
          : { rdns: connector.id },
      provider,
      chain: this.namespace as ChainNamespace,
      chains: [],
    })
  }

  public async syncConnectors(options: AppKitOptions, appKit: AppKit) {
    /*
     * Watch for new connectors. This is needed because some EIP6963
     * connectors are added later in the process the initial setup
     */
    watchConnectors(this.wagmiConfig, {
      onChange: (connectors) =>
        connectors.forEach((connector) =>
          this.addWagmiConnector(connector, options),
        ),
    })

    // Add current wagmi connectors to chain adapter blueprint
    await Promise.all(
      this.wagmiConfig.connectors.map((connector) =>
        this.addWagmiConnector(connector, options),
      ),
    )

    // Add wagmi connectors
    this.addWagmiConnectors(options, appKit)

    // Add third party connectors
    await this.addThirdPartyConnectors(options)
  }

  public async syncConnection(
    params: AdapterBlueprint.SyncConnectionParams,
  ): Promise<AdapterBlueprint.ConnectResult> {
    const { id } = params
    const connections = getConnections(this.wagmiConfig)
    const connection = connections.find((c) => c.connector.id === id)
    const connector = this.getWagmiConnector(id)
    const provider = (await connector?.getProvider()) as Provider

    return {
      chainId: String(connection?.networkId),
      address: connection?.accounts[0] as string,
      provider,
      type: connection?.connector.type as ConnectorType,
      id: connection?.connector.id as string,
    }
  }

  public override async connectWalletConnect(
    _chainId?: number | string,
  ): Promise<{ clientId: string } | undefined> {
    // // Attempt one click auth first, if authenticated, still connect with wagmi to store the session
    // const walletConnectConnector = this.getWalletConnectConnector()
    // await walletConnectConnector.authenticate()
    //
    // const wagmiConnector = this.getWagmiConnector('walletConnect')
    //
    // if (!wagmiConnector) {
    //   throw new Error(
    //     'UniversalAdapter:connectWalletConnect - connector not found',
    //   )
    // }
    //
    // await connect(this.wagmiConfig, {
    //   connector: wagmiConnector,
    //   chainId: chainId ? Number(chainId) : undefined,
    // })
    //
    // return {
    //   clientId:
    //     await walletConnectConnector.provider.client.core.crypto.getClientId(),
    // }
    throw new Error('not implemented')
  }

  public async connect(
    params: AdapterBlueprint.ConnectParams,
  ): Promise<AdapterBlueprint.ConnectResult> {
    const { id, provider, type, info, chainId } = params
    const connector = this.getWagmiConnector(id)

    if (!connector) {
      throw new Error(
        'connectionControllerClient:connectExternal - connector is undefined',
      )
    }

    if (
      provider &&
      info &&
      connector.id === CommonConstantsUtil.CONNECTOR_ID.EIP6963
    ) {
      // @ts-expect-error Exists on EIP6963Connector
      connector.setEip6963Wallet?.({ provider, info })
    }

    const res = await connect(this.wagmiConfig, {
      connector,
      networkId: chainId ? String(chainId) : undefined,
    })

    return {
      address: res.accounts[0],
      chainId: res.networkId,
      provider: provider as Provider,
      type: type as ConnectorType,
      id,
    }
  }

  public override async reconnect(
    params: AdapterBlueprint.ConnectParams,
  ): Promise<void> {
    const { id } = params

    const connector = this.getWagmiConnector(id)

    if (!connector) {
      throw new Error(
        'connectionControllerClient:connectExternal - connector is undefined',
      )
    }

    await reconnect(this.wagmiConfig, {
      connectors: [connector],
    })
  }

  public async getBalance(
    params: AdapterBlueprint.GetBalanceParams,
  ): Promise<AdapterBlueprint.GetBalanceResult> {
    const caipNetwork = this.caipNetworks?.find(
      (network) => network.id === params.chainId,
    )

    if (caipNetwork && this.wagmiConfig) {
      const caipAddress = `${caipNetwork.caipNetworkId}:${params.address}`
      const cachedPromise = this.balancePromises[caipAddress]
      if (cachedPromise) {
        return cachedPromise
      }

      const cachedBalance =
        StorageUtil.getNativeBalanceCacheForCaipAddress(caipAddress)
      if (cachedBalance) {
        return { balance: cachedBalance.balance, symbol: cachedBalance.symbol }
      }

      this.balancePromises[caipAddress] =
        // biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
        new Promise<AdapterBlueprint.GetBalanceResult>(async (resolve) => {
          const chainId = params.chainId
          const balance = await getBalance(this.wagmiConfig, {
            address: params.address as Hex,
            networkId: chainId as string,
            token: params.tokens?.[caipNetwork.caipNetworkId]?.address as Hex,
          })

          StorageUtil.updateNativeBalanceCache({
            caipAddress,
            balance: formatMina(balance.value),
            symbol: balance.symbol,
            timestamp: Date.now(),
          })
          resolve({
            balance: formatMina(balance.value),
            symbol: balance.symbol,
          })
        }).finally(() => {
          delete this.balancePromises[caipAddress]
        })

      return this.balancePromises[caipAddress] || { balance: '', symbol: '' }
    }

    return { balance: '', symbol: '' }
  }

  public async getProfile(
    _params: AdapterBlueprint.GetProfileParams,
  ): Promise<AdapterBlueprint.GetProfileResult> {
    throw new Error('not implemented')
  }

  public getWalletConnectProvider(): AdapterBlueprint.GetWalletConnectProviderResult {
    // return this.getWagmiConnector('walletConnect')
    //   ?.provider as UniversalProvider
    throw new Error('not implemented')
  }

  public async disconnect() {
    const connections = getConnections(this.wagmiConfig)
    await Promise.all(
      connections.map(async (connection) => {
        const connector = this.getWagmiConnector(connection.connector.id)

        if (connector) {
          await wagmiDisconnect(this.wagmiConfig, { connector })
        }
      }),
    )
  }

  public override async switchNetwork(
    params: AdapterBlueprint.SwitchNetworkParams,
  ) {
    return switchChain(this.wagmiConfig, {
      networkId: params.caipNetwork.id as string,
    })
  }

  public async getCapabilities(params: string) {
    if (!this.wagmiConfig) {
      throw new Error(
        'connectionControllerClient:getCapabilities - wagmiConfig is undefined',
      )
    }

    const connections = getConnections(this.wagmiConfig)
    const connection = connections[0]

    const connector = connection
      ? this.getWagmiConnector(connection.connector.id)
      : null

    if (!connector) {
      throw new Error(
        'connectionControllerClient:getCapabilities - connector is undefined',
      )
    }

    const provider = (await connector.getProvider()) as UniversalProvider

    if (!provider) {
      throw new Error(
        'connectionControllerClient:getCapabilities - provider is undefined',
      )
    }

    const walletCapabilitiesString =
      provider.session?.sessionProperties?.capabilities
    if (walletCapabilitiesString) {
      const walletCapabilities = parseWalletCapabilities(
        walletCapabilitiesString,
      )
      const accountCapabilities = walletCapabilities[params]
      if (accountCapabilities) {
        return accountCapabilities
      }
    }

    return await provider.request({
      method: 'wallet_getCapabilities',
      params: [params],
    })
  }

  public async grantPermissions(
    params: AdapterBlueprint.GrantPermissionsParams,
  ) {
    if (!this.wagmiConfig) {
      throw new Error(
        'connectionControllerClient:grantPermissions - wagmiConfig is undefined',
      )
    }

    const connections = getConnections(this.wagmiConfig)
    const connection = connections[0]

    const connector = connection
      ? this.getWagmiConnector(connection.connector.id)
      : null

    if (!connector) {
      throw new Error(
        'connectionControllerClient:grantPermissions - connector is undefined',
      )
    }

    const provider = (await connector.getProvider()) as UniversalProvider

    if (!provider) {
      throw new Error(
        'connectionControllerClient:grantPermissions - provider is undefined',
      )
    }

    return provider.request({ method: 'wallet_grantPermissions', params })
  }

  public async revokePermissions(
    params: AdapterBlueprint.RevokePermissionsParams,
  ): Promise<`0x${string}`> {
    if (!this.wagmiConfig) {
      throw new Error(
        'connectionControllerClient:revokePermissions - wagmiConfig is undefined',
      )
    }

    const connections = getConnections(this.wagmiConfig)
    const connection = connections[0]

    const connector = connection
      ? this.getWagmiConnector(connection.connector.id)
      : null

    if (!connector) {
      throw new Error(
        'connectionControllerClient:revokePermissions - connector is undefined',
      )
    }

    const provider = (await connector.getProvider()) as UniversalProvider

    if (!provider) {
      throw new Error(
        'connectionControllerClient:revokePermissions - provider is undefined',
      )
    }

    return provider.request({ method: 'wallet_revokePermissions', params })
  }

  public async walletGetAssets(
    params: AdapterBlueprint.WalletGetAssetsParams,
  ): Promise<AdapterBlueprint.WalletGetAssetsResponse> {
    if (!this.wagmiConfig) {
      throw new Error(
        'connectionControllerClient:walletGetAssets - wagmiConfig is undefined',
      )
    }

    const connections = getConnections(this.wagmiConfig)
    const connection = connections[0]

    const connector = connection
      ? this.getWagmiConnector(connection.connector.id)
      : null

    if (!connector) {
      throw new Error(
        'connectionControllerClient:walletGetAssets - connector is undefined',
      )
    }

    const provider = (await connector.getProvider()) as UniversalProvider

    if (!provider) {
      throw new Error(
        'connectionControllerClient:walletGetAssets - provider is undefined',
      )
    }

    return provider.request({ method: 'wallet_getAssets', params: [params] })
  }

  public override setUniversalProvider(
    _universalProvider: UniversalProvider,
  ): void {
    // this.addConnector(
    //     new WalletConnectConnector({
    //       provider: universalProvider,
    //       caipNetworks: this.caipNetworks || [],
    //       namespace: 'eip155'
    //     })
    // )
  }
}
