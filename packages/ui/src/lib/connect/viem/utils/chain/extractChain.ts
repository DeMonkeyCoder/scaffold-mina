import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";

export type ExtractChainParameters<
  chains extends readonly Chain[],
  networkId extends chains[number]["id"]
> = {
  chains: chains;
  id: networkId | chains[number]["id"];
};

export type ExtractChainReturnType<
  chains extends readonly Chain[],
  networkId extends chains[number]["id"]
> = Extract<chains[number], { id: networkId }>;

export type ExtractChainErrorType = ErrorType;

export function extractChain<
  const chains extends readonly Chain[],
  networkId extends chains[number]["id"]
>({
  chains,
  id,
}: ExtractChainParameters<chains, networkId>): ExtractChainReturnType<
  chains,
  networkId
> {
  return chains.find((chain) => chain.id === id) as ExtractChainReturnType<
    chains,
    networkId
  >;
}
