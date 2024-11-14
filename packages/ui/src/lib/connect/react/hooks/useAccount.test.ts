import { connect, disconnect } from "@/lib/connect/core/exports";
import { config } from "@wagmi/test";
import { renderHook } from "@wagmi/test/react";
import { Fragment, createElement } from "react";
import { expect, test } from "vitest";

import { useAccount } from "./useAccount.js";

test("default", async () => {
  const { result, rerender } = renderHook(() => useAccount());

  expect(result.current.address).not.toBeDefined();
  expect(result.current.status).toEqual("disconnected");

  await connect(config, { connector: config.connectors[0]! });
  rerender();

  expect(result.current.address).toBeDefined();
  expect(result.current.status).toEqual("connected");

  await disconnect(config);
});

test("parameters: config", () => {
  const { result } = renderHook(() => useAccount({ config }), {
    wrapper: ({ children }) => createElement(Fragment, { children }),
  });
  expect(result.current).toBeDefined();
});
