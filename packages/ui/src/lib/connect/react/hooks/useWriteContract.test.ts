import { connect, disconnect } from "@/lib/connect/core/exports";
import { abi, address, config } from "@wagmi/test";
import { renderHook, waitFor } from "@wagmi/test/react";
import { expect, test } from "vitest";

import { useWriteContract } from "./useWriteContract";

const connector = config.connectors[0]!;

test("default", async () => {
  await connect(config, { connector });

  const { result } = renderHook(() => useWriteContract());

  result.current.writeContract({
    abi: abi.wagmiMintExample,
    address: address.wagmiMintExample,
    functionName: "mint",
  });
  await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

  expect(result.current.data).toBeDefined();

  await disconnect(config, { connector });
});
