import type {
  AddMinaChainParameter,
  UserRejectedRequestErrorType,
  SwitchChainErrorType as viem_SwitchChainErrorType,
} from 'vimina'

import type { Config } from '../createConfig'
import type { BaseErrorType, ErrorType } from '../errors/base'
import {
  ChainNotConfiguredError,
  type ChainNotConfiguredErrorType,
} from '../errors/config'
import {
  type ProviderNotFoundErrorType,
  SwitchChainNotSupportedError,
  type SwitchChainNotSupportedErrorType,
} from '../errors/connector'
import type { ConnectorParameter } from '../types/properties'
import type { Compute, ExactPartial } from '../types/utils'

export type SwitchChainParameters<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Compute<
  ConnectorParameter & {
    networkId: networkId | config['chains'][number]['id']
    addMinaChainParameter?:
      | Compute<ExactPartial<Omit<AddMinaChainParameter, 'networkId'>>>
      | undefined
  }
>

export type SwitchChainReturnType<
  config extends Config = Config,
  networkId extends
    config['chains'][number]['id'] = config['chains'][number]['id'],
> = Extract<
  config['chains'][number],
  { id: Config extends config ? number : networkId }
>

export type SwitchChainErrorType =
  | SwitchChainNotSupportedErrorType
  | ChainNotConfiguredErrorType
  // connector.switchChain()
  | ProviderNotFoundErrorType
  | UserRejectedRequestErrorType
  // base
  | BaseErrorType
  | ErrorType
  // vimina
  | viem_SwitchChainErrorType

/** https://wagmi.sh/core/api/actions/switchChain */
export async function switchChain<
  config extends Config,
  networkId extends config['chains'][number]['id'],
>(
  config: config,
  parameters: SwitchChainParameters<config, networkId>,
): Promise<SwitchChainReturnType<config, networkId>> {
  const { addMinaChainParameter, networkId } = parameters

  const connection = config.state.connections.get(
    parameters.connector?.uid ?? config.state.current!,
  )
  if (connection) {
    const connector = connection.connector
    if (!connector.switchChain)
      throw new SwitchChainNotSupportedError({ connector })
    const chain = await connector.switchChain({
      addMinaChainParameter,
      networkId,
    })
    return chain as SwitchChainReturnType<config, networkId>
  }

  const chain = config.chains.find((x) => x.id === networkId)
  if (!chain) throw new ChainNotConfiguredError()
  config.setState((x) => ({ ...x, networkId }))
  return chain as SwitchChainReturnType<config, networkId>
}
