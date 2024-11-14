import { weiUnits } from "@/lib/connect/viem";

import type { Unit } from "../types/unit";

export function getUnit(unit: Unit) {
  if (typeof unit === "number") return unit;
  if (unit === "wei") return 0;
  return Math.abs(weiUnits[unit]);
}
