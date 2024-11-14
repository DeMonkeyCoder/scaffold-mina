import { expect, test } from "vitest";

import { getVersion } from "./getVersion.js";

test("default", () => {
  expect(getVersion()).toMatchInlineSnapshot(
    `"@/lib/connect/core/exports@x.y.z"`
  );
});
