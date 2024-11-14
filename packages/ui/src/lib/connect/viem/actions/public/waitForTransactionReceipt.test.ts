import { describe, expect, test, vi } from "vitest";

import { accounts } from "~test/src/constants";
import { WaitForTransactionReceiptTimeoutError } from "../../errors/transaction";
import { hexToNumber } from "../../utils/encoding/fromHex";
import { parseEther } from "../../utils/unit/parseEther";
import { parseGwei } from "../../utils/unit/parseGwei";
import { wait } from "../../utils/wait";
import { mine } from "../test/mine";
import { sendTransaction } from "../wallet/sendTransaction";

import { anvilMainnet } from "../../../test/src/anvil";

import { setIntervalMining } from "../index";
import * as getBlock from "./getBlock";
import { waitForTransactionReceipt } from "./waitForTransactionReceipt";

const client = anvilMainnet.getClient();

const sourceAccount = accounts[0];
const targetAccount = accounts[1];

async function setup() {
  await setIntervalMining(client, { interval: 1 });
}

test("waits for transaction (send -> wait -> mine)", async () => {
  setup();

  const hash = await sendTransaction(client, {
    account: sourceAccount.address,
    to: targetAccount.address,
    value: parseEther("1"),
  });
  const { status } = await waitForTransactionReceipt(client, {
    hash,
  });
  expect(status).toBe("success");
});

test("waits for transaction (send -> mine -> wait)", async () => {
  setup();

  const hash = await sendTransaction(client, {
    account: sourceAccount.address,
    to: targetAccount.address,
    value: parseEther("1"),
  });
  await mine(client, { blocks: 1 });
  const { status } = await waitForTransactionReceipt(client, {
    hash,
  });
  expect(status).toBe("success");
});

test("waits for transaction (multiple waterfall)", async () => {
  setup();

  const hash = await sendTransaction(client, {
    account: sourceAccount.address,
    to: targetAccount.address,
    value: parseEther("1"),
  });
  const receipt_1 = await waitForTransactionReceipt(client, {
    hash,
  });
  const receipt_2 = await waitForTransactionReceipt(client, {
    hash,
  });
  const receipt_3 = await waitForTransactionReceipt(client, {
    hash,
  });
  const receipt_4 = await waitForTransactionReceipt(client, {
    hash,
  });
  expect(receipt_1).toEqual(receipt_2);
  expect(receipt_2).toEqual(receipt_3);
  expect(receipt_3).toEqual(receipt_4);
});

test("waits for transaction (multiple parallel)", async () => {
  setup();

  const hash = await sendTransaction(client, {
    account: sourceAccount.address,
    to: targetAccount.address,
    value: parseEther("1"),
  });
  const [receipt_1, receipt_2, receipt_3, receipt_4] = await Promise.all([
    waitForTransactionReceipt(client, {
      hash,
    }),
    waitForTransactionReceipt(client, {
      hash,
    }),
    waitForTransactionReceipt(client, {
      hash,
    }),
    waitForTransactionReceipt(client, {
      hash,
    }),
  ]);
  expect(receipt_1).toEqual(receipt_2);
  expect(receipt_2).toEqual(receipt_3);
  expect(receipt_3).toEqual(receipt_4);
});

