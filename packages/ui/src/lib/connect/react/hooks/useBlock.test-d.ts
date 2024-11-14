import { http, createConfig, webSocket } from "@/lib/connect/core/exports";
import { mainnet, optimism } from "@/lib/connect/core/exports/chains";
import { expectTypeOf, test } from "vitest";

import { useBlock } from "./useBlock";

test("select data", () => {
  const result = useBlock({
    query: {
      select(data) {
        return data?.number;
      },
    },
  });
  expectTypeOf(result.data).toEqualTypeOf<bigint | undefined>();
});

test("differing transports", () => {
  const config = createConfig({
    chains: [mainnet, optimism],
    transports: {
      [mainnet.id]: http(),
      [optimism.id]: webSocket(),
    },
  });

  useBlock({
    config,
    watch: {
      poll: false,
    },
  });

  useBlock({
    config,
    chainId: mainnet.id,
    watch: {
      poll: true,
    },
  });
  useBlock({
    config,
    chainId: mainnet.id,
    watch: {
      // @ts-expect-error
      poll: false,
    },
  });

  useBlock({
    config,
    chainId: optimism.id,
    watch: {
      poll: true,
    },
  });
  useBlock({
    config,
    chainId: optimism.id,
    watch: {
      poll: false,
    },
  });
});
