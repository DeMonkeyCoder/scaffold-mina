import type { Address } from "@/lib/connect/viem";

import { getTransactionCount } from "../actions/public/getTransactionCount";
import type { Client } from "../clients/createClient";
import type { MaybePromise } from "../types/utils";
import { LruMap } from "./lru";

export type CreateNonceManagerParameters = {
  source: NonceManagerSource;
};

type FunctionParameters = {
  address: Address;
  networkId: string;
};

export type NonceManager = {
  /** Get and increment a nonce. */
  consume: (
    parameters: FunctionParameters & { client: Client }
  ) => Promise<number>;
  /** Increment a nonce. */
  increment: (networkId: FunctionParameters) => void;
  /** Get a nonce. */
  get: (networkId: FunctionParameters & { client: Client }) => Promise<number>;
  /** Reset a nonce. */
  reset: (networkId: FunctionParameters) => void;
};

/**
 * Creates a nonce manager for auto-incrementing transaction nonces.
 *
 * - Docs: https://@/lib/connect/viem.sh/docs/accounts/createNonceManager
 *
 * @example
 * ```ts
 * const nonceManager = createNonceManager({
 *   source: jsonRpc(),
 * })
 * ```
 */
export function createNonceManager(
  parameters: CreateNonceManagerParameters
): NonceManager {
  const { source } = parameters;

  const deltaMap = new Map();
  const nonceMap = new LruMap<number>(8192);
  const promiseMap = new Map<string, Promise<number>>();

  const getKey = ({ address, networkId }: FunctionParameters) =>
    `${address}.${networkId}`;

  return {
    async consume({ address, networkId, client }) {
      const key = getKey({ address, networkId });
      const promise = this.get({ address, networkId, client });

      this.increment({ address, networkId });
      const nonce = await promise;

      await source.set({ address, networkId }, nonce);
      nonceMap.set(key, nonce);

      return nonce;
    },
    async increment({ address, networkId }) {
      const key = getKey({ address, networkId });
      const delta = deltaMap.get(key) ?? 0;
      deltaMap.set(key, delta + 1);
    },
    async get({ address, networkId, client }) {
      const key = getKey({ address, networkId });

      let promise = promiseMap.get(key);
      if (!promise) {
        promise = (async () => {
          try {
            const nonce = await source.get({ address, networkId, client });
            const previousNonce = nonceMap.get(key) ?? 0;
            if (previousNonce > 0 && nonce <= previousNonce)
              return previousNonce + 1;
            nonceMap.delete(key);
            return nonce;
          } finally {
            this.reset({ address, networkId });
          }
        })();
        promiseMap.set(key, promise);
      }

      const delta = deltaMap.get(key) ?? 0;
      return delta + (await promise);
    },
    reset({ address, networkId }) {
      const key = getKey({ address, networkId });
      deltaMap.delete(key);
      promiseMap.delete(key);
    },
  };
}

////////////////////////////////////////////////////////////////////////////////////////////
// Sources

export type NonceManagerSource = {
  /** Get a nonce. */
  get(
    parameters: FunctionParameters & { client: Client }
  ): MaybePromise<number>;
  /** Set a nonce. */
  set(parameters: FunctionParameters, nonce: number): MaybePromise<void>;
};

/** JSON-RPC source for a nonce manager. */
export function jsonRpc(): NonceManagerSource {
  return {
    async get(parameters) {
      const { address, client } = parameters;
      return getTransactionCount(client, {
        address,
        blockTag: "pending",
      });
    },
    set() {},
  };
}

////////////////////////////////////////////////////////////////////////////////////////////
// Default

/** Default Nonce Manager with a JSON-RPC source. */
export const nonceManager = /*#__PURE__*/ createNonceManager({
  source: jsonRpc(),
});
