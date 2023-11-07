import { IPaymentSummary } from "@component/interfaces/payments";
import { IFormErrors } from "../interfaces/errors";
import { BASE_FEE, StrKey } from "stellar-sdk";

const errorMessages = {
  invalidSignerKey: "Invalid signer key",
  invalidDestinationPublicKey: "Invalid destination id",
  invalidAmount: "Invalid amount"
};

const errors: IFormErrors = {};

const isSignerKeyValid: (signerKey: string) => void = (signerKey) => {
  if (!StrKey.isValidEd25519SecretSeed(signerKey))
    errors.signerKeyError = errorMessages.invalidSignerKey;
};

const isDestinationPublicKeyValid: (destinationPublicKey: string) => void = (
  destinationPublicKey
) => {
  if (!StrKey.isValidEd25519PublicKey(destinationPublicKey))
    errors.destinationPublicKeyError = errorMessages.invalidDestinationPublicKey;
};

const isAmountInvalid: (
  amount: string,
  currentBalance: string | undefined
) => void = (amount = "0", currentBalance = "0") => {
  +amount > +currentBalance - +BASE_FEE || +amount < +BASE_FEE
    ? (errors.amountError = errorMessages.invalidAmount)
    : null;
};

const isFormValid: (
  formEntries: IPaymentSummary,
  currentBalance: string | undefined
) => IFormErrors = (formEntries, currentBalance) => {
  const { signerKey, destinationPublicKey, amount} =
    formEntries;

  isSignerKeyValid(signerKey);
  isDestinationPublicKeyValid(destinationPublicKey);
  isAmountInvalid(amount, currentBalance);

  return errors;
};

export default {
  isFormValid,
};
