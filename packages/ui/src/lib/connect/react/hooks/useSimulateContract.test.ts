import { connect, disconnect } from "@/lib/connect/core/exports";
import { abi, address, config, wait } from "@wagmi/test";
import { renderHook, waitFor } from "@wagmi/test/react";
import { expect, test } from "vitest";

import { useSimulateContract } from "./useSimulateContract";

const connector = config.connectors[0]!;

test("default", async () => {
  await connect(config, { connector });

  const { result } = renderHook(() =>
    useSimulateContract({
      address: address.wagmiMintExample,
      abi: abi.wagmiMintExample,
      functionName: "mint",
    })
  );

  await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

  expect(result.current).toMatchInlineSnapshot(`
    {
      "data": {
        "chainId": 1,
        "request": {
          "__mode": "prepared",
          "abi": [
            {
              "inputs": [],
              "name": "mint",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function",
            },
          ],
          "account": {
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "type": "json-rpc",
          },
          "address": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
          "args": undefined,
          "chainId": 1,
          "dataSuffix": undefined,
          "functionName": "mint",
        },
        "result": undefined,
      },
      "dataUpdatedAt": 1675209600000,
      "error": null,
      "errorUpdateCount": 0,
      "errorUpdatedAt": 0,
      "failureCount": 0,
      "failureReason": null,
      "fetchStatus": "idle",
      "isError": false,
      "isFetched": true,
      "isFetchedAfterMount": true,
      "isFetching": false,
      "isInitialLoading": false,
      "isLoading": false,
      "isLoadingError": false,
      "isPaused": false,
      "isPending": false,
      "isPlaceholderData": false,
      "isRefetchError": false,
      "isRefetching": false,
      "isStale": true,
      "isSuccess": true,
      "queryKey": [
        "simulateContract",
        {
          "account": {
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "type": "json-rpc",
          },
          "address": "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
          "chainId": 1,
          "functionName": "mint",
        },
      ],
      "refetch": [Function],
      "status": "success",
    }
  `);

  await disconnect(config, { connector });
});

test("behavior: disabled when properties missing", async () => {
  const { result } = renderHook(() => useSimulateContract());

  await wait(100);
  await waitFor(() => expect(result.current.isPending).toBeTruthy());
});
