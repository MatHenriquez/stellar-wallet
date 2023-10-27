import { Keypair } from "stellar-sdk";

function isSecretKeyValid(secretKey: string): boolean {
  try {
    Keypair.fromSecret(secretKey);
    return true;
  } catch (error) {
    return false;
  }
}

const redirectToDashboard = (): void => {
  window.location.href = "/dashboard";
};

const savePublicKey = (publicKey: string): void => {
  localStorage.setItem("publicKey", publicKey);
};

