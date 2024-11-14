import { expectTypeOf, test } from "vitest";

import { type Chain, localhost } from "../chains/index";
import type {
  GetBlockReturnType,
  GetTransactionReturnType,
  TransactionReceipt,
  Transport,
} from "../index";
import { rpcSchema } from "./createClient";
import { type PublicClient, createPublicClient } from "./createPublicClient";
import { http } from "./transports/http";

test("with chain", () => {
  const client = createPublicClient({
    chain: localhost,
    transport: http(),
  });
  expectTypeOf(client).toMatchTypeOf<PublicClient>();
  expectTypeOf(client.chain).toEqualTypeOf(localhost);
});

test("without chain", () => {
  const client = createPublicClient({ transport: http() });
  expectTypeOf(client).toMatchTypeOf<PublicClient>();
  expectTypeOf(client.chain).toEqualTypeOf(undefined);
});

test("widened", async () => {
  const client = null as unknown as PublicClient;
  expectTypeOf(client.chain).toEqualTypeOf<Chain | undefined>();

  const block = await client.getBlock();
  expectTypeOf(block).toEqualTypeOf<GetBlockReturnType>();

  const receipt = await client.getTransactionReceipt({ hash: "0x" });
  expectTypeOf(receipt).toEqualTypeOf<TransactionReceipt>();

  const transaction = await client.getTransaction({ hash: "0x" });
  expectTypeOf(transaction).toEqualTypeOf<GetTransactionReturnType>();
});

test("widened (w/ Chain)", async () => {
  const client = null as unknown as PublicClient<Transport, Chain>;
  expectTypeOf(client.chain).toEqualTypeOf<Chain>();

  const block = await client.getBlock();
  expectTypeOf(block).toEqualTypeOf<GetBlockReturnType>();

  const receipt = await client.getTransactionReceipt({ hash: "0x" });
  expectTypeOf(receipt).toEqualTypeOf<TransactionReceipt>();

  const transaction = await client.getTransaction({ hash: "0x" });
  expectTypeOf(transaction).toEqualTypeOf<GetTransactionReturnType>();
});

test("with custom rpc schema", async () => {
  type MockRpcSchema = [
    {
      Method: "mina_wagmi";
      Parameters: [string];
      ReturnType: string;
    }
  ];

  const client = createPublicClient({
    rpcSchema: rpcSchema<MockRpcSchema>(),
    transport: http(),
  });

  expectTypeOf(client).toMatchTypeOf<PublicClient>();

  const result = await client.request({
    method: "mina_wagmi",
    params: ["hello"],
  });
  expectTypeOf(result).toEqualTypeOf<string>();
});
