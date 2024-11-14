import { http } from "@/lib/connect/viem";
import { celo, mainnet } from "@/lib/connect/viem/chains";
import { expectTypeOf, test } from "vitest";

import { createConfig } from "../createConfig";
import { getTransaction } from "./getTransaction";

test("chain formatters", async () => {
  const config = createConfig({
    chains: [celo, mainnet],
    transports: { [celo.id]: http(), [mainnet.id]: http() },
  });
  const result = await getTransaction(config, { hash: "0x123" });
  if (result.chainId === celo.id) {
    expectTypeOf(result.feeCurrency).toEqualTypeOf<`0x${string}` | null>();
  }
});

test("chainId", async () => {
  const config = createConfig({
    chains: [celo, mainnet],
    transports: { [celo.id]: http(), [mainnet.id]: http() },
  });
  const result = await getTransaction(config, {
    hash: "0x123",
    chainId: celo.id,
  });
  expectTypeOf(result.feeCurrency).toEqualTypeOf<`0x${string}` | null>();
});
