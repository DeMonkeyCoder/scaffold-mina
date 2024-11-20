import type { Address } from "@/lib/connect/viem";
import { BaseError } from "./base";

export type Eip712DomainNotFoundErrorType = Eip712DomainNotFoundError & {
  name: "Eip712DomainNotFoundError";
};

export class Eip712DomainNotFoundError extends BaseError {
  constructor({ address }: { address: Address }) {
    super(`No EIP-712 domain found on contract "${address}".`, {
      metaMessages: [
        "Ensure that:",
        `- The contract is deployed at the address "${address}".`,
        "- `eip712Domain()` function exists on the contract.",
        "- `eip712Domain()` function matches signature to ERC-5267 specification.",
      ],
      name: "Eip712DomainNotFoundError",
    });
  }
}
