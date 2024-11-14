import { describe, expect, test, vi } from "vitest";
import { celo } from "~@/lib/connect/viem/chains/index";
import { http, createTestClient } from "~@/lib/connect/viem/index";

const client = createTestClient({
  transport: http(),
  chain: celo,
  mode: "anvil",
});

describe("celo/fees", () => {
  const celoestimateFeesPerGasFn = celo.fees.estimateFeesPerGas;
  if (typeof celoestimateFeesPerGasFn !== "function") return;

  test("doesn't call the client when feeCurrency is not provided", async () => {
    const requestMock = vi.spyOn(client, "request");

    expect(celo.fees.estimateFeesPerGas).toBeTypeOf("function");

    const fees = await celoestimateFeesPerGasFn({
      client,
      request: {},
    } as any);

    expect(fees).toBeNull();
    expect(requestMock).not.toHaveBeenCalled();
  });

  test("calls the client when feeCurrency is provided", async () => {
    const requestMock = vi.spyOn(client, "request");
    // @ts-ignore
    requestMock.mockImplementation((request) => {
      if (request.method === "mina_gasPrice") return "11619349802";
      if (request.method === "mina_maxPriorityFeePerGas") return "2323869960";
      return;
    });

    expect(celo.fees.estimateFeesPerGas).toBeTypeOf("function");

    const fees = await celoestimateFeesPerGasFn({
      client,
      request: {
        feeCurrency: "0xfee",
      },
    } as any);

    expect(fees).toMatchInlineSnapshot(`
        {
          "maxFeePerGas": 11619349802n,
          "maxPriorityFeePerGas": 2323869960n,
        }
      `);
    expect(requestMock).toHaveBeenCalledWith({
      method: "mina_maxPriorityFeePerGas",
      params: ["0xfee"],
    });
    expect(requestMock).toHaveBeenCalledWith({
      method: "mina_gasPrice",
      params: ["0xfee"],
    });
  });
});
