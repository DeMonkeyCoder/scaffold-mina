import { expect, test } from "vitest";

import { createHttpServer } from "~test/src/utils";
import { createPublicClient } from "../../clients/createPublicClient";
import { fallback } from "../../clients/transports/fallback";
import { http } from "../../clients/transports/http";

import { anvilMainnet } from "../../../test/src/anvil";

import { createPendingTransactionFilter } from "./createPendingTransactionFilter";

const client = anvilMainnet.getClient();

test("default", async () => {
  expect(await createPendingTransactionFilter(client)).toBeDefined();
});

test("fallback client: scopes request", async () => {
  let count1 = 0;
  const server1 = await createHttpServer((_req, res) => {
    count1++;
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        error: { code: -32004, message: "method not supported" },
      })
    );
  });

  let count2 = 0;
  const server2 = await createHttpServer((_req, res) => {
    count2++;
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ result: "0x1" }));
  });

  const fallbackClient = createPublicClient({
    transport: fallback([http(server1.url), http(server2.url)]),
  });
  const filter = await createPendingTransactionFilter(fallbackClient);
  expect(filter).toBeDefined();
  expect(count1).toBe(1);
  expect(count2).toBe(1);

  await filter.request({
    method: "mina_getFilterChanges",
    params: [filter.id],
  });
  expect(count1).toBe(1);
  expect(count2).toBe(2);
});
