export type { Address } from "abitype";

// biome-ignore lint/performance/noBarrelFile: entrypoint module
export { HDKey } from "@scure/bip32";
export { wordlist as czech } from "@scure/bip39/wordlists/czech";
export { wordlist as english } from "@scure/bip39/wordlists/english";
export { wordlist as french } from "@scure/bip39/wordlists/french";
export { wordlist as italian } from "@scure/bip39/wordlists/italian";
export { wordlist as japanese } from "@scure/bip39/wordlists/japanese";
export { wordlist as korean } from "@scure/bip39/wordlists/korean";
export { wordlist as simplifiedChinese } from "@scure/bip39/wordlists/simplified-chinese";
export { wordlist as spanish } from "@scure/bip39/wordlists/spanish";
export { wordlist as traditionalChinese } from "@scure/bip39/wordlists/traditional-chinese";

export {
  type GenerateMnemonicErrorType,
  generateMnemonic,
} from "./generateMnemonic";
export {
  type GeneratePrivateKeyErrorType,
  generatePrivateKey,
} from "./generatePrivateKey";
export {
  type HDKeyToAccountOptions,
  type HDKeyToAccountErrorType,
  hdKeyToAccount,
} from "./hdKeyToAccount";
export {
  type MnemonicToAccountOptions,
  type MnemonicToAccountErrorType,
  mnemonicToAccount,
} from "./mnemonicToAccount";
export {
  type PrivateKeyToAccountOptions,
  type PrivateKeyToAccountErrorType,
  privateKeyToAccount,
} from "./privateKeyToAccount";
export { type ToAccountErrorType, toAccount } from "./toAccount";

export type {
  Account,
  AccountSource,
  CustomSource,
  HDOptions,
  JsonRpcAccount,
  LocalAccount,
  HDAccount,
  PrivateKeyAccount,
} from "./types";
export { type ParseAccountErrorType, parseAccount } from "./utils/parseAccount";
export {
  type PublicKeyToAddressErrorType,
  publicKeyToAddress,
} from "./utils/publicKeyToAddress";
export {
  type PrivateKeyToAddressErrorType,
  privateKeyToAddress,
} from "./utils/privateKeyToAddress";
export {
  type CreateNonceManagerParameters,
  type NonceManager,
  type NonceManagerSource,
  createNonceManager,
  nonceManager,
} from "../utils/nonceManager";
