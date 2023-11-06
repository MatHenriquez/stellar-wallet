import {
  Server,
  Keypair,
  Transaction,
  Asset,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
  BASE_FEE,
  KeypairType,
} from "stellar-sdk";
import { IPaymentSummary } from "../interfaces/payments";

const server = new Server(process.env.NEXT_PUBLIC_SERVER_URL || "");

const signTransaction = (transaction: Transaction, sourceKeys: Keypair) =>
  transaction.sign(sourceKeys);

const submitTransaction = (transaction: Transaction) =>
  server.submitTransaction(transaction);

const loadAccount = async (publicKey: string) => server.loadAccount(publicKey);

const buildTransaction = async (
  destinationPublicKey: string,
  sourceKeys: Keypair,
  transaction: Transaction,
  fee: number,
  amount: string,
  memo: string,
  timeOutInSeconds: number
) => {
  await loadAccount(destinationPublicKey);
  const sourceAccount = await loadAccount(sourceKeys.publicKey());

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
  await submitTransaction(transaction);
};

export const sendPayment: (paymentSummary: IPaymentSummary) => void = async ({
  signerKey,
  destinationPublicKey,
  amount,
  memo,
  timeOutInSeconds,
  fee,
}) => {
  const sourceKeys: Keypair = Keypair.fromSecret(signerKey);

  try {
    await loadAccount(destinationPublicKey);
    const sourceAccount = await loadAccount(sourceKeys.publicKey());

    const transaction = new TransactionBuilder(sourceAccount, {
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
    await submitTransaction(transaction);

    return {
      sourcePublicKey: sourceKeys.publicKey(),
      destinationPublicKey: destinationPublicKey,
      amount: amount,
      status: "Success",
    };
  } catch (error: any) {
    return {
      sourcePublicKey: sourceKeys.publicKey(),
      destinationPublicKey: destinationPublicKey,
      amount: amount,
      status: "Failed",
      errorMessage: error.message,
    };
  }
};
