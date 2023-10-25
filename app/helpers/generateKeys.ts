import { Keypair } from "stellar-sdk";

export function generateKeys() {
  const keyPair: Keypair = Keypair.random();
  return keyPair;
}

