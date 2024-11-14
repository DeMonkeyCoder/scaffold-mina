import { expectTypeOf, test } from "vitest";

import type { Hex } from "@/lib/connect/viem";
import { useBytecode } from "./useBytecode";

test("select data", () => {
  const result = useBytecode({
    query: {
      select(data) {
        return data;
      },
    },
  });
  expectTypeOf(result.data).toEqualTypeOf<Hex | undefined>();
});
