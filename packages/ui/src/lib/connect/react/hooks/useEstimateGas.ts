"use client";

import type {
  Config,
  EstimateGasErrorType,
  ResolvedRegister,
} from "@/lib/connect/core/exports";
import {
  type EstimateGasData,
  type EstimateGasOptions,
  type EstimateGasQueryFnData,
  type EstimateGasQueryKey,
  estimateGasQueryOptions,
} from "@/lib/connect/core/exports/query";

import type { ConfigParameter, QueryParameter } from "../types/properties";
import { type UseQueryReturnType, useQuery } from "../utils/query";
import { useNetworkId } from "./useNetworkId";
import { useConfig } from "./useConfig";
import { useConnectorClient } from "./useConnectorClient";

export type UseEstimateGasParameters<
  config extends Config = Config,
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = EstimateGasData
> = EstimateGasOptions<config, networkId> &
  ConfigParameter<config> &
  QueryParameter<
    EstimateGasQueryFnData,
    EstimateGasErrorType,
    selectData,
    EstimateGasQueryKey<config, networkId>
  >;

export type UseEstimateGasReturnType<selectData = EstimateGasData> =
  UseQueryReturnType<selectData, EstimateGasErrorType>;

/** https://wagmi.sh/react/api/hooks/useEstimateGas */
export function useEstimateGas<
  config extends Config = ResolvedRegister["config"],
  networkId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = EstimateGasData
>(
  parameters?: UseEstimateGasParameters<config, networkId, selectData>
): UseEstimateGasReturnType<selectData>;

export function useEstimateGas(
  parameters: UseEstimateGasParameters = {}
): UseEstimateGasReturnType {
  const { connector, query = {} } = parameters;

  const config = useConfig(parameters);
  const { data: connectorClient } = useConnectorClient({
    connector,
    query: { enabled: parameters.account === undefined },
  });
  const account = parameters.account ?? connectorClient?.account;
  const networkId = useNetworkId({ config });

  const options = estimateGasQueryOptions(config, {
    ...parameters,
    account,
    networkId: parameters.networkId ?? networkId,
    connector,
  });
  const enabled = Boolean((account || connector) && (query.enabled ?? true));

  return useQuery({ ...query, ...options, enabled });
}
