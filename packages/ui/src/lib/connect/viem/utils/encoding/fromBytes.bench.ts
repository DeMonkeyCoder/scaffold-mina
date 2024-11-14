import { hexlify, toUtf8String } from "ethers";

import { bench, describe } from "vitest";

import { bytesToString } from "./fromBytes";
import { bytesToHex } from "./toHex";

describe("Bytes to Hex", () => {
  bench("@/lib/connect/viem: `bytesToHex`", () => {
    bytesToHex(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
    );
  });

  bench("ethers: `hexlify`", () => {
    hexlify(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
    );
  });
});

describe("Bytes to String", () => {
  bench("@/lib/connect/viem: `bytesToString`", () => {
    bytesToString(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
    );
  });

  bench("ethers: `toUtf8String`", () => {
    toUtf8String(
      new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
    );
  });
});
