import { expect, test } from "vitest";
import { anvilMainnet } from "../../../../test/src/anvil";
import { accounts } from "../../../../test/src/constants";
import { mine } from "../../../actions/index";
import { mainnet } from "../../../chains/index";
import { createClient } from "../../../clients/createClient";
import { custom } from "../../../clients/transports/custom";
import { RpcRequestError } from "../../../errors/request";
import type { WalletCallReceipt } from "../../../types/eip1193";
import type { Hex } from "../../../types/misc";
import { getHttpRpcClient, parseEther } from "../../../utils/index";
import { uid } from "../../../utils/uid";
import { getCallsStatus } from "./getCallsStatus";
import { sendCalls } from "./sendCalls";

const testClient = anvilMainnet.getClient();

type Uid = string;
type TxHashes = Hex[];
const calls = new Map<Uid, TxHashes[]>();

const getClient = ({
  onRequest,
}: {
  onRequest({ method, params }: any): void;
}) =>
  createClient({
    transport: custom({
      async request({ method, params }) {
        onRequest({ method, params });

        const rpcClient = getHttpRpcClient(anvilMainnet.rpcUrl.http);

        if (method === "wallet_getCallsStatus") {
          const hashes = calls.get(params[0]);
          if (!hashes) return null;
          const receipts = await Promise.all(
            hashes.map(async (hash) => {
              const { result, error } = await rpcClient.request({
                body: {
                  method: "mina_getTransactionReceipt",
                  params: [hash],
                  id: 0,
                },
              });
              if (error)
                throw new RpcRequestError({
                  body: { method, params },
                  error,
                  url: anvilMainnet.rpcUrl.http,
                });
              return {
                blockHash: result.blockHash,
                blockNumber: result.blockNumber,
                gasUsed: result.gasUsed,
                logs: result.logs,
                status: result.status,
                transactionHash: result.transactionHash,
              } satisfies WalletCallReceipt;
            })
          );
          return { status: "CONFIRMED", receipts };
        }

        if (method === "wallet_sendCalls") {
          const hashes = [];
          for (const call of params[0].calls) {
            const { result, error } = await rpcClient.request({
              body: {
                method: "mina_sendTransaction",
                params: [call],
                id: 0,
              },
            });
            if (error)
              throw new RpcRequestError({
                body: { method, params },
                error,
                url: anvilMainnet.rpcUrl.http,
              });
            hashes.push(result);
          }
          const uid_ = uid();
          calls.set(uid_, hashes);
          return uid_;
        }

        return null;
      },
    }),
  });

test("default", async () => {
  const requests: unknown[] = [];

  const client = getClient({
    onRequest({ params }) {
      requests.push(params);
    },
  });

  const id = await sendCalls(client, {
    account: accounts[0].address,
    calls: [
      {
        to: accounts[1].address,
        value: parseEther("1"),
      },
      {
        to: accounts[2].address,
      },
      {
        data: "0xcafebabe",
        to: accounts[3].address,
        value: parseEther("100"),
      },
    ],
    chain: mainnet,
  });

  expect(id).toBeDefined();

  await mine(testClient, { blocks: 1 });

  const { status, receipts } = await getCallsStatus(client, { id });
  expect(status).toMatchInlineSnapshot(`"CONFIRMED"`);
  expect(receipts!.length).toBe(3);
});
