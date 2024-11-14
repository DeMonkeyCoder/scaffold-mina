import { formatUnits as formatUnitsV6 } from "ethers";
import { bench, describe } from "vitest";

import { formatUnits } from "./formatUnits";

describe("Format Unit", () => {
  bench("@/lib/connect/viem: `formatUnits`", () => {
    formatUnits(40000000000000000000n, 18);
  });

  bench("ethers: `formatUnits`", () => {
    formatUnitsV6(40000000000000000000n, 18);
  });
});
