import { IPaymentSummary } from "@component/interfaces/payments";
import { IFormErrors } from "../interfaces/errors";
import StellarSdk, { Keypair } from "stellar-sdk";

const isSignerKeyValid: (signerKey: string) => void = (signerKey) => {
  try {
    Keypair.fromSecret(signerKey);
  } catch (error) {
    throw new Error("Invalid signer key");
  }
};

const isDestinationIdValid: (destinationPublicKey: string) => void = (
  destinationPublicKey
) => {
  try {
    Keypair.fromPublicKey(destinationPublicKey);
  } catch (error) {
    throw new Error("Invalid destination public key");
  }
};

const isAmountInvalid: (
  amount: string,
  currentBalance: string | undefined,
  fee: number
) => boolean = (amount = "0", currentBalance = "0", fee = 0) =>
  +amount > +currentBalance - fee || +amount < StellarSdk.BASE_FEE;

const isFeeInvalid: (
  fee: number,
  currentBalance: string | undefined
) => boolean = (fee = 0, currentBalance = "0") => {
  return fee > +currentBalance || fee < StellarSdk.BASE_FEE;
};

const isTimeOutInvalid: (timeOutInSeconds: number) => boolean = (
  timeOutInSeconds = -1
) => timeOutInSeconds < 0;

const isFormValid: (
  formEntries: IPaymentSummary,
  currentBalance: string | undefined
) => IFormErrors = (formEntries, currentBalance) => {
  const { signerKey, destinationPublicKey, amount, fee, timeOutInSeconds } =
    formEntries;
  const errors: IFormErrors = {};
  try {
    console.log("formEntries", formEntries)
    isSignerKeyValid(signerKey);
    isDestinationIdValid(destinationPublicKey);
    if (isAmountInvalid(amount, currentBalance, fee))
      throw new Error("Invalid amount");
    if (isFeeInvalid(fee, currentBalance)) throw new Error("Invalid fee");
    if (isTimeOutInvalid(timeOutInSeconds)) throw new Error("Invalid time out");
  } catch (error: any) {
    if (error.message === "Invalid signer key")
      errors.signerKeyError = "Invalid signer key";
    else if (error.message === "Invalid destination public key")
      errors.destinationIdError = "Invalid destination id";
    else if (error.message === "Invalid amount")
      errors.amountError = "Invalid amount";
    else if (error.message === "Invalid fee") errors.feeError = "Invalid fee";
    else if (error.message === "Invalid time out")
      errors.timeOutError = "Invalid time out";
    else throw new Error(error);
  }

  return errors;
};

export default {
  isFormValid,
};
