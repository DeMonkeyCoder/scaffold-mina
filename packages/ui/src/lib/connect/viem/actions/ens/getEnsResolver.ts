import type { Address } from "@/lib/connect/viem";

import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { ErrorType } from "../../errors/utils";
import type { Chain } from "../../types/chain";
import type { Prettify } from "../../types/utils";
import {
  type GetChainContractAddressErrorType,
  getChainContractAddress,
} from "../../utils/chain/getChainContractAddress";
import { type ToHexErrorType, toHex } from "../../utils/encoding/toHex";
import {
  type PacketToBytesErrorType,
  packetToBytes,
} from "../../utils/ens/packetToBytes";
import { getAction } from "../../utils/getAction";
import {
  type ReadContractParameters,
  readContract,
} from "../public/readContract";

export type GetEnsResolverParameters = Prettify<
  Pick<ReadContractParameters, "blockNumber" | "blockTag"> & {
    /** Name to get the address for. */
    name: string;
    /** Address of ENS Universal Resolver Contract. */
    universalResolverAddress?: Address | undefined;
  }
>;

export type GetEnsResolverReturnType = Address;

export type GetEnsResolverErrorType =
  | GetChainContractAddressErrorType
  | ToHexErrorType
  | PacketToBytesErrorType
  | ErrorType;

/**
 * Gets resolver for ENS name.
 *
 * - Docs: https://viem.sh/docs/ens/actions/getEnsResolver
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/ens
 *
 * Calls `findResolver(bytes)` on ENS Universal Resolver Contract to retrieve the resolver of an ENS name.
 *
 * Since ENS names prohibit certain forbidden characters (e.g. underscore) and have other validation rules, you likely want to [normalize ENS names](https://docs.ens.domains/contract-api-reference/name-processing#normalising-names) with [UTS-46 normalization](https://unicode.org/reports/tr46) before passing them to `getEnsAddress`. You can use the built-in [`normalize`](https://viem.sh/docs/ens/utilities/normalize) function for this.
 *
 * @param client - Client to use
 * @param parameters - {@link GetEnsResolverParameters}
 * @returns Address for ENS resolver. {@link GetEnsResolverReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getEnsResolver, normalize } from 'viem/ens'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const resolverAddress = await getEnsResolver(client, {
 *   name: normalize('wevm.eth'),
 * })
 * // '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41'
 */
export async function getEnsResolver<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  {
    blockNumber,
    blockTag,
    name,
    universalResolverAddress: universalResolverAddress_,
  }: GetEnsResolverParameters
) {
  let universalResolverAddress = universalResolverAddress_;
  if (!universalResolverAddress) {
    if (!client.chain)
      throw new Error(
        "client chain not configured. universalResolverAddress is required."
      );

    universalResolverAddress = getChainContractAddress({
      blockNumber,
      chain: client.chain,
      contract: "ensUniversalResolver",
    });
  }

  const [resolverAddress] = await getAction(
    client,
    readContract,
    "readContract"
  )({
    address: universalResolverAddress,
    abi: [
      {
        inputs: [{ type: "bytes" }],
        name: "findResolver",
        outputs: [{ type: "address" }, { type: "bytes32" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "findResolver",
    args: [toHex(packetToBytes(name))],
    blockNumber,
    blockTag,
  });
  return resolverAddress;
}
