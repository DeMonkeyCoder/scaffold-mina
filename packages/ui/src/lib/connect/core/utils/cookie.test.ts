import { http } from "@/lib/connect/viem";
import { mainnet } from "@/lib/connect/viem/chains";
import { expect, test } from "vitest";

import { createConfig } from "../createConfig";
import { createStorage } from "../createStorage";
import { cookieStorage, cookieToInitialState, parseCookie } from "./cookie";

test("cookieStorage", () => {
  expect(cookieStorage.getItem("recentConnectorId")).toMatchInlineSnapshot(
    "null"
  );
  cookieStorage.setItem("recentConnectorId", "foo");
  expect(cookieStorage.getItem("recentConnectorId")).toMatchInlineSnapshot(
    `"foo"`
  );
  cookieStorage.removeItem("recentConnectorId");
  expect(cookieStorage.getItem("recentConnectorId")).toMatchInlineSnapshot(
    "null"
  );
});

test("cookieToInitialState", () => {
  const config = createConfig({
    chains: [mainnet],
    transports: { [mainnet.id]: http() },
    storage: createStorage({ storage: cookieStorage }),
  });

  expect(
    cookieToInitialState(
      config,
      'wagmi.store={"state":{"connections":{"__type":"Map","value":[]},"chainId":1,"current":null},"version":2}; '
    )
  ).toMatchInlineSnapshot(`
    {
      "chainId": 1,
      "connections": Map {},
      "current": null,
    }
  `);

  expect(cookieToInitialState(config)).toMatchInlineSnapshot("undefined");
  expect(cookieToInitialState(config), "foo").toMatchInlineSnapshot(
    "undefined"
  );
});

test("parseCookie", () => {
  expect(
    parseCookie(
      'wagmi.store={"state":{"connections":{"__type":"Map","value":[]},"chainId":1,"current":null},"version":2}; ',
      "wagmi.store"
    )
  ).toMatchInlineSnapshot(
    `"{"state":{"connections":{"__type":"Map","value":[]},"chainId":1,"current":null},"version":2}"`
  );

  expect(
    parseCookie(
      'foo="bar"; wagmi.store={"state":{"connections":{"__type":"Map","value":[]},"chainId":1,"current":null},"version":2}; ',
      "wagmi.store"
    )
  ).toMatchInlineSnapshot(
    `"{"state":{"connections":{"__type":"Map","value":[]},"chainId":1,"current":null},"version":2}"`
  );

  expect(parseCookie('foo="bar"; ', "wagmi.store")).toMatchInlineSnapshot(
    "undefined"
  );
});
