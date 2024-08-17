import MinaProvider from "@aurowallet/mina-provider";

declare global {
  interface Window {
    mina?: MinaProvider;
  }
}
