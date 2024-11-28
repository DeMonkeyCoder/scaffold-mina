import {
  ChainMismatchError,
  type ChainMismatchErrorType,
  ChainNotFoundError,
  type ChainNotFoundErrorType,
} from "../../errors/chain";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";

export type AssertCurrentChainParameters = {
  chain?: Chain | undefined;
  currentNetworkId: string;
};

export type AssertCurrentChainErrorType =
  | ChainNotFoundErrorType
  | ChainMismatchErrorType
  | ErrorType;

export function assertCurrentChain({
  chain,
  currentNetworkId,
}: AssertCurrentChainParameters): void {
  if (!chain) throw new ChainNotFoundError();
  if (currentNetworkId !== chain.id)
    throw new ChainMismatchError({ chain, currentNetworkId });
}
