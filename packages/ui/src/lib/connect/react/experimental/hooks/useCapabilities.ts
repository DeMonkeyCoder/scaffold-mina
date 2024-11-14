"use client";

import type { Config, ResolvedRegister } from "@/lib/connect/core/exports";
import {
  type GetCapabilitiesData,
  type GetCapabilitiesErrorType,
  type GetCapabilitiesOptions,
  type GetCapabilitiesQueryFnData,
  type GetCapabilitiesQueryKey,
  getCapabilitiesQueryOptions,
} from "@/lib/connect/core/exports/experimental";
import type { Compute } from "@/lib/connect/core/exports/internal";

import { useAccount } from "../../hooks/useAccount";
import { useConfig } from "../../hooks/useConfig";
import type {
  ConfigParameter,
  QueryParameter,
} from "../../types/properties";
import { type UseQueryReturnType, useQuery } from "../../utils/query";

export type UseCapabilitiesParameters<
  config extends Config = Config,
  selectData = GetCapabilitiesData
> = Compute<
  GetCapabilitiesOptions &
    ConfigParameter<config> &
    QueryParameter<
      GetCapabilitiesQueryFnData,
      GetCapabilitiesErrorType,
      selectData,
      GetCapabilitiesQueryKey
    >
>;

export type UseCapabilitiesReturnType<selectData = GetCapabilitiesData> =
  UseQueryReturnType<selectData, GetCapabilitiesErrorType>;

/** https://wagmi.sh/react/api/hooks/useCapabilities */
export function useCapabilities<
  config extends Config = ResolvedRegister["config"],
  selectData = GetCapabilitiesData
>(
  parameters: UseCapabilitiesParameters<config, selectData> = {}
): UseCapabilitiesReturnType<selectData> {
  const { account, query = {} } = parameters;

  const { address } = useAccount();
  const config = useConfig(parameters);

  const options = getCapabilitiesQueryOptions(config, {
    ...parameters,
    account: account ?? address,
  });

  return useQuery({ ...query, ...options });
}
