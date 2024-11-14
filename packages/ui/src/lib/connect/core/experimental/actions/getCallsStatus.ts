import {
  type GetCallsStatusErrorType as viem_GetCallsStatusErrorType,
  type GetCallsStatusParameters as viem_GetCallsStatusParameters,
  type GetCallsStatusReturnType as viem_GetCallsStatusReturnType,
  getCallsStatus as viem_getCallsStatus,
} from "@/lib/connect/viem/experimental";

import { getConnectorClient } from "../../actions/getConnectorClient";
import type { Config } from "../../createConfig";
import type { ConnectorParameter } from "../../types/properties";

export type GetCallsStatusParameters = viem_GetCallsStatusParameters &
  ConnectorParameter;

export type GetCallsStatusReturnType = viem_GetCallsStatusReturnType;

export type GetCallsStatusErrorType = viem_GetCallsStatusErrorType;

/** https://wagmi.sh/core/api/actions/getCallsStatus */
export async function getCallsStatus<config extends Config>(
  config: config,
  parameters: GetCallsStatusParameters
): Promise<GetCallsStatusReturnType> {
  const { connector, id } = parameters;
  const client = await getConnectorClient(config, { connector });
  return viem_getCallsStatus(client, { id });
}
