import { http } from "@/lib/connect/viem";
import { mainnet, optimism, sepolia } from "@/lib/connect/viem/chains";
import { expect, test } from "vitest";

import { injected } from "../connectors/injected";
import { unstable_connector } from "../transports/connector";
import { fallback } from "../transports/fallback";
import { extractRpcUrls } from "./extractRpcUrls";

test("default", () => {
  expect(
    extractRpcUrls({
      chain: mainnet,
      transports: {
        [mainnet.id]: fallback([
          http("https://wagmi.com"),
          http("https://lol.com"),
        ]),
        [sepolia.id]: http("https://sepoliarocks.com"),
        [optimism.id]: http(),
      },
    })
  ).toMatchInlineSnapshot(`
    [
      "https://wagmi.com",
      "https://lol.com",
    ]
  `);

  expect(
    extractRpcUrls({
      chain: sepolia,
      transports: {
        [mainnet.id]: fallback([
          http("https://wagmi.com"),
          http("https://lol.com"),
        ]),
        [sepolia.id]: http("https://sepoliarocks.com"),
        [optimism.id]: http(),
      },
    })
  ).toMatchInlineSnapshot(`
    [
      "https://sepoliarocks.com",
    ]
  `);

  expect(
    extractRpcUrls({
      chain: optimism,
      transports: {
        [mainnet.id]: fallback([
          http("https://wagmi.com"),
          http("https://lol.com"),
        ]),
        [sepolia.id]: http("https://sepoliarocks.com"),
        [optimism.id]: http(),
      },
    })
  ).toMatchInlineSnapshot(`
    [
      "https://mainnet.optimism.io",
    ]
  `);

  expect(
    extractRpcUrls({
      chain: mainnet,
    })
  ).toMatchInlineSnapshot(`
    [
      "https://cloudflare-eth.com",
    ]
  `);

  expect(
    extractRpcUrls({
      chain: mainnet,
      transports: {
        [mainnet.id]: fallback([
          unstable_connector(injected),
          http("https://lol.com"),
        ]),
      },
    })
  ).toMatchInlineSnapshot(`
    [
      "https://cloudflare-eth.com",
      "https://lol.com",
    ]
  `);
});
