import { connect } from "@/lib/connect/core/exports";
import { config } from "@wagmi/test";
import { renderHook } from "@wagmi/test/react";
import { Fragment, createElement } from "react";
import { expect, test } from "vitest";

import { useConnections } from "./useConnections";

test("default", async () => {
  const { result, rerender } = renderHook(() => useConnections());

  expect(result.current).toEqual([]);

  await connect(config, { connector: config.connectors[0]! });
  rerender();

  expect(result.current.length).toBe(1);
});

test("parameters: config", () => {
  const { result } = renderHook(() => useConnections({ config }), {
    wrapper: ({ children }) => createElement(Fragment, { children }),
  });
  expect(result.current).toBeDefined();
});
