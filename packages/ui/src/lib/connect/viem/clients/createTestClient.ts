import type { Address } from "@/lib/connect/viem";

import type { Account } from "../accounts/types";
import type { ErrorType } from "../errors/utils";
import type { ParseAccount } from "../types/account";
import type { Chain } from "../types/chain";
import type { RpcSchema, TestRpcSchema } from "../types/eip1193";
import type { Prettify } from "../types/utils";
import {
  type Client,
  type ClientConfig,
  type CreateClientErrorType,
  createClient,
} from "./createClient";
import { type TestActions, testActions } from "./decorators/test";
import type { Transport } from "./transports/createTransport";

export type TestClientMode = "anvil" | "hardhat" | "ganache";

export type TestClientConfig<
  mode extends TestClientMode = TestClientMode,
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | Address | undefined =
    | Account
    | Address
    | undefined,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  Pick<
    ClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    | "account"
    | "cacheTime"
    | "chain"
    | "key"
    | "name"
    | "pollingInterval"
    | "rpcSchema"
    | "transport"
  > & {
    /** Mode of the test client. */
    mode: mode | ("anvil" | "hardhat" | "ganache"); // TODO: Type utility that expands `TestClientMode`
  }
>;

export type TestClient<
  mode extends TestClientMode = TestClientMode,
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
  includeActions extends boolean = true,
  rpcSchema extends RpcSchema | undefined = undefined
> = Prettify<
  { mode: mode } & Client<
    transport,
    chain,
    account,
    rpcSchema extends RpcSchema
      ? [...TestRpcSchema<mode>, ...rpcSchema]
      : TestRpcSchema<mode>,
    includeActions extends true ? TestActions : Record<string, unknown>
  >
>;

export type CreateTestClientErrorType = CreateClientErrorType | ErrorType;

/**
 * @description Creates a test client with a given transport.
 */
/**
 * Creates a Test Client with a given [Transport](https://viem.sh/docs/clients/intro) configured for a [Chain](https://viem.sh/docs/clients/chains).
 *
 * - Docs: https://viem.sh/docs/clients/test
 *
 * A Test Client is an interface to "test" JSON-RPC API methods accessible through a local Ethereum test node such as [Anvil](https://book.getfoundry.sh/anvil/) or [Hardhat](https://hardhat.org/) such as mining blocks, impersonating accounts, setting fees, etc through [Test Actions](https://viem.sh/docs/actions/test/introduction).
 *
 * @param config - {@link TestClientConfig}
 * @returns A Test Client. {@link TestClient}
 *
 * @example
 * import { createTestClient, custom } from 'viem'
 * import { foundry } from 'viem/chains'
 *
 * const client = createTestClient({
 *   mode: 'anvil',
 *   chain: foundry,
 *   transport: http(),
 * })
 */
export function createTestClient<
  mode extends "anvil" | "hardhat" | "ganache", // TODO: Type utility that expands `TestClientMode`
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined
>(
  parameters: TestClientConfig<
    mode,
    transport,
    chain,
    accountOrAddress,
    rpcSchema
  >
): TestClient<
  mode,
  transport,
  chain,
  ParseAccount<accountOrAddress>,
  true,
  rpcSchema
>;

export function createTestClient(parameters: TestClientConfig): TestClient {
  const { key = "test", name = "Test Client", mode } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    type: "testClient",
  });
  return client.extend((config) => ({
    mode,
    ...testActions({ mode })(config),
  }));
}
