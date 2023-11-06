import StellarSdk, { Server, Keypair, Transaction } from "stellar-sdk";
import { IPaymentSummary } from "../interfaces/payments";

function handleError(error: Error) {
  if (error instanceof StellarSdk.NotFoundError) {
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
  const sourceKeys: Keypair = StellarSdk.Keypair.fromSecret(signerKey);
  let transaction: Transaction;

  if (fee < StellarSdk.BASE_FEE)
    throw new Error("Fee cannot be less than base fee");

  loadAccount(destinationPublicKey)
    .catch((error: Error) => handleError(error))
    .then(function () {
      return loadAccount(sourceKeys.publicKey());
    })
    .then(function (sourceAccount) {
      transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: fee,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: destinationPublicKey,
            asset: StellarSdk.Asset.native(),
            amount: amount,
          })
        )
        .addMemo(StellarSdk.Memo.text(memo))
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
