import { expect, test } from "vitest";

import { createHttpServer } from "~test/src/utils";
import { createBlockFilter } from "../../actions/public/createBlockFilter";
import { createPublicClient } from "../../clients/createPublicClient";
import { fallback } from "../../clients/transports/fallback";
import { http } from "../../clients/transports/http";

import { anvilMainnet } from "../../../test/src/anvil";

import { createFilterRequestScope } from "./createFilterRequestScope";

const client = anvilMainnet.getClient();

test("default", async () => {
  const getRequest = createFilterRequestScope(client, {
    method: "mina_newBlockFilter",
  });
  const { id } = await createBlockFilter(client);
  expect(getRequest(id)).toEqual(client.request);
});

test("fallback transport", async () => {
  const server1 = await createHttpServer((_req, res) => {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(
      JSON.stringify({
        error: { code: -32004, message: "method not supported" },
      })
    );
  });

  let count = 0;
  const server2 = await createHttpServer((_req, res) => {
    count++;
    res.writeHead(200, {
      "Content-Type": "application/json",
    });
    res.end(JSON.stringify({ result: "0x1" }));
  });

  const fallbackClient = createPublicClient({
    transport: fallback([http(server1.url), http(server2.url)]),
  });
  const getRequest = createFilterRequestScope(fallbackClient, {
    method: "mina_newBlockFilter",
  });
  const { id } = await createBlockFilter(fallbackClient);

  const request = getRequest(id);
  count = 0;
  await request({ method: "mina_getFilterChanges", params: [id] });
  expect(count).toBe(1);
});
