import { Keypair } from "stellar-sdk";

function getPublicKey(secretKey: string): string {
  try {
    return Keypair.fromSecret(secretKey).publicKey();
  } catch (error) {
    const errorTag = document.querySelector("#error");
    if(errorTag) errorTag.textContent = "Invalid secret key";
    throw new Error("Invalid secret key");
  }
}

const redirectToDashboard = (): void => {
  window.location.href = "/dashboard";
};

const savePublicKey = (publicKey: string): void => {
  localStorage.setItem("publicKey", publicKey);
};

export default {
  getPublicKey,
  redirectToDashboard,
  savePublicKey,
};
