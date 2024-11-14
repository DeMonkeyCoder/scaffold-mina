import { accounts, chain, config } from "@wagmi/test";
import { expect, test } from "vitest";

import { mock } from "../connectors/mock";
import { connect } from "./connect";
import { disconnect } from "./disconnect";
import { getAccount } from "./getAccount";
import { switchChain } from "./switchChain";

const connector = config.connectors[0]!;

test("default", async () => {
  await connect(config, { connector });

  const chainId1 = getAccount(config).chainId;

  await switchChain(config, { chainId: chain.mainnet2.id });

  const chainId2 = getAccount(config).chainId;
  expect(chainId2).toBeDefined();
  expect(chainId1).not.toBe(chainId2);

  await switchChain(config, { chainId: chain.mainnet.id });

  const chainId3 = getAccount(config).chainId;
  expect(chainId3).toBeDefined();
  expect(chainId1).toBe(chainId3);

  await disconnect(config, { connector });
});

test("behavior: user rejected request", async () => {
  const connector_ = config._internal.connectors.setup(
    mock({
      accounts,
      features: { switchChainError: true },
    })
  );
  await connect(config, { connector: connector_ });
  await expect(switchChain(config, { chainId: chain.mainnet.id })).rejects
    .toMatchInlineSnapshot(`
    [UserRejectedRequestError: User rejected the request.

    Details: Failed to switch chain.
    Version: @/lib/connect/viem@2.17.0]
  `);
  await disconnect(config, { connector: connector_ });
});

test("behavior: not supported", async () => {
  const { switchChain: _, ...connector_ } = config._internal.connectors.setup(
    mock({ accounts })
  );
  await connect(config, { connector: connector_ });
  await expect(switchChain(config, { chainId: chain.mainnet.id })).rejects
    .toMatchInlineSnapshot(`
    [SwitchChainNotSupportedError: "Mock Connector" does not support programmatic chain switching.

    Version: @/lib/connect/core/exports@x.y.z]
  `);
  await disconnect(config, { connector: connector_ });
});

test("behavior: not connected", async () => {
  const chainId = config.state.chainId;
  expect(config.state.chainId).toMatchInlineSnapshot("1");
  await switchChain(config, { chainId: chain.mainnet2.id });
  expect(config.state.chainId).toMatchInlineSnapshot("456");
  await switchChain(config, { chainId });
  expect(config.state.chainId).toMatchInlineSnapshot("1");
});
