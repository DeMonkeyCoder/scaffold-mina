import { ConnectWallet } from '@/components/ConnectWallet'
import { useAppKitAccount } from '@reown/appkit/react'
import Link from 'next/link'

export default function Navbar() {
  const { isConnected, address } = useAppKitAccount()

  if (!isConnected) return <div />

  return (
    <nav className="flex w-full z-50">
      <div className="flex items-center pl-14 pr-14 h-16 w-full shadow-sm shadow-gray-500 bg-black">
        <div className="relative flex items-center h-12 items-center justify-between w-full">
          <div className="flex items-center">
            <span className="font-bold text-white text-3xl">
              <Link href="/">Scaffold-</Link>
            </span>
            <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text text-3xl font-bold">
              MINA
            </div>
          </div>
          <div className="absolute inset-0 flex justify-center items-center font-firacode">
            <div className="flex gap-16">
              <div className="flex justify-center items-center">
                <Link
                  href="/"
                  className="flex justify-center items-center text-sm font-medium text-black bg-white hover:text-white hover:bg-black border px-4 py-1 rounded duration-200"
                >
                  Home
                </Link>
              </div>
              <div>
                <Link
                  href="/debug"
                  className="flex justify-center items-center text-sm font-medium text-black bg-white hover:text-white hover:bg-black border px-4 py-1 rounded duration-200"
                >
                  Debug Contracts
                </Link>
              </div>
              <div>
                <Link
                  href="/txdemo"
                  className="flex justify-center items-center text-sm font-medium text-black bg-white hover:text-white hover:bg-black border px-4 py-1 rounded duration-200"
                >
                  Tx Demo
                </Link>
              </div>
              <div className="flex items-center">
                <a
                  href={`https://faucet.minaprotocol.com/?address=${address}`}
                  target="blank"
                  className="flex justify-center items-center text-sm font-medium text-black bg-white hover:text-white hover:bg-black border px-4 py-1 rounded duration-200"
                >
                  Mina Faucet
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <ConnectWallet />
          </div>
        </div>
      </div>
    </nav>
  )
}
