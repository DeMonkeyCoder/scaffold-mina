import { config } from "@wagmi/test";
import { expect, test } from "vitest";

import {
  ProviderNotFoundError,
  SwitchChainNotSupportedError,
} from "./connector";

test("constructors", () => {
  expect(new ProviderNotFoundError()).toMatchInlineSnapshot(`
    [ProviderNotFoundError: Provider not found.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  expect(
    new SwitchChainNotSupportedError({
      connector: config.connectors[0]!,
    })
  ).toMatchInlineSnapshot(`
    [SwitchChainNotSupportedError: "Mock Connector" does not support programmatic chain switching.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
});
