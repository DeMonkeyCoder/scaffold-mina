import { expect, test } from "vitest";

import { anvilMainnet } from "../../../test/src/anvil";
import { requestPermissions } from "./requestPermissions";

const client = anvilMainnet.getClient();

test("default", async () => {
  expect(await requestPermissions(client!, { mina_accounts: {} }))
    .toMatchInlineSnapshot(`
    [
      {
        "caveats": [
          {
            "type": "filterResponse",
            "value": [
              "0x0c54fccd2e384b4bb6f2e405bf5cbc15a017aafb",
            ],
          },
        ],
        "invoker": "https://example.com",
        "parentCapability": "mina_accounts",
      },
    ]
  `);
});
