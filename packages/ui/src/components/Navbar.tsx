import { ConnectWallet } from '@/components/ConnectWallet'
import { useAppKitAccount } from '@reown/appkit/react'
import Link from 'next/link'
import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi' // Icons for mobile menu

export default function Navbar() {
  const { isConnected, address } = useAppKitAccount()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!isConnected) return <div />

  return (
    <nav className="w-full bg-black shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4 xl:px-10 flex-wrap">
        {/* Left Section: Logo */}
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Scaffold-
          </Link>
          <span className="bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text text-2xl font-bold ml-1">
            MINA
          </span>
        </div>

        {/* Center Section: Navigation (Hidden on Mobile) */}
        <div className="hidden xl:flex space-x-8">
          <NavItem href="/" text="Home" />
          <NavItem href="/debug" text="Debug Contracts" />
          <NavItem href="/txdemo" text="Tx Demo" />
          <NavItem
            href={`https://faucet.minaprotocol.com/?address=${address}`}
            text="Mina Faucet"
            external
          />
        </div>

        {/* Right Section: Wallet & Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <ConnectWallet />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden text-white text-2xl focus:outline-none"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-black py-4 px-6 space-y-4 border-t border-gray-700">
          <NavItem href="/" text="Home" mobile />
          <NavItem href="/debug" text="Debug Contracts" mobile />
          <NavItem href="/txdemo" text="Tx Demo" mobile />
          <NavItem
            href={`https://faucet.minaprotocol.com/?address=${address}`}
            text="Mina Faucet"
            external
            mobile
          />
        </div>
      )}
    </nav>
  )
}

/* Reusable Nav Item Component */
function NavItem({ href, text, external = false, mobile = false }: any) {
  return (
    <Link
      href={href}
      className={`${mobile ? 'block text-lg py-2' : 'text-base px-4 py-2'} bg-gray-950 text-white font-medium border border-gray-600 rounded-lg px-5 py-2 transition duration-200
      hover:bg-gray-700 hover:border-gray-500 active:scale-95 shadow-md`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {text}
    </Link>
  )
}
