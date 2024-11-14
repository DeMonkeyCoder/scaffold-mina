import { solidityPacked } from "ethers";
import { bench, describe } from "vitest";

import { address } from "~test/src/constants";

import { encodePacked } from "./encodePacked";

describe("Encode Packed ABI", () => {
  bench("@/lib/connect/viem: `encodePacked`", () => {
    encodePacked(
      ["address", "string", "bytes4[]"],
      [address.vitalik, "hello world", ["0xdeadbeef", "0xcafebabe"]]
    );
  });

  bench("ethers: `solidityPacked`", () => {
    solidityPacked(
      ["address", "string", "bytes4[]"],
      [address.vitalik, "hello world", ["0xdeadbeef", "0xcafebabe"]]
    );
  });
});
