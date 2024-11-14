import { expectTypeOf, test } from "vitest";

import type { Hex } from "@/lib/connect/viem";
import { useStorageAt } from "./useStorageAt.js";

test("select data", () => {
  const result = useStorageAt({
    query: {
      select(data) {
        return data;
      },
    },
  });
  expectTypeOf(result.data).toEqualTypeOf<Hex | undefined>();
});
