import { gweiUnits } from "../../constants/unit";
import type { ErrorType } from "../../errors/utils";

import { type ParseUnitsErrorType, parseUnits } from "./parseUnits";

export type ParseGweiErrorType = ParseUnitsErrorType | ErrorType;

/**
 * Converts a string representation of gwei to numerical wei.
 *
 * - Docs: https://@/lib/connect/viem.sh/docs/utilities/parseGwei
 *
 * @example
 * import { parseGwei } from '@/lib/connect/viem'
 *
 * parseGwei('420')
 * // 420000000000n
 */
export function parseGwei(ether: string, unit: "wei" = "wei") {
  return parseUnits(ether, gweiUnits[unit]);
}
