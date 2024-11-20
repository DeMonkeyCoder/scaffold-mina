import type { Address } from "@/lib/connect/viem";
import type { ByteArray, Hex } from "../../../types/misc";
import {
  type EncodeFunctionDataReturnType,
  encodeFunctionData,
} from "../../../utils/abi/encodeFunctionData";
import { bytesToHex } from "../../../utils/encoding/toHex";
import { paymasterAbi } from "../../constants/abis";

export type GetApprovalBasedPaymasterInputParameters = {
  innerInput: Hex | ByteArray;
  minAllowance: bigint;
  token: Address;
};

export type GetApprovalBasedPaymasterInputReturnType =
  EncodeFunctionDataReturnType;

export function getApprovalBasedPaymasterInput(
  parameters: GetApprovalBasedPaymasterInputParameters
): GetApprovalBasedPaymasterInputReturnType {
  const { innerInput, minAllowance, token } = parameters;

  const innerInputHex =
    typeof innerInput === "string" ? innerInput : bytesToHex(innerInput);

  return encodeFunctionData({
    abi: paymasterAbi,
    functionName: "approvalBased",
    args: [token, minAllowance, innerInputHex],
  });
}
