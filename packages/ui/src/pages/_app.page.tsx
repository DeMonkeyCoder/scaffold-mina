import "@/styles/App.scss";
import type { AppProps } from "next/app";
import { ZkappProvider } from "@/lib/ZkappContext";
import Navbar from "@/components/Navbar";
import { createConfig } from "@/lib/connect/core/createConfig";
import { devnet, mainnet } from "@/lib/connect/viem/chains";
import { http } from "@/lib/connect/viem";
import { WagmiProvider } from "@/lib/connect/react/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const config = createConfig({
  chains: [mainnet, devnet],
  connectors: [],
  storage: null,
  transports: {
    [mainnet.id]: http(),
    [devnet.id]: http(),
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ZkappProvider>
          <Navbar />
          <Component {...pageProps} />
        </ZkappProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
