import { IPaymentSummary } from "@component/interfaces/payments";
import { IFormErrors } from "../interfaces/errors";
import { BASE_FEE, Keypair } from "stellar-sdk";

const errorMessages = {
  invalidSignerKey: "Invalid signer key",
  invalidDestinationId: "Invalid destination id",
  invalidAmount: "Invalid amount",
  invalidFee: "Invalid fee",
  invalidTimeOut: "Invalid time out",
};

const errors: IFormErrors = {};

const isSignerKeyValid: (signerKey: string) => void = (signerKey) => {
  try {
    Keypair.fromSecret(signerKey);
  } catch (error) {
    errors.signerKeyError = errorMessages.invalidSignerKey;
  }
};

const isDestinationIdValid: (destinationPublicKey: string) => void = (
  destinationPublicKey
) => {
  try {
    Keypair.fromPublicKey(destinationPublicKey);
  } catch (error) {
    errors.destinationIdError = errorMessages.invalidDestinationId;
  }
};

const isAmountInvalid: (
  amount: string,
  currentBalance: string | undefined,
  fee: number
) => void = (amount = "0", currentBalance = "0", fee = 0) => {
  +amount > +currentBalance - fee || +amount < +BASE_FEE
    ? (errors.amountError = errorMessages.invalidAmount)
    : null;
};

const isFeeInvalid: (
  fee: number,
  currentBalance: string | undefined
) => void = (fee = 0, currentBalance = "0") => {
  fee > +currentBalance || fee < +BASE_FEE
    ? (errors.feeError = errorMessages.invalidFee)
    : null;
};

const isTimeOutInvalid: (timeOutInSeconds: number) => void = (
  timeOutInSeconds = -1
) =>
  timeOutInSeconds < 0
    ? (errors.timeOutError = errorMessages.invalidTimeOut)
    : null;

const isFormValid: (
  formEntries: IPaymentSummary,
  currentBalance: string | undefined
) => IFormErrors = (formEntries, currentBalance) => {
  const { signerKey, destinationPublicKey, amount, fee, timeOutInSeconds } =
    formEntries;

  try {
    isSignerKeyValid(signerKey);
    isDestinationIdValid(destinationPublicKey);
    isAmountInvalid(amount, currentBalance, fee);
    isFeeInvalid(fee, currentBalance);
    isTimeOutInvalid(timeOutInSeconds);
  } catch (error) {
    throw error;
  }

  return errors;
};

export default {
  isFormValid,
};
