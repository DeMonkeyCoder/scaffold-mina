import {
  type GetEnsResolverErrorType as viem_GetEnsResolverErrorType,
  type GetEnsResolverParameters as viem_GetEnsResolverParameters,
  type GetEnsResolverReturnType as viem_GetEnsResolverReturnType,
  getEnsResolver as viem_getEnsResolver,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { ChainIdParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";

export type GetEnsResolverParameters<config extends Config = Config> = Compute<
  viem_GetEnsResolverParameters & ChainIdParameter<config>
>;

export type GetEnsResolverReturnType = viem_GetEnsResolverReturnType;

export type GetEnsResolverErrorType = viem_GetEnsResolverErrorType;

/** https://wagmi.sh/core/api/actions/getEnsResolver */
export function getEnsResolver<config extends Config>(
  config: config,
  parameters: GetEnsResolverParameters<config>
): Promise<GetEnsResolverReturnType> {
  const { chainId, ...rest } = parameters;
  const client = config.getClient({ chainId });
  const action = getAction(client, viem_getEnsResolver, "getEnsResolver");
  return action(rest);
}
