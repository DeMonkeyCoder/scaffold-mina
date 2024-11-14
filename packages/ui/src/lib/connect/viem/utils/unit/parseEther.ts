import { etherUnits } from "../../constants/unit";
import type { ErrorType } from "../../errors/utils";

import { type ParseUnitsErrorType, parseUnits } from "./parseUnits";

export type ParseEtherErrorType = ParseUnitsErrorType | ErrorType;

/**
 * Converts a string representation of ether to numerical wei.
 *
 * - Docs: https://@/lib/connect/viem.sh/docs/utilities/parseEther
 *
 * @example
 * import { parseEther } from '@/lib/connect/viem'
 *
 * parseEther('420')
 * // 420000000000000000000n
 */
export function parseEther(ether: string, unit: "wei" | "gwei" = "wei") {
  return parseUnits(ether, etherUnits[unit]);
}
