////////////////////////////////////////////////////////////////////////////////
// @/lib/connect/core/exports/codegen
////////////////////////////////////////////////////////////////////////////////

// biome-ignore lint/performance/noBarrelFile: entrypoint module
// biome-ignore lint/performance/noReExportAll: entrypoint module
export * from "@/lib/connect/core/exports/codegen";

////////////////////////////////////////////////////////////////////////////////
// Hooks
////////////////////////////////////////////////////////////////////////////////

export {
  type CreateUseSimulateContractParameters,
  type CreateUseSimulateContractReturnType,
  createUseSimulateContract,
} from "../hooks/codegen/createUseSimulateContract";

export {
  type CreateUseReadContractParameters,
  type CreateUseReadContractReturnType,
  createUseReadContract,
} from "../hooks/codegen/createUseReadContract";

export {
  type CreateUseWatchContractEventParameters,
  type CreateUseWatchContractEventReturnType,
  createUseWatchContractEvent,
} from "../hooks/codegen/createUseWatchContractEvent";

export {
  type CreateUseWriteContractParameters,
  type CreateUseWriteContractReturnType,
  createUseWriteContract,
} from "../hooks/codegen/createUseWriteContract";
