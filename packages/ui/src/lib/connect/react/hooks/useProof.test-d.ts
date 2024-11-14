import type { GetProofReturnType } from "@/lib/connect/viem";
import { expectTypeOf, test } from "vitest";
import { useProof } from "./useProof";

test("select data", () => {
  const result = useProof({
    query: {
      select(data) {
        return data;
      },
    },
  });
  expectTypeOf(result.data).toEqualTypeOf<GetProofReturnType | undefined>();
});
