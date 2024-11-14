import { describe, expect, test, vi } from "vitest";
import { accounts } from "~test/src/constants";
import { privateKeyToAccount } from "~@/lib/connect/viem/accounts/privateKeyToAccount";
import { celo } from "../chains/index";
import {
  createTransport,
  createWalletClient,
  type EIP1193RequestFn,
  type PublicRpcSchema,
  type WalletRpcSchema,
} from "../index";

describe("sendTransaction()", () => {
  // We need a local account
  const account = privateKeyToAccount(accounts[0].privateKey);
  const toAddress = account.address;
  const transactionHash = "0xtransaction-hash";
  const feeCurrencyAddress = "0x0000000000000000000000000000000000000fee";
  const transportRequestMock = vi.fn(async (request) => {
    if (request.method === "mina_networkId") {
      return celo.id;
    }

    if (request.method === "mina_getBlockByNumber") {
      // We just need baseFeePerGas for gas estimation
      return {
        baseFeePerGas: "0x12a05f200",
      };
    }

    if (request.method === "mina_maxPriorityFeePerGas") {
      return 1n;
    }

    if (
      request.method === "mina_gasPrice" &&
      (request.params as string[])[0] === feeCurrencyAddress
    ) {
      return 2n;
    }

    if (request.method === "mina_estimateGas") {
      return 1n;
    }

    if (request.method === "mina_getTransactionCount") {
      return 0;
    }

    if (request.method === "mina_sendRawTransaction") {
      return transactionHash;
    }

    return null;
  }) as EIP1193RequestFn<WalletRpcSchema & PublicRpcSchema>;

  const mockTransport = () =>
    createTransport({
      key: "mock",
      name: "Mock Transport",
      request: transportRequestMock,
      type: "mock",
    });

  const client = createWalletClient({
    transport: mockTransport,
    chain: celo,
    account,
  });

  test("provides valid transaction params to sign for mina_sendRawTransaction (local account) for CIP-64", async () => {
    const hash = await client.sendTransaction({
      value: 1n,
      to: toAddress,
      feeCurrency: feeCurrencyAddress,
      maxFeePerGas: 123n,
      maxPriorityFeePerGas: 123n,
    });

    expect(hash).toEqual(transactionHash);
    expect(transportRequestMock).toHaveBeenLastCalledWith({
      method: "mina_sendRawTransaction",
      params: [
        "0x7bf87782a4ec807b7b0194f39fd6e51aad88f6f4ce6ab8827279cfffb922660180c0940000000000000000000000000000000000000fee01a038c5dfc128d40b147544b13572dbb0462b9389a8a687d0fe32973e435d7de23aa03c01d6bff1279e94f53a1244302de288bd335bc3a1e61da73fd6215f6d67ccf2",
      ],
    });
  });

  test("provides valid transaction params to sign for mina_sendRawTransaction (local account) for CIP-42 - sending as CIP-64", async () => {
    const hash = await client.sendTransaction({
      value: 1n,
      to: toAddress,
      feeCurrency: feeCurrencyAddress,
      gatewayFee: 123n,
      gatewayFeeRecipient: "0x0000000000000000000000000000000000000001",
    });

    expect(hash).toEqual(transactionHash);
    expect(transportRequestMock).toHaveBeenLastCalledWith({
      method: "mina_sendRawTransaction",
      params: [
        "0x7bf87782a4ec8001020194f39fd6e51aad88f6f4ce6ab8827279cfffb922660180c0940000000000000000000000000000000000000fee80a0a3163f9ff91200f4c8000f0217d85d16c329c2f38d48a7b4b70119989e475e57a0555fd5b2a6eac95426e33cd07ca5fec121ad46194611a013001f76bbc4b33136",
      ],
    });
  });
});
