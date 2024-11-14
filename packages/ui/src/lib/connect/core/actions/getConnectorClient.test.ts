import { address, config } from "@wagmi/test";
import { expect, test } from "vitest";

import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { getConnectorClient } from "./getConnectorClient";

const connector = config.connectors[0]!;

test("default", async () => {
  await connect(config, { connector });
  await expect(getConnectorClient(config)).resolves.toBeDefined();
  await disconnect(config, { connector });
});

test("parameters: connector", async () => {
  const connector2 = config.connectors[1]!;
  await connect(config, { connector });
  await connect(config, { connector: connector2 });
  await expect(
    getConnectorClient(config, { connector })
  ).resolves.toBeDefined();
  await disconnect(config, { connector });
  await disconnect(config, { connector: connector2 });
});

test.todo("custom connector client");

test("behavior: account address is checksummed", async () => {
  await connect(config, { connector });
  const account = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  const client = await getConnectorClient(config, { account });
  expect(client.account.address).toMatchInlineSnapshot(
    '"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"'
  );
  expect(client.account.address).not.toBe(account);
  await disconnect(config, { connector });
});

test("behavior: not connected", async () => {
  await expect(getConnectorClient(config)).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    [ConnectorNotConnectedError: Connector not connected.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
});

test("behavior: connector is on different chain", async () => {
  await connect(config, { chainId: 1, connector });
  config.setState((state) => {
    const uid = state.current!;
    const connection = state.connections.get(uid)!;
    return {
      ...state,
      connections: new Map(state.connections).set(uid, {
        ...connection,
        chainId: 456,
      }),
    };
  });
  await expect(getConnectorClient(config, { account: address.usdcHolder }))
    .rejects.toThrowErrorMatchingInlineSnapshot(`
    [ConnectorChainMismatchError: The current chain of the connector (id: 1) does not match the connection's chain (id: 456).

    Current Chain ID:  1
    Expected Chain ID: 456

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  await disconnect(config, { connector });
});

test("behavior: account does not exist on connector", async () => {
  await connect(config, { connector });
  await expect(getConnectorClient(config, { account: address.usdcHolder }))
    .rejects.toThrowErrorMatchingInlineSnapshot(`
    [ConnectorAccountNotFoundError: Account "0x5414d89a8bF7E99d732BC52f3e6A3Ef461c0C078" not found for connector "Mock Connector".

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  await disconnect(config, { connector });
});
