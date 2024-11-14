import { config } from "@wagmi/test";
import { expect, test } from "vitest";

import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { getWalletClient } from "./getWalletClient";

const connector = config.connectors[0]!;

test("default", async () => {
  await connect(config, { connector });
  await expect(getWalletClient(config)).resolves.toBeDefined();
  await disconnect(config, { connector });
});

test("behavior: not connected", async () => {
  await expect(getWalletClient(config)).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    [ConnectorNotConnectedError: Connector not connected.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
});
