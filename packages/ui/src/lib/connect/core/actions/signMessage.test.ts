import { accounts, config, privateKey } from "@wagmi/test";
import { recoverMessageAddress } from "@/lib/connect/viem";
import { privateKeyToAccount } from "@/lib/connect/viem/accounts";
import { expect, test } from "vitest";

import { mock } from "../connectors/mock";
import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { getAccount } from "./getAccount";
import { signMessage } from "./signMessage";

const connector = config.connectors[0]!;

test("default", async () => {
  await connect(config, { connector });
  const signature = await signMessage(config, { message: "foo bar baz" });
  await expect(
    recoverMessageAddress({
      message: "foo bar baz",
      signature,
    })
  ).resolves.toEqual(getAccount(config).address);
  await disconnect(config, { connector });
});

test("behavior: local account", async () => {
  const account = privateKeyToAccount(privateKey);
  const signature = await signMessage(config, {
    account,
    message: "foo bar baz",
  });
  await expect(
    recoverMessageAddress({
      message: "foo bar baz",
      signature,
    })
  ).resolves.toEqual(account.address);
});

test("behavior: user rejected request", async () => {
  const connector_ = config._internal.connectors.setup(
    mock({
      accounts,
      features: { signMessageError: true },
    })
  );
  await connect(config, { connector: connector_ });
  await expect(signMessage(config, { message: "foo bar baz" })).rejects
    .toMatchInlineSnapshot(`
    [UserRejectedRequestError: User rejected the request.

    Details: Failed to sign message.
    Version: @/lib/connect/viem@2.17.0]
  `);
  await disconnect(config, { connector: connector_ });
});

test("behavior: not connected", async () => {
  await expect(signMessage(config, { message: "foo bar baz" })).rejects
    .toMatchInlineSnapshot(`
    [ConnectorNotConnectedError: Connector not connected.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
});
