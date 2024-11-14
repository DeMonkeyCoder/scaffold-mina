import { chain, config } from "@wagmi/test";
import type { Chain } from "@/lib/connect/viem";
import { expectTypeOf, test } from "vitest";

import { usePublicClient } from "./usePublicClient.js";

test("default", () => {
  const client = usePublicClient({ config });
  expectTypeOf(client.chain).toEqualTypeOf<(typeof config)["chains"][number]>();
  expectTypeOf(client.transport.type).toEqualTypeOf<"http">();
});

test("parameters: chainId", () => {
  const client = usePublicClient({
    config,
    chainId: chain.mainnet.id,
  });
  expectTypeOf(client.chain).toEqualTypeOf<typeof chain.mainnet>();
  expectTypeOf(client.chain).not.toEqualTypeOf<typeof chain.mainnet2>();
  expectTypeOf(client.transport.type).toEqualTypeOf<"http">();
});

test("behavior: unconfigured chain", () => {
  {
    const client = usePublicClient({ chainId: 123456 });
    if (client) {
      expectTypeOf(client.chain).toEqualTypeOf<Chain>();
      expectTypeOf(client.transport.type).toEqualTypeOf<string>();
    } else {
      expectTypeOf(client).toEqualTypeOf<undefined>();
    }
  }

  const client = usePublicClient({
    config,
    // @ts-expect-error
    chainId: 123456,
  });
  expectTypeOf(client).toEqualTypeOf<undefined>();
});
