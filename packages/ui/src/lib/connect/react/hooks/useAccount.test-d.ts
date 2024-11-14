import type { Connector } from "@/lib/connect/core/exports";
import type { Address, Chain } from "@/lib/connect/viem";
import { expectTypeOf, test } from "vitest";

import { useAccount } from "./useAccount.js";

test("states", () => {
  const result = useAccount();

  switch (result.status) {
    case "reconnecting": {
      expectTypeOf(result).toMatchTypeOf<{
        address: Address | undefined;
        chain: Chain | undefined;
        chainId: number | undefined;
        connector: Connector | undefined;
        isConnected: boolean;
        isConnecting: false;
        isDisconnected: false;
        isReconnecting: true;
        status: "reconnecting";
      }>();
      break;
    }
    case "connecting": {
      expectTypeOf(result).toMatchTypeOf<{
        address: Address | undefined;
        chain: Chain | undefined;
        chainId: number | undefined;
        connector: Connector | undefined;
        isConnected: false;
        isReconnecting: false;
        isConnecting: true;
        isDisconnected: false;
        status: "connecting";
      }>();
      break;
    }
    case "connected": {
      expectTypeOf(result).toMatchTypeOf<{
        address: Address;
        chain: Chain | undefined;
        chainId: number;
        connector: Connector;
        isConnected: true;
        isConnecting: false;
        isDisconnected: false;
        isReconnecting: false;
        status: "connected";
      }>();
      break;
    }
    case "disconnected": {
      expectTypeOf(result).toMatchTypeOf<{
        address: undefined;
        chain: undefined;
        chainId: undefined;
        connector: undefined;
        isConnected: false;
        isReconnecting: false;
        isConnecting: false;
        isDisconnected: true;
        status: "disconnected";
      }>();
      break;
    }
  }
});
