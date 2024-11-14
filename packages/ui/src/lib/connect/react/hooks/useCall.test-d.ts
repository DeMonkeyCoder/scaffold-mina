import type { CallReturnType } from "@/lib/connect/viem";
import { expectTypeOf, test } from "vitest";
import { useCall } from "./useCall";

test("select data", () => {
  const result = useCall({
    query: {
      select(data) {
        return data;
      },
    },
  });
  expectTypeOf(result.data).toEqualTypeOf<CallReturnType | undefined>();
});
