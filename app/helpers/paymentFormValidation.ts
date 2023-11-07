import { IPaymentSummary } from "@component/interfaces/payments";
import { IFormErrors } from "../interfaces/errors";
import { BASE_FEE, StrKey } from "stellar-sdk";

const errorMessages = {
  invalidSignerKey: "Invalid signer key",
  invalidDestinationId: "Invalid destination id",
  invalidAmount: "Invalid amount",
  invalidTimeOut: "Invalid time out",
};

const errors: IFormErrors = {};

const isSignerKeyValid: (signerKey: string) => void = (signerKey) => {
  if (!StrKey.isValidEd25519SecretSeed(signerKey))
    errors.signerKeyError = errorMessages.invalidSignerKey;
};

const isDestinationIdValid: (destinationPublicKey: string) => void = (
  destinationPublicKey
) => {
  if (!StrKey.isValidEd25519PublicKey(destinationPublicKey))
    errors.destinationIdError = errorMessages.invalidDestinationId;
};

const isAmountInvalid: (
  amount: string,
  currentBalance: string | undefined
) => void = (amount = "0", currentBalance = "0") => {
  +amount > +currentBalance - +BASE_FEE || +amount < +BASE_FEE
    ? (errors.amountError = errorMessages.invalidAmount)
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
  const { signerKey, destinationPublicKey, amount, timeOutInSeconds } =
    formEntries;

  isSignerKeyValid(signerKey);
  isDestinationIdValid(destinationPublicKey);
  isAmountInvalid(amount, currentBalance);
  isTimeOutInvalid(timeOutInSeconds);

  return errors;
};

export default {
  isFormValid,
};
