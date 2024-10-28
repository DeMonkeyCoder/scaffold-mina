import { useMinaProvider } from "@/lib/ZkappContext";
import ConnectWallet from "./ConnectWallet";
import Image from "next/image";

export default function Navbar() {
  const { isConnected } = useMinaProvider();

  if (!isConnected) return (<div></div>);

  return (
    <nav className="absolute top-3 w-full z-50">
  <div className="py-1 mx-10 px-10 bg-purple-50 shadow-lg rounded-full border-stone-400 ">
    <div className="relative flex h-12 items-center justify-between">
      <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
        <div className="flex items-center font-bold">
          <img className="h-6 w-auto mr-1" src="/assets/minalogo.png" alt=""/> Scaffold-<div className="bg-gradient-to-r from-purple-600 to-orange-500 text-transparent bg-clip-text">MINA</div>
        </div>
        <div className="hidden sm:ml-6 sm:block">
          <div className="flex">
            <a href="#" className= "px-8 py-2 text-sm font-medium text-black rounded-2xl transition-colors duration-200 ease-in-out hover:bg-gray-200">
              Home
            </a>
            <div className="flex rounded-2xl transition-colors duration-200 ease-in-out hover:bg-gray-200">
            <Image width={16} height={16} src="/assets/debug.svg"/>
            <a href="#" className="flex justify-center items-center text-sm font-medium text-black pr-3 pl-1">Debug Contracts</a>
          </div>
          <div className="flex items-center rounded-2xl transition-colors duration-200 ease-in-out hover:bg-gray-200 pl-2">
          <img className="h-6 w-auto" src="/assets/minalogo.png" alt=""/> 
            <a href="https://faucet.minaprotocol.com/?address" target="blank" className="flex justify-center items-center text-sm font-medium text-black pl-1 pr-2">Mina Faucet</a>
          </div>
            </div>
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
        {isConnected && <ConnectWallet />}
      </div>
    </div>
  </div>
</nav>
  );
}
