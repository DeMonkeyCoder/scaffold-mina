import type { Address } from "@/lib/connect/viem";
import type { Client } from "../../../clients/createClient";
import type { Transport } from "../../../clients/transports/createTransport";
import type { ErrorType } from "../../../errors/utils";
import type { RequestErrorType } from "../../../utils/buildRequest";

export type GetSupportedEntryPointsReturnType = readonly Address[];
export type GetSupportedEntryPointsErrorType = RequestErrorType | ErrorType;

/**
 * Returns the EntryPoints that the bundler supports.
 *
 * - Docs: https://viem.sh/actions/bundler/getSupportedEntryPoints
 *
 * @param client - Client to use
 * @param parameters - {@link GetSupportedEntryPointsParameters}
 * @returns Supported Entry Points. {@link GetSupportedEntryPointsReturnType}
 *
 * @example
 * import { createBundlerClient, http, parseEther } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getSupportedEntryPoints } from 'viem/actions'
 *
 * const bundlerClient = createBundlerClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 *
 * const addresses = await getSupportedEntryPoints(bundlerClient)
 */
export function getSupportedEntryPoints(client: Client<Transport>) {
  return client.request({ method: "mina_supportedEntryPoints" });
}
