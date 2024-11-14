import { config, testClient, wait } from "@wagmi/test";
import { parseEther } from "@/lib/connect/viem";
import { expect, test } from "vitest";

import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { sendTransaction } from "./sendTransaction";
import { waitForTransactionReceipt } from "./waitForTransactionReceipt";

const connector = config.connectors[0]!;

test("default", async () => {
  await connect(config, { connector });

  const hash = await sendTransaction(config, {
    to: "0xd2135CfB216b74109775236E36d4b433F1DF507B",
    value: parseEther("0.01"),
  });

  await testClient.mainnet.mine({ blocks: 1 });
  await wait(100);

  await expect(
    waitForTransactionReceipt(config, { hash })
  ).resolves.toMatchObject({
    chainId: 1,
    transactionHash: hash,
  });

  await disconnect(config, { connector });
});
