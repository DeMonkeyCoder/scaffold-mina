'use client'
import { useAppKitNetwork } from '@reown/appkit/react'
import { minaDevnet, minaMainnet } from '@wagmina/appkit/networks'
import { useSwitchChain } from 'wagmina'

export default function SwitchChainDemo() {
  const { chainId } = useAppKitNetwork()
  const { switchChain } = useSwitchChain()

  return chainId === minaDevnet.id ? (
    <button
      className="card flex items-center justify-center whitespace-nowrap"
      onClick={() =>
        switchChain({
          networkId: minaMainnet.id,
        })
      }
    >
      Switch to Mainnet
    </button>
  ) : (
    <button
      className="card flex items-center justify-center whitespace-nowrap"
      onClick={() =>
        switchChain({
          networkId: minaDevnet.id,
        })
      }
    >
      Switch to Devnet
    </button>
  )
}
