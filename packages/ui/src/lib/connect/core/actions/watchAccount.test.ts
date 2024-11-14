import { config } from "@wagmi/test";
import type { Address } from "@/lib/connect/viem";
import { expect, test } from "vitest";

import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { watchAccount } from "./watchAccount";

test("default", async () => {
  const accounts: { address: Address | undefined; status: string }[] = [];
  const unwatch = watchAccount(config, {
    onChange(data) {
      accounts.push({ address: data.address, status: data.status });
    },
  });

  await connect(config, { connector: config.connectors[0]! });
  await disconnect(config);

  expect(accounts).toMatchInlineSnapshot(`
      [
        {
          "address": undefined,
          "status": "connecting",
        },
        {
          "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "status": "connected",
        },
        {
          "address": undefined,
          "status": "disconnected",
        },
      ]
    `);

  unwatch();
});
