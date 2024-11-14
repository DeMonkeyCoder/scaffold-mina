import { config } from "@wagmi/test";
import type { Client } from "@/lib/connect/viem";
import { expect, test } from "vitest";

import { switchChain } from "./switchChain";
import { watchClient } from "./watchClient";

test("default", async () => {
  const clients: Client[] = [];
  const unwatch = watchClient(config, {
    onChange(client) {
      clients.push(client);
    },
  });

  switchChain(config, { chainId: 456 });
  switchChain(config, { chainId: 10 });
  switchChain(config, { chainId: 1 });

  expect(clients.length).toBe(3);

  unwatch();
});
