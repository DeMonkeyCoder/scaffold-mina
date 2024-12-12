'use client'

import type { ResolvedRegister, State } from '@/lib/connect/core/exports'
import { createContext, createElement } from 'react'
import { Hydrate } from './hydrate'

export const WagmiContext = createContext<
  ResolvedRegister['config'] | undefined
>(undefined)

export type WagmiProviderProps = {
  config: ResolvedRegister['config']
  initialState?: State | undefined
  reconnectOnMount?: boolean | undefined
}

export function WagmiProvider(
  parameters: React.PropsWithChildren<WagmiProviderProps>,
) {
  const { children, config } = parameters

  const props = { value: config }
  return createElement(
    Hydrate,
    parameters,
    createElement(WagmiContext.Provider, props, children),
  )
}
