import type { Client } from "../../clients/createClient";
import type { Transport } from "../../clients/transports/createTransport";
import type { OnResponseFn } from "../../clients/transports/fallback";
import type { Chain } from "../../types/chain";
import type { PublicRpcSchema } from "../../types/eip1193";
import type { EIP1193RequestFn } from "../../types/eip1193";
import type { Hex } from "../../types/misc";
import type { Filter } from "../../types/utils";

type CreateFilterRequestScopeParameters = {
  method:
    | "mina_newFilter"
    | "mina_newPendingTransactionFilter"
    | "mina_newBlockFilter";
};

type FilterRpcSchema = Filter<
  PublicRpcSchema,
  { Method: "mina_getFilterLogs" | "mina_getFilterChanges" }
>;

type CreateFilterRequestScopeReturnType = (
  id: Hex
) => EIP1193RequestFn<FilterRpcSchema>;

/**
 * Scopes `request` to the filter ID. If the client is a fallback, it will
 * listen for responses and scope the child transport `request` function
 * to the successful filter ID.
 */
export function createFilterRequestScope<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  { method }: CreateFilterRequestScopeParameters
): CreateFilterRequestScopeReturnType {
  const requestMap: Record<Hex, EIP1193RequestFn> = {};

  if (client.transport.type === "fallback")
    client.transport.onResponse?.(
      ({
        method: method_,
        response: id,
        status,
        transport,
      }: Parameters<OnResponseFn>[0]) => {
        if (status === "success" && method === method_)
          requestMap[id as Hex] = transport.request;
      }
    );

  return ((id) =>
    requestMap[id] || client.request) as CreateFilterRequestScopeReturnType;
}
