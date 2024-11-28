import type {
  ContractFunctionParameters,
  MulticallParameters as viem_MulticallParameters,
  MulticallReturnType as viem_MulticallReturnType,
} from "@/lib/connect/viem";
import { ContractFunctionExecutionError } from "@/lib/connect/viem";

import type { Config } from "../createConfig";
import type { NetworkIdParameter } from "../types/properties";
import { multicall, type MulticallErrorType } from "./multicall";
import { readContract, type ReadContractErrorType } from "./readContract";

export type ReadContractsParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  config extends Config = Config
> = viem_MulticallParameters<
  contracts,
  allowFailure,
  { properties: NetworkIdParameter<config> }
>;

export type ReadContractsReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true
> = viem_MulticallReturnType<contracts, allowFailure>;

export type ReadContractsErrorType = MulticallErrorType | ReadContractErrorType;

export async function readContracts<
  config extends Config,
  const contracts extends readonly ContractFunctionParameters[],
  allowFailure extends boolean = true
>(
  config: config,
  parameters: ReadContractsParameters<contracts, allowFailure, config>
): Promise<ReadContractsReturnType<contracts, allowFailure>> {
  const { allowFailure = true, blockNumber, blockTag, ...rest } = parameters;
  const contracts = parameters.contracts as (ContractFunctionParameters & {
    networkId?: string | undefined;
  })[];

  try {
    const contractsByNetworkId: {
      [networkId: string]: {
        contract: ContractFunctionParameters;
        index: number;
      }[];
    } = {};
    for (const [index, contract] of contracts.entries()) {
      const networkId = contract.networkId ?? config.state.networkId;
      if (!contractsByNetworkId[networkId])
        contractsByNetworkId[networkId] = [];
      contractsByNetworkId[networkId]?.push({ contract, index });
    }
    const promises = () =>
      Object.entries(contractsByNetworkId).map(([networkId, contracts]) =>
        multicall(config, {
          ...rest,
          allowFailure,
          blockNumber,
          blockTag,
          networkId,
          contracts: contracts.map(({ contract }) => contract),
        })
      );

    const multicallResults = (await Promise.all(promises())).flat();
    // Reorder the contract results back to the order they were
    // provided in.
    const resultIndexes = Object.values(contractsByNetworkId).flatMap(
      (contracts) => contracts.map(({ index }) => index)
    );
    return multicallResults.reduce((results, result, index) => {
      if (results) (results as unknown[])[resultIndexes[index]!] = result;
      return results;
    }, [] as unknown[]) as ReadContractsReturnType<contracts, allowFailure>;
  } catch (error) {
    if (error instanceof ContractFunctionExecutionError) throw error;

    const promises = () =>
      contracts.map((contract) =>
        readContract(config, { ...contract, blockNumber, blockTag })
      );
    if (allowFailure)
      return (await Promise.allSettled(promises())).map((result) => {
        if (result.status === "fulfilled")
          return { result: result.value, status: "success" };
        return { error: result.reason, result: undefined, status: "failure" };
      }) as ReadContractsReturnType<contracts, allowFailure>;

    return (await Promise.all(promises())) as ReadContractsReturnType<
      contracts,
      allowFailure
    >;
  }
}
