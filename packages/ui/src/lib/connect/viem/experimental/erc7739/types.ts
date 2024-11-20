import type { Address } from "@/lib/connect/viem";

export type GetVerifierParameter<
  verifier extends Address | undefined = Address
> = verifier extends Address
  ? { verifier?: Address | undefined }
  : { verifier: Address };
