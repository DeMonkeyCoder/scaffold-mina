import type { ErrorType } from "../../errors/utils";
import {
  type DefineKzgErrorType,
  type DefineKzgParameters,
  type DefineKzgReturnType,
  defineKzg,
} from "./defineKzg";

export type SetupKzgParameters = DefineKzgParameters & {
  loadTrustedSetup(path: string): void;
};
export type SetupKzgReturnType = DefineKzgReturnType;
export type SetupKzgErrorType = DefineKzgErrorType | ErrorType;

/**
 * Sets up and returns a KZG interface.
 *
 * @example
 * ```ts
 * import * as cKzg from 'c-kzg'
 * import { setupKzg } from '@/lib/connect/viem'
 * import { mainnetTrustedSetupPath } from '@/lib/connect/viem/node'
 *
 * const kzg = setupKzg(cKzg, mainnetTrustedSetupPath)
 * ```
 */
export function setupKzg(
  parameters: SetupKzgParameters,
  path: string
): SetupKzgReturnType {
  try {
    parameters.loadTrustedSetup(path);
  } catch (e) {
    const error = e as Error;
    if (!error.message.includes("trusted setup is already loaded")) throw error;
  }
  return defineKzg(parameters);
}
