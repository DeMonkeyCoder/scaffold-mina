import type { typedData } from "@wagmi/test";
import { expectTypeOf, test } from "vitest";

import type { Address } from "@/lib/connect/viem";
import {
  type UseVerifyTypedDataParameters,
  useVerifyTypedData,
} from "./useVerifyTypedData";

test("select data", () => {
  const result = useVerifyTypedData({
    query: {
      select(data) {
        return data;
      },
    },
  });
  expectTypeOf(result.data).toEqualTypeOf<boolean | undefined>();
});

test("UseReadContractParameters", () => {
  type Result = UseVerifyTypedDataParameters<
    typeof typedData.basic.types,
    "Mail"
  >;
  expectTypeOf<Pick<Result, "message" | "primaryType">>().toEqualTypeOf<{
    primaryType?: "Mail" | "Person";
    message?: {
      from: {
        name: string;
        wallet: Address;
      };
      to: {
        name: string;
        wallet: Address;
      };
      contents: string;
    };
  }>();
});
