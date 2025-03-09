import {
  type MinaProviderDetail,
  type Store as MipdStore,
  createStore as createMipd,
} from '@mina-js/connect'
import {
  type Address,
  type Chain,
  type Client,
  type JSAPIStandardRequestFn,
  createClient,
  type ClientConfig as viem_ClientConfig,
  type Transport as viem_Transport,
} from 'vimina'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { type Mutate, type StoreApi, createStore } from 'zustand/vanilla'

import type {
  ConnectorEventMap,
  CreateConnectorFn,
} from './connectors/createConnector'
import { injected } from './connectors/injected'
import { type Emitter, type EventData, createEmitter } from './createEmitter'
import { type Storage, createStorage, noopStorage } from './createStorage'
import { ChainNotConfiguredError } from './errors/config'
import type {
  Compute,
  ExactPartial,
  LooseOmit,
  OneOf,
  RemoveUndefined,
} from './types/utils'
import { uid } from './utils/uid'
import { version } from './version'

export type CreateConfigParameters<
  chains extends readonly [Chain, ...Chain[]] = readonly [Chain, ...Chain[]],
  transports extends Record<chains[number]['id'], Transport> = Record<
    chains[number]['id'],
    Transport
  >,
> = Compute<
  {
    chains: chains
    connectors?: CreateConnectorFn[] | undefined
    multiInjectedProviderDiscovery?: boolean | undefined
    storage?: Storage | null | undefined
    ssr?: boolean | undefined
    syncConnectedChain?: boolean | undefined
  } & OneOf<
    | ({ transports: transports } & {
        [key in keyof ClientConfig]?:
          | ClientConfig[key]
          | { [_ in chains[number]['id']]?: ClientConfig[key] | undefined }
          | undefined
      })
    | {
        client(parameters: {
          chain: chains[number]
        }): Client<transports[chains[number]['id']], chains[number]>
      }
  >
>

export function createConfig<
  const chains extends readonly [Chain, ...Chain[]],
  transports extends Record<chains[number]['id'], Transport>,
