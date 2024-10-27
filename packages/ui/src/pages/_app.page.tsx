import "@/styles/App.scss";
import type { AppProps } from "next/app";
import { ZkappProvider } from "@/lib/ZkappContext";
import Navbar from "@/components/Navbar";
// import { createConfig } from "@/lib/connect/core/createConfig";
// import { mainnet } from "@/lib/connect/viem/chains";
// import { http } from "@/lib/connect/viem";
// import { WagmiProvider } from "@/lib/connect/react/context";

// const config = createConfig({
//   chains: [mainnet],
//   connectors: [],
//   pollingInterval: 100,
//   storage: null,
//   transports: {
//     [mainnet.id]: http(),
//   },
// });

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <WagmiProvider config={config}>
    <ZkappProvider>
      <Navbar />
      <Component {...pageProps} />
    </ZkappProvider>
    // </WagmiProvider>
  );
}