describe("replaced transactions", () => {
  test("repriced", async () => {
    setup();

    await mine(client, { blocks: 10 });

    const nonce = hexToNumber(
      (await client.request({
        method: "mina_getTransactionCount",
        params: [sourceAccount.address, "latest"],
      })) ?? "0x0"
    );

    const hash = await sendTransaction(client, {
      account: sourceAccount.address,
      to: targetAccount.address,
      value: parseEther("1"),
      maxFeePerGas: parseGwei("10"),
      nonce,
    });

    let replacement: any;
    const [receipt] = await Promise.all([
      waitForTransactionReceipt(client, {
        hash,
        onReplaced: (replacement_) => (replacement = replacement_),
      }),
      (async () => {
        await wait(100);

        // speed up
        await sendTransaction(client, {
          account: sourceAccount.address,
          to: targetAccount.address,
          value: parseEther("1"),
          nonce,
          maxFeePerGas: parseGwei("20"),
        });
      })(),
    ]);

    expect(receipt !== null).toBeTruthy();
    expect(replacement.reason).toBe("repriced");
    expect(replacement.replacedTransaction).toBeDefined();
    expect(replacement.transaction).toBeDefined();
    expect(replacement.transactionReceipt).toBeDefined();
  });

  test("repriced (skipped blocks)", async () => {
    setup();

    await mine(client, { blocks: 10 });

    const nonce = hexToNumber(
      (await client.request({
        method: "mina_getTransactionCount",
        params: [sourceAccount.address, "latest"],
      })) ?? "0x0"
    );

    const hash = await sendTransaction(client, {
      account: sourceAccount.address,
      to: targetAccount.address,
      value: parseEther("1"),
      maxFeePerGas: parseGwei("10"),
      nonce,
    });

    const [receipt] = await Promise.all([
      waitForTransactionReceipt(client, {
        hash,
      }),
      (async () => {
        await wait(100);

        // speed up
        await sendTransaction(client, {
          account: sourceAccount.address,
          to: targetAccount.address,
          value: parseEther("1"),
          nonce,
          maxFeePerGas: parseGwei("20"),
        });

        await wait(1000);
        await mine(client, { blocks: 5 });
      })(),
    ]);

    expect(receipt !== null).toBeTruthy();
  });

  test("cancelled", async () => {
    setup();

    await mine(client, { blocks: 10 });

    const nonce = hexToNumber(
      (await client.request({
        method: "mina_getTransactionCount",
        params: [sourceAccount.address, "latest"],
      })) ?? "0x0"
    );

    const hash = await sendTransaction(client, {
      account: sourceAccount.address,
      to: targetAccount.address,
      value: parseEther("1"),
      maxFeePerGas: parseGwei("10"),
      nonce,
    });

    let replacement: any;
    const [receipt] = await Promise.all([
      waitForTransactionReceipt(client, {
        hash,
        onReplaced: (replacement_) => (replacement = replacement_),
      }),
      (async () => {
        await wait(100);

        // speed up
        await sendTransaction(client, {
          account: sourceAccount.address,
          to: sourceAccount.address,
          value: parseEther("0"),
          nonce,
          maxFeePerGas: parseGwei("20"),
        });
      })(),
    ]);

    expect(receipt !== null).toBeTruthy();
    expect(replacement.reason).toBe("cancelled");
    expect(replacement.replacedTransaction).toBeDefined();
    expect(replacement.transaction).toBeDefined();
    expect(replacement.transactionReceipt).toBeDefined();
  });

  test("replaced", async () => {
    setup();

    await mine(client, { blocks: 10 });

    const nonce = hexToNumber(
      (await client.request({
        method: "mina_getTransactionCount",
        params: [sourceAccount.address, "latest"],
      })) ?? "0x0"
    );

    const hash = await sendTransaction(client, {
      account: sourceAccount.address,
      to: targetAccount.address,
      value: parseEther("1"),
      maxFeePerGas: parseGwei("10"),
      nonce,
    });

    let replacement: any;
    const [receipt] = await Promise.all([
      waitForTransactionReceipt(client, {
        hash,
        onReplaced: (replacement_) => (replacement = replacement_),
      }),
      (async () => {
        await wait(100);

        // speed up
        await sendTransaction(client, {
          account: sourceAccount.address,
          to: targetAccount.address,
          value: parseEther("2"),
          nonce,
          maxFeePerGas: parseGwei("20"),
        });
      })(),
    ]);

    expect(receipt !== null).toBeTruthy();
    expect(replacement.reason).toBe("replaced");
    expect(replacement.replacedTransaction).toBeDefined();
    expect(replacement.transaction).toBeDefined();
    expect(replacement.transactionReceipt).toBeDefined();
  });
});

describe("args: confirmations", () => {
  test("waits for confirmations", async () => {
    setup();

    const hash = await sendTransaction(client, {
      account: sourceAccount.address,
      to: targetAccount.address,
      value: parseEther("1"),
      maxFeePerGas: parseGwei("10"),
    });

    const start = Date.now();
    const receipt = await waitForTransactionReceipt(client, {
      hash,
      confirmations: 3,
    });
    const end = Date.now();

    expect(receipt !== null).toBeTruthy();
    expect(end - start).toBeGreaterThan(3000 - 100);
    expect(end - start).toBeLessThanOrEqual(3000 + 100);
  });

  test("waits for confirmations (replaced)", async () => {
    setup();

    await mine(client, { blocks: 10 });

    const nonce = hexToNumber(
      (await client.request({
        method: "mina_getTransactionCount",
        params: [sourceAccount.address, "latest"],
      })) ?? "0x0"
    );

    const hash = await sendTransaction(client, {
      account: sourceAccount.address,
      to: targetAccount.address,
      value: parseEther("1"),
      maxFeePerGas: parseGwei("10"),
      nonce,
    });

    const [receipt] = await Promise.all([
      waitForTransactionReceipt(client, {
        confirmations: 3,
        hash,
      }),
      (async () => {
        await wait(100);

        // speed up
        await sendTransaction(client, {
          account: sourceAccount.address,
          to: targetAccount.address,
          value: parseEther("1"),
          nonce,
          maxFeePerGas: parseGwei("20"),
        });

        await wait(1000);
      })(),
    ]);

    expect(receipt !== null).toBeTruthy();
  });
});

test("args: timeout", async () => {
  setup();

  const hash = await sendTransaction(client, {
    account: sourceAccount.address,
    to: targetAccount.address,
    value: parseEther("1"),
  });
  await expect(() =>
    waitForTransactionReceipt(client, {
      hash,
      timeout: 500,
    })
  ).rejects.toThrowError(WaitForTransactionReceiptTimeoutError);
});

describe("errors", () => {
  test("throws when transaction replaced and getBlock fails", async () => {
    setup();

    vi.spyOn(getBlock, "getBlock").mockRejectedValueOnce(new Error("foo"));

    await mine(client, { blocks: 10 });

    const nonce = hexToNumber(
      (await client.request({
        method: "mina_getTransactionCount",
        params: [sourceAccount.address, "latest"],
      })) ?? "0x0"
    );

    const hash = await sendTransaction(client, {
      account: sourceAccount.address,
      to: targetAccount.address,
      value: parseEther("1"),
      maxFeePerGas: parseGwei("10"),
      nonce,
    });

    await expect(() =>
      Promise.all([
        waitForTransactionReceipt(client, {
          hash,
        }),
        (async () => {
          await wait(100);

          // speed up
          await sendTransaction(client, {
            account: sourceAccount.address,
            to: targetAccount.address,
            value: parseEther("2"),
            nonce,
            maxFeePerGas: parseGwei("20"),
          });
        })(),
      ])
    ).rejects.toThrowErrorMatchingInlineSnapshot("[Error: foo]");
  });
});