>(
  parameters: CreateConfigParameters<chains, transports>,
): Config<chains, transports> {
  const {
    multiInjectedProviderDiscovery = true,
    storage = createStorage({
      storage:
        typeof window !== 'undefined' && window.localStorage
          ? window.localStorage
          : noopStorage,
    }),
    syncConnectedChain = true,
    ssr = false,
    ...rest
  } = parameters

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Set up connectors, clients, etc.
  /////////////////////////////////////////////////////////////////////////////////////////////////

  const mipd =
    typeof window !== 'undefined' && multiInjectedProviderDiscovery
      ? createMipd()
      : undefined
  const chains = createStore(() => rest.chains)
  const connectors = createStore(() =>
    [
      ...(rest.connectors ?? []),
      ...(!ssr
        ? mipd?.getProviders().map(providerDetailToConnector) ?? []
        : []),
    ].map(setup),
  )

  function setup(connectorFn: CreateConnectorFn): Connector {
    // Set up emitter with uid and add to connector so they are "linked" together.
    const emitter = createEmitter<ConnectorEventMap>(uid())
    const connector = {
      ...connectorFn({
        emitter,
        chains: chains.getState(),
        storage,
        transports: rest.transports,
      }),
      emitter,
      uid: emitter.uid,
    }

    // Start listening for `connect` events on connector setup
    // This allows connectors to "connect" themselves without user interaction (e.g. MetaMask's "Manually connect to current site")
    emitter.on('connect', connect)
    connector.setup?.()

    return connector
  }

  function providerDetailToConnector(providerDetail: MinaProviderDetail) {
    const { info } = providerDetail
    const provider = providerDetail.provider as any
    return injected({
      target: { ...info, id: info.rdns, provider },
      //TODO: change this after implementing wallet_requestPermissions in Pallad
      shimDisconnect: false,
    })
  }

  const clients = new Map<string, Client<Transport, chains[number]>>()

  function getClient<networkId extends chains[number]['id']>(
    config: { networkId?: networkId | chains[number]['id'] | undefined } = {},
  ): Client<Transport, Extract<chains[number], { id: networkId }>> {
    const networkId = config.networkId ?? store.getState().networkId
    const chain = chains.getState().find((x) => x.id === networkId)

    // networkId specified and not configured
    if (config.networkId && !chain) throw new ChainNotConfiguredError()

    // If the target chain is not configured, use the client of the current chain.
    type Return = Client<Transport, Extract<chains[number], { id: networkId }>>
    {
      const client = clients.get(store.getState().networkId)
      if (client && !chain) return client as Return
      if (!chain) throw new ChainNotConfiguredError()
    }

    // If a memoized client exists for a chain id, use that.
    {
      const client = clients.get(networkId)
      if (client) return client as Return
    }

    let client: Client<Transport, chains[number]>
    if (rest.client) client = rest.client({ chain })
    else {
      const networkId = chain.id as chains[number]['id']
      const networkIds = chains.getState().map((x) => x.id)
      // Grab all properties off `rest` and resolve for use in `createClient`
      const properties: Partial<viem_ClientConfig> = {}
      const entries = Object.entries(rest) as [keyof typeof rest, any][]

      for (const [key, value] of entries) {
        if (
          key === 'chains' ||
          key === 'client' ||
          key === 'connectors' ||
          key === 'transports'
        )
          continue

        if (typeof value === 'object') {
          // check if value is networkId-specific since some values can be objects
          // e.g. { batch: { multicall: { batchSize: 1024 } } }
          if (networkId in value) properties[key] = value[networkId]
          else {
            // check if value is networkId-specific, but does not have value for current networkId
            const hasChainSpecificValue = networkIds.some((x) => x in value)
            if (hasChainSpecificValue) continue
            properties[key] = value
          }
        } else properties[key] = value
      }

      client = createClient({
        ...properties,
        chain,
        batch: properties.batch ?? { multicall: true },
        transport: (parameters) =>
          rest.transports[networkId]({ ...parameters, connectors }),
      })
    }

    clients.set(networkId, client)
    return client as Return
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Create store
  /////////////////////////////////////////////////////////////////////////////////////////////////

  function getInitialState(): State {
    return {
      networkId: chains.getState()[0].id,
      connections: new Map<string, Connection>(),
      current: null,
      status: 'disconnected',
    }
  }

  let currentVersion: number
  const prefix = '0.0.0-canary-'
  if (version.startsWith(prefix))
    currentVersion = Number.parseInt(version.replace(prefix, ''))
  // use package major version to version store
  else currentVersion = Number.parseInt(version.split('.')[0] ?? '0')

  const store = createStore(
    subscribeWithSelector(
      // only use persist middleware if storage exists
      storage
        ? persist(getInitialState, {
            migrate(persistedState, version) {
              if (version === currentVersion) return persistedState as State

              const initialState = getInitialState()
              const networkId =
                persistedState &&
                typeof persistedState === 'object' &&
                'networkId' in persistedState &&
                typeof persistedState.networkId === 'string' &&
                chains.getState().some((x) => x.id === persistedState.networkId)
                  ? persistedState.networkId
                  : initialState.networkId
              return { ...initialState, networkId }
            },
            name: 'store',
            partialize(state) {
              // Only persist "critical" store properties to preserve storage size.
              return {
                connections: {
                  __type: 'Map',
                  value: Array.from(state.connections.entries()).map(
                    ([key, connection]) => {
                      const { id, name, type, uid } = connection.connector
                      const connector = { id, name, type, uid }
                      return [key, { ...connection, connector }]
                    },
                  ),
                } as unknown as PartializedState['connections'],
                networkId: state.networkId,
                current: state.current,
              } satisfies PartializedState
            },
            merge(persistedState, currentState) {
              // `status` should not be persisted as it messes with reconnection
              if (
                typeof persistedState === 'object' &&
                persistedState &&
                'status' in persistedState
              )
                delete persistedState.status
              return {
                ...currentState,
                ...(persistedState as object),
              }
            },
            skipHydration: ssr,
            storage: storage as Storage<Record<string, unknown>>,
            version: currentVersion,
          })
        : getInitialState,
    ),
  )

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Subscribe to changes
  /////////////////////////////////////////////////////////////////////////////////////////////////

  // Update default chain when connector chain changes
  if (syncConnectedChain)
    store.subscribe(
      ({ connections, current }) =>
        current ? connections.get(current)?.networkId : undefined,
      (networkId) => {
        // If chain is not configured, then don't switch over to it.
        const isChainConfigured = chains
          .getState()
          .some((x) => x.id === networkId)
        if (!isChainConfigured) return

        return store.setState((x) => ({
          ...x,
          networkId: networkId ?? x.networkId,
        }))
      },
    )

  // EIP-6963 subscribe for new wallet providers
  mipd?.subscribe((providerDetails) => {
    const currentConnectorIds = new Map()
    for (const connector of connectors.getState()) {
      currentConnectorIds.set(connector.id, true)
    }

    const newConnectors: Connector[] = []
    for (const providerDetail of providerDetails) {
      const connector = setup(providerDetailToConnector(providerDetail))
      if (currentConnectorIds.has(connector.id)) continue
      newConnectors.push(connector)
    }

    if (storage && !store.persist.hasHydrated()) return
    connectors.setState((x) => [...x, ...newConnectors], true)
  })

  /////////////////////////////////////////////////////////////////////////////////////////////////
  // Emitter listeners
  /////////////////////////////////////////////////////////////////////////////////////////////////

  function change(data: EventData<ConnectorEventMap, 'change'>) {
    store.setState((x) => {
      const connection = x.connections.get(data.uid)
      if (!connection) return x
      return {
        ...x,
        connections: new Map(x.connections).set(data.uid, {
          accounts:
            (data.accounts as readonly [Address, ...Address[]]) ??
            connection.accounts,
          networkId: data.networkId ?? connection.networkId,
          connector: connection.connector,
        }),
      }
    })
  }

  function connect(data: EventData<ConnectorEventMap, 'connect'>) {
    // Disable handling if reconnecting/connecting
    if (
      store.getState().status === 'connecting' ||
      store.getState().status === 'reconnecting'
    )
      return

    store.setState((x) => {
      const connector = connectors.getState().find((x) => x.uid === data.uid)
      if (!connector) return x

      if (connector.emitter.listenerCount('connect'))
        connector.emitter.off('connect', change)
      if (!connector.emitter.listenerCount('change'))
        connector.emitter.on('change', change)
      if (!connector.emitter.listenerCount('disconnect'))
        connector.emitter.on('disconnect', disconnect)

      return {
        ...x,
        connections: new Map(x.connections).set(data.uid, {
          accounts: data.accounts as readonly [Address, ...Address[]],
          networkId: data.networkId,
          connector: connector,
        }),
        current: data.uid,
        status: 'connected',
      }
    })
  }

  function disconnect(data: EventData<ConnectorEventMap, 'disconnect'>) {
    store.setState((x) => {
      const connection = x.connections.get(data.uid)
      if (connection) {
        const connector = connection.connector
        if (connector.emitter.listenerCount('change'))
          connection.connector.emitter.off('change', change)
        if (connector.emitter.listenerCount('disconnect'))
          connection.connector.emitter.off('disconnect', disconnect)
        if (!connector.emitter.listenerCount('connect'))
          connection.connector.emitter.on('connect', connect)
      }

      x.connections.delete(data.uid)

      if (x.connections.size === 0)
        return {
          ...x,
          connections: new Map(),
          current: null,
          status: 'disconnected',
        }

      const nextConnection = x.connections.values().next().value as Connection
      return {
        ...x,
        connections: new Map(x.connections),
        current: nextConnection.connector.uid,
      }
    })
  }

  return {
    get chains() {
      return chains.getState() as chains
    },
    get connectors() {
      return connectors.getState()
    },
    storage,

    getClient,
    get state() {
      return store.getState() as unknown as State<chains>
    },
    setState(value) {
      let newState: State
      if (typeof value === 'function') newState = value(store.getState() as any)
      else newState = value

      // Reset state if it got set to something not matching the base state
      const initialState = getInitialState()
      if (typeof newState !== 'object') newState = initialState
      const isCorrupt = Object.keys(initialState).some((x) => !(x in newState))
      if (isCorrupt) newState = initialState

      store.setState(newState, true)
    },
    subscribe(selector, listener, options) {
      return store.subscribe(
        selector as unknown as (state: State) => any,
        listener,
        options
          ? ({
              ...options,
              fireImmediately: options.emitImmediately,
              // Workaround cast since Zustand does not support `'exactOptionalPropertyTypes'`
            } as RemoveUndefined<typeof options>)
          : undefined,
      )
    },

    _internal: {
      mipd,
      store,
      ssr: Boolean(ssr),
      syncConnectedChain,
      transports: rest.transports as transports,
      chains: {
        setState(value) {
          const nextChains = (
            typeof value === 'function' ? value(chains.getState()) : value
          ) as chains
          if (nextChains.length === 0) return
          return chains.setState(nextChains, true)
        },
        subscribe(listener) {
          return chains.subscribe(listener)
        },
      },
      connectors: {
        providerDetailToConnector,
        setup,
        setState(value) {
          return connectors.setState(
            typeof value === 'function' ? value(connectors.getState()) : value,
            true,
          )
        },
        subscribe(listener) {
          return connectors.subscribe(listener)
        },
      },
      events: { change, connect, disconnect },
    },
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////
// Types
/////////////////////////////////////////////////////////////////////////////////////////////////

export type Config<
  chains extends readonly [Chain, ...Chain[]] = readonly [Chain, ...Chain[]],
  transports extends Record<chains[number]['id'], Transport> = Record<
    chains[number]['id'],
    Transport
  >,
> = {
  readonly chains: chains
  readonly connectors: readonly Connector[]
  readonly storage: Storage | null

  readonly state: State<chains>
  setState<tchains extends readonly [Chain, ...Chain[]] = chains>(
    value: State<tchains> | ((state: State<tchains>) => State<tchains>),
  ): void
  subscribe<state>(
    selector: (state: State<chains>) => state,
    listener: (state: state, previousState: state) => void,
    options?:
      | {
          emitImmediately?: boolean | undefined
          equalityFn?: ((a: state, b: state) => boolean) | undefined
        }
      | undefined,
  ): () => void

  getClient<networkId extends chains[number]['id']>(parameters?: {
    networkId?: networkId | chains[number]['id'] | undefined
  }): Client<transports[networkId], Extract<chains[number], { id: networkId }>>

  /**
   * Not part of versioned API, proceed with caution.
   * @internal
   */
  _internal: Internal<chains, transports>
}

type Internal<
  chains extends readonly [Chain, ...Chain[]] = readonly [Chain, ...Chain[]],
  transports extends Record<chains[number]['id'], Transport> = Record<
    chains[number]['id'],
    Transport
  >,
> = {
  readonly mipd: MipdStore | undefined
  readonly store: Mutate<StoreApi<any>, [['zustand/persist', any]]>
  readonly ssr: boolean
  readonly syncConnectedChain: boolean
  readonly transports: transports

  chains: {
    setState(
      value:
        | readonly [Chain, ...Chain[]]
        | ((
            state: readonly [Chain, ...Chain[]],
          ) => readonly [Chain, ...Chain[]]),
    ): void
    subscribe(
      listener: (
        state: readonly [Chain, ...Chain[]],
        prevState: readonly [Chain, ...Chain[]],
      ) => void,
    ): () => void
  }
  connectors: {
    providerDetailToConnector(
      providerDetail: MinaProviderDetail,
    ): CreateConnectorFn
    setup(connectorFn: CreateConnectorFn): Connector
    setState(value: Connector[] | ((state: Connector[]) => Connector[])): void
    subscribe(
      listener: (state: Connector[], prevState: Connector[]) => void,
    ): () => void
  }
  events: {
    change(data: EventData<ConnectorEventMap, 'change'>): void
    connect(data: EventData<ConnectorEventMap, 'connect'>): void
    disconnect(data: EventData<ConnectorEventMap, 'disconnect'>): void
  }
}

export type State<
  chains extends readonly [Chain, ...Chain[]] = readonly [Chain, ...Chain[]],
> = {
  networkId: chains[number]['id']
  connections: Map<string, Connection>
  current: string | null
  status: 'connected' | 'connecting' | 'disconnected' | 'reconnecting'
}

export type PartializedState = Compute<
  ExactPartial<Pick<State, 'networkId' | 'connections' | 'current' | 'status'>>
>

export type Connection = {
  accounts: readonly [Address, ...Address[]]
  networkId: string
  connector: Connector
}

export type Connector = ReturnType<CreateConnectorFn> & {
  emitter: Emitter<ConnectorEventMap>
  uid: string
}

export type Transport<
  type extends string = string,
  rpcAttributes = Record<string, any>,
  eip1193RequestFn extends JSAPIStandardRequestFn = JSAPIStandardRequestFn,
> = (
  params: Parameters<
    viem_Transport<type, rpcAttributes, eip1193RequestFn>
  >[0] & {
    connectors?: StoreApi<Connector[]> | undefined
  },
) => ReturnType<viem_Transport<type, rpcAttributes, eip1193RequestFn>>

type ClientConfig = LooseOmit<
  viem_ClientConfig,
  'account' | 'chain' | 'key' | 'name' | 'transport' | 'type'
>
