import { stripZerosLeft } from "ethers";

import { bench, describe } from "vitest";

import { trim } from "./trim";

describe.skip("Trim Hex", () => {
  bench("@/lib/connect/viem: `trimHex`", () => {
    trim("0x00000000000000000000000a4e12a45");
  });

  bench("ethers: `stripZerosLeft`", () => {
    stripZerosLeft("0x00000000000000000000000a4e12a45a");
  });
});

describe.skip("Trim Bytes", () => {
  bench("@/lib/connect/viem: `trimBytes`", () => {
    trim(
      new Uint8Array([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 122, 51, 123,
      ])
    );
  });

  bench("ethers: `stripZerosLeft`", () => {
    stripZerosLeft(
      new Uint8Array([
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 122, 51,
        123,
      ])
    );
  });
});
