'use client'
import { minaDevnet, minaMainnet } from '@/lib/connect/appkit/networks'
import { useSwitchChain } from '@/lib/connect/react/hooks/useSwitchChain'
import { useAppKitNetwork } from '@reown/appkit/react'

export default function SwitchChainDemo() {
  const { chainId } = useAppKitNetwork()
  const { switchChain } = useSwitchChain()

  return chainId === minaMainnet.id ? (
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
  ) : chainId === minaDevnet.id ? (
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
    <p className="text-white">Unsupported Network</p>
  )
}
