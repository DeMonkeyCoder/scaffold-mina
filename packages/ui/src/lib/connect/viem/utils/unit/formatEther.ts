import { etherUnits } from "../../constants/unit";

import { type FormatUnitsErrorType, formatUnits } from "./formatUnits";

export type FormatEtherErrorType = FormatUnitsErrorType;

/**
 * Converts numerical wei to a string representation of ether.
 *
 * - Docs: https://@/lib/connect/viem.sh/docs/utilities/formatEther
 *
 * @example
 * import { formatEther } from '@/lib/connect/viem'
 *
 * formatEther(1000000000000000000n)
 * // '1'
 */
export function formatEther(wei: bigint, unit: "wei" | "gwei" = "wei") {
  return formatUnits(wei, etherUnits[unit]);
}
