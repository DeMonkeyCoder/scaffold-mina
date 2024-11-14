import type {
  Chain,
  mainnet,
  optimism,
  sepolia,
} from "@/lib/connect/viem/chains";
import { expectTypeOf, test } from "vitest";

import type { Config } from "../createConfig";
import type { SelectChains } from "./chain";
import type { Merge } from "./utils";

test("not narrowable", () => {
  type Result = SelectChains<Config, number>;
  expectTypeOf<Result>().toEqualTypeOf<readonly [Chain]>();
});

test("chainId", () => {
  type Result = SelectChains<
    Config<readonly [typeof mainnet, typeof optimism]>,
    1
  >;
  expectTypeOf<Result>().toEqualTypeOf<readonly [typeof mainnet]>();
});

test("at least one chain has formatters", () => {
  type Result = SelectChains<
    Config<readonly [typeof mainnet, typeof optimism]>
  >;
  expectTypeOf<Result>().toEqualTypeOf<
    readonly [typeof mainnet, typeof optimism]
  >();
});

test("no formatters", () => {
  type Result = SelectChains<Config<readonly [typeof mainnet, typeof sepolia]>>;
  expectTypeOf<Result>().toEqualTypeOf<
    readonly [Merge<Chain, { id: typeof mainnet.id | typeof sepolia.id }>]
  >();
});
