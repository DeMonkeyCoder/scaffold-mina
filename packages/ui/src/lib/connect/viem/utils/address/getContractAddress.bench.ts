import { getCreateAddress } from "ethers";
import { bench, describe } from "vitest";

import { getContractAddress } from "./getContractAddress";

describe.skip("Get Contract Address (CREATE)", () => {
  bench("@/lib/connect/viem: getContractAddress", () => {
    getContractAddress({
      from: "0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b",
      nonce: 69420n,
    });
  });

  bench("ethers: getContractAddress", () => {
    getCreateAddress({
      from: "0xc961145a54C96E3aE9bAA048c4F4D6b04C13916b",
      nonce: 69420n,
    });
  });
});
