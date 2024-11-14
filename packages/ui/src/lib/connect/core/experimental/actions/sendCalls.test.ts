import { accounts, config } from "@wagmi/test";
import { parseEther } from "@/lib/connect/viem";
import { expect, test } from "vitest";

import { connect } from "../../actions/connect";
import { disconnect } from "../../actions/disconnect";
import { sendCalls } from "./sendCalls";

const connector = config.connectors[0]!;

test("default", async () => {
  await connect(config, { connector });
  await expect(
    sendCalls(config, {
      calls: [
        {
          data: "0xdeadbeef",
          to: accounts[1],
          value: parseEther("1"),
        },
        {
          to: accounts[2],
          value: parseEther("2"),
        },
        {
          to: accounts[3],
          value: parseEther("3"),
        },
      ],
    })
  ).resolves.toMatchInlineSnapshot(
    '"0x5dedb5a4ff8968db37459b52b83cbdc92b01c9c709c9cff26e345ef5cf27f92e"'
  );
  await disconnect(config, { connector });
});

test("behavior: not connected", async () => {
  await expect(
    sendCalls(config, {
      calls: [
        {
          to: accounts[1],
          value: parseEther("1"),
        },
        {
          to: accounts[2],
          value: parseEther("2"),
        },
        {
          to: accounts[3],
          value: parseEther("3"),
        },
      ],
    })
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [ConnectorNotConnectedError: Connector not connected.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
});

test("behavior: account does not exist on connector", async () => {
  await connect(config, { connector });
  await expect(
    sendCalls(config, {
      account: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
      calls: [
        {
          to: accounts[1],
          value: parseEther("1"),
        },
        {
          to: accounts[2],
          value: parseEther("2"),
        },
        {
          to: accounts[3],
          value: parseEther("3"),
        },
      ],
    })
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [ConnectorAccountNotFoundError: Account "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e" not found for connector "Mock Connector".

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  await disconnect(config, { connector });
});
