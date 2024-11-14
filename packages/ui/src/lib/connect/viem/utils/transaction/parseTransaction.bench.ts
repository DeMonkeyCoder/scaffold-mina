import { Transaction } from "ethers";

import { bench, describe } from "vitest";

import { accounts } from "~test/src/constants";
import type { TransactionSerializableBase } from "../../types/transaction";
import { parseEther } from "../unit/parseEther";

import { parseTransaction } from "./parseTransaction";
import { serializeTransaction } from "./serializeTransaction";

const base = {
  to: accounts[1].address,
  nonce: 785,
  value: parseEther("1"),
} satisfies TransactionSerializableBase;

const legacy = serializeTransaction(
  { ...base, gasPrice: 1n },
  { r: "0x1", s: "0x2", yParity: 1 }
);
const eip1559 = serializeTransaction(
  { ...base, chainId: 1, maxFeePerGas: 1n },
  { r: "0x1", s: "0x2", yParity: 1 }
);
const eip2930 = serializeTransaction(
  { ...base, chainId: 1, gasPrice: 1n, accessList: [] },
  { r: "0x1", s: "0x2", yParity: 1 }
);

describe("Parse Transaction (Legacy)", () => {
  bench("@/lib/connect/viem: `parseTransaction`", () => {
    parseTransaction(legacy);
  });

  bench("ethers: `Transaction.from`", () => {
    Transaction.from(legacy);
  });
});

describe("Parse Transaction (EIP1559)", () => {
  bench("@/lib/connect/viem: `parseTransaction`", () => {
    parseTransaction(eip1559);
  });

  bench("ethers: `Transaction.from`", () => {
    Transaction.from(eip1559);
  });
});

describe("Parse Transaction (EIP2930)", () => {
  bench("@/lib/connect/viem: `parseTransaction`", () => {
    parseTransaction(eip2930);
  });

  bench("ethers: `Transaction.from`", () => {
    Transaction.from(eip2930);
  });
});
