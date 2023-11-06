import {
  Server,
  Keypair,
  Transaction,
  NotFoundError,
  Asset,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
  BASE_FEE,
} from "stellar-sdk";
import { IPaymentSummary } from "../interfaces/payments";

function handleError(error: Error) {
  if (error instanceof NotFoundError) {
    throw new Error("The destination account does not exist!");
  } else return error;
}

const server = new Server(process.env.NEXT_PUBLIC_SERVER_URL || "");

const signTransaction = (transaction: Transaction, sourceKeys: Keypair) =>
  transaction.sign(sourceKeys);

const submitTransaction = (transaction: Transaction) =>
  server.submitTransaction(transaction);

const loadAccount = async (publicKey: string) => server.loadAccount(publicKey);

export const sendPayment: (paymentSummary: IPaymentSummary) => void = ({
  signerKey,
  destinationPublicKey,
  amount,
  memo,
  timeOutInSeconds,
  fee,
}) => {
  const sourceKeys: Keypair = Keypair.fromSecret(signerKey);
  let transaction: Transaction;

  if (fee < +BASE_FEE) throw new Error("Fee cannot be less than base fee");

  loadAccount(destinationPublicKey)
    .catch((error: Error) => handleError(error))
    .then(function () {
      return loadAccount(sourceKeys.publicKey());
    })
    .then(function (sourceAccount) {
      transaction = new TransactionBuilder(sourceAccount, {
        fee: fee.toString(),
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(
          Operation.payment({
            destination: destinationPublicKey,
            asset: Asset.native(),
            amount: amount,
          })
        )
        .addMemo(Memo.text(memo))
        .setTimeout(timeOutInSeconds)
        .build();
      signTransaction(transaction, sourceKeys);
      return submitTransaction(transaction);
    })
    .then(function (result: any) {
      return {
        sourcePublicKey: sourceKeys.publicKey(),
        destinationPublicKey: destinationPublicKey,
        amount: amount,
        status: "Success",
      };
    })
    .catch(function (error: Error) {
      return {
        sourcePublicKey: sourceKeys.publicKey(),
        destinationPublicKey: destinationPublicKey,
        amount: amount,
        status: "Failed",
        errorMessage: error.message,
      };
    });
};
