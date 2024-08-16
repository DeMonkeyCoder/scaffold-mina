import "@/styles/App.scss";
import type { AppProps } from "next/app";
import { ZkappProvider } from "@/lib/ZkappContext";
import Navbar from "@/components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ZkappProvider>
      <Navbar />
      <Component {...pageProps} />
    </ZkappProvider>
  );
}
