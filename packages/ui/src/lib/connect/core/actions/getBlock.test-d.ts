import { http } from "@/lib/connect/viem";
import { celo, mainnet } from "@/lib/connect/viem/chains";
import { expectTypeOf, test } from "vitest";

import { createConfig } from "../createConfig";
import { getBlock } from "./getBlock";

test("chain formatters", async () => {
  const config = createConfig({
    chains: [celo, mainnet],
    transports: { [celo.id]: http(), [mainnet.id]: http() },
  });
  const result = await getBlock(config);
  if (result.chainId === celo.id) {
    expectTypeOf(result.difficulty).toEqualTypeOf<bigint | undefined>();
    expectTypeOf(result.gasLimit).toEqualTypeOf<bigint | undefined>();
    expectTypeOf(result.mixHash).toEqualTypeOf<undefined>();
    expectTypeOf(result.nonce).toEqualTypeOf<`0x${string}`>();
    expectTypeOf(result.uncles).toEqualTypeOf<undefined>();
    expectTypeOf(result.randomness).toEqualTypeOf<
      | {
          committed: `0x${string}`;
          revealed: `0x${string}`;
        }
      | undefined
    >();
  }
});

test("chainId", async () => {
  const config = createConfig({
    chains: [celo, mainnet],
    transports: { [celo.id]: http(), [mainnet.id]: http() },
  });
  const result = await getBlock(config, {
    chainId: celo.id,
  });
  expectTypeOf(result.difficulty).toEqualTypeOf<bigint | undefined>();
  expectTypeOf(result.gasLimit).toEqualTypeOf<bigint | undefined>();
  expectTypeOf(result.mixHash).toEqualTypeOf<undefined>();
  expectTypeOf(result.nonce).toEqualTypeOf<`0x${string}`>();
  expectTypeOf(result.uncles).toEqualTypeOf<undefined>();
  expectTypeOf(result.randomness).toEqualTypeOf<
    | {
        committed: `0x${string}`;
        revealed: `0x${string}`;
      }
    | undefined
  >();
});
