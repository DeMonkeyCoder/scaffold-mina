import { gweiUnits } from "../../constants/unit";

import { type FormatUnitsErrorType, formatUnits } from "./formatUnits";

export type FormatGweiErrorType = FormatUnitsErrorType;

/**
 * Converts numerical wei to a string representation of gwei.
 *
 * - Docs: https://@/lib/connect/viem.sh/docs/utilities/formatGwei
 *
 * @example
 * import { formatGwei } from '@/lib/connect/viem'
 *
 * formatGwei(1000000000n)
 * // '1'
 */
export function formatGwei(wei: bigint, unit: "wei" = "wei") {
  return formatUnits(wei, gweiUnits[unit]);
}
