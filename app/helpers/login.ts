import { Keypair } from "stellar-sdk";

function isSecretKeyValid(secretKey: string): boolean {
  try {
    Keypair.fromSecret(secretKey);
    return true;
  } catch (error) {
    return false;
  }
}

export function login(secretKey: string): void {
  if (isSecretKeyValid(secretKey)) {
    const keypair: Keypair = Keypair.fromSecret(secretKey);
    const publicKey = keypair.publicKey();
    localStorage.setItem("publicKey", publicKey);
    window.location.href = "/dashboard";
  } else alert("Incorrect secret key");
}