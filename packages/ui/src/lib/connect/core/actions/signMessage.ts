import type { Account, Client } from "@/lib/connect/viem";
import {
  type SignMessageErrorType as viem_SignMessageErrorType,
  type SignMessageParameters as viem_SignMessageParameters,
  type SignMessageReturnType as viem_SignMessageReturnType,
  signMessage as viem_signMessage,
} from "@/lib/connect/viem/actions";

import type { Config } from "../createConfig";
import type { BaseErrorType, ErrorType } from "../errors/base";
import type { ConnectorParameter } from "../types/properties";
import type { Compute } from "../types/utils";
import { getAction } from "../utils/getAction";
import {
  type GetConnectorClientErrorType,
  getConnectorClient,
} from "./getConnectorClient";

export type SignMessageParameters = Compute<
  viem_SignMessageParameters<Account> & ConnectorParameter
>;

export type SignMessageReturnType = viem_SignMessageReturnType;

export type SignMessageErrorType =
  // getConnectorClient()
  | GetConnectorClientErrorType
  // base
  | BaseErrorType
  | ErrorType
  // @/lib/connect/viem
  | viem_SignMessageErrorType;

/** https://wagmi.sh/core/api/actions/signMessage */
export async function signMessage(
  config: Config,
  parameters: SignMessageParameters
): Promise<SignMessageReturnType> {
  const { account, connector, ...rest } = parameters;

  let client: Client;
  if (typeof account === "object" && account.type === "local")
    client = config.getClient();
  else client = await getConnectorClient(config, { account, connector });

  const action = getAction(client, viem_signMessage, "signMessage");
  return action({
    ...rest,
    ...(account ? { account } : {}),
  } as viem_SignMessageParameters<Account>);
}
