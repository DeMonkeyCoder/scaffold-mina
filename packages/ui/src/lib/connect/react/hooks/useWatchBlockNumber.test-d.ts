import { createConfig } from "@/lib/connect/core/exports";
import { http, webSocket } from "@/lib/connect/viem";
import { mainnet, optimism } from "@/lib/connect/viem/chains";
import { expectTypeOf, test } from "vitest";

import {
  type UseWatchBlockNumberParameters,
  useWatchBlockNumber,
} from "./useWatchBlockNumber";

test("default", () => {
  useWatchBlockNumber({
    poll: false,
    onBlockNumber() {},
  });
});

test("differing transports", () => {
  const config = createConfig({
    chains: [mainnet, optimism],
    transports: {
      [mainnet.id]: http(),
      [optimism.id]: webSocket(),
    },
  });

  type Result = UseWatchBlockNumberParameters<
    typeof config,
    typeof mainnet.id | typeof optimism.id
  >;
  expectTypeOf<Result["poll"]>().toEqualTypeOf<boolean | undefined>();
  useWatchBlockNumber({
    config,
    poll: false,
    onBlockNumber() {},
  });

  type Result2 = UseWatchBlockNumberParameters<
    typeof config,
    typeof mainnet.id
  >;
  expectTypeOf<Result2["poll"]>().toEqualTypeOf<true | undefined>();
  useWatchBlockNumber({
    config,
    chainId: mainnet.id,
    poll: true,
    onBlockNumber() {},
  });
  useWatchBlockNumber({
    config,
    chainId: mainnet.id,
    // @ts-expect-error
    poll: false,
    onBlockNumber() {},
  });

  type Result3 = UseWatchBlockNumberParameters<
    typeof config,
    typeof optimism.id
  >;
  expectTypeOf<Result3["poll"]>().toEqualTypeOf<boolean | undefined>();
  useWatchBlockNumber({
    config,
    chainId: optimism.id,
    poll: true,
    onBlockNumber() {},
  });
  useWatchBlockNumber({
    config,
    chainId: optimism.id,
    poll: false,
    onBlockNumber() {},
  });
});
