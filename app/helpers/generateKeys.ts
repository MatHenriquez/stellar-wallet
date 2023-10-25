import { Keypair } from "stellar-sdk";

export function generateKeys() {
  return Keypair.random();
}
