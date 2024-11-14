import { config } from "@wagmi/test";
import { expect, test } from "vitest";

import {
  ChainNotConfiguredError,
  ConnectorAccountNotFoundError,
  ConnectorAlreadyConnectedError,
  ConnectorChainMismatchError,
  ConnectorNotConnectedError,
  ConnectorNotFoundError,
} from "./config.js";

test("constructors", () => {
  expect(new ChainNotConfiguredError()).toMatchInlineSnapshot(`
    [ChainNotConfiguredError: Chain not configured.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  expect(new ConnectorAlreadyConnectedError()).toMatchInlineSnapshot(`
    [ConnectorAlreadyConnectedError: Connector already connected.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  expect(new ConnectorNotConnectedError()).toMatchInlineSnapshot(`
    [ConnectorNotConnectedError: Connector not connected.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  expect(new ConnectorNotFoundError()).toMatchInlineSnapshot(`
    [ConnectorNotFoundError: Connector not found.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  expect(
    new ConnectorAccountNotFoundError({
      address: "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e",
      connector: config.connectors[0]!,
    })
  ).toMatchInlineSnapshot(`
    [ConnectorAccountNotFoundError: Account "0xA0Cf798816D4b9b9866b5330EEa46a18382f251e" not found for connector "Mock Connector".

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  expect(
    new ConnectorChainMismatchError({
      connectionChainId: 1,
      connectorChainId: 123,
    })
  ).toMatchInlineSnapshot(`
    [ConnectorChainMismatchError: The current chain of the connector (id: 123) does not match the connection's chain (id: 1).

    Current Chain ID:  123
    Expected Chain ID: 1

    Version: @/lib/connect/core/exports@x.y.z]
  `);
});
