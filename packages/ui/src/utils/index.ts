import { PublicKey } from "o1js";

export function formatPublicKey(publicKey: PublicKey) {
  const publicKeyBase58 = publicKey.toBase58();
  return `${publicKeyBase58.slice(0, 4)}...${publicKeyBase58.slice(
    publicKeyBase58.length - 4
  )}`;
}
