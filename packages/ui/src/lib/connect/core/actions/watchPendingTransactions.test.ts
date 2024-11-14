import {
  accounts,
  config,
  testClient,
  transactionHashRegex,
  wait,
} from "@wagmi/test";
import { parseEther } from "@/lib/connect/viem";
import type { OnTransactionsParameter } from "@/lib/connect/viem/actions";
import { expect, test } from "vitest";

import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { sendTransaction } from "./sendTransaction";
import { watchPendingTransactions } from "./watchPendingTransactions";

const connector = config.connectors[0]!;

test("default", async () => {
  await connect(config, { connector });

  let transactions: OnTransactionsParameter = [];
  const unwatch = watchPendingTransactions(config, {
    onTransactions(next) {
      transactions = [...transactions, ...next];
    },
  });
  await wait(500);

  await sendTransaction(config, {
    to: accounts[1],
    value: parseEther("1"),
  });
  await wait(100);

  await sendTransaction(config, {
    to: accounts[3],
    value: parseEther("1"),
  });
  await wait(100);

  await testClient.mainnet.mine({ blocks: 1 });

  unwatch();
  expect(transactions.length).toBe(2);
  expect(transactions[0]).toMatch(transactionHashRegex);

  await disconnect(config, { connector });
});
