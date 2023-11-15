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
  xdr,
} from "stellar-sdk";
import { IPaymentSummary } from "../interfaces/payments";
import IWallet from "@component/interfaces/wallet";

const server = new Server(process.env.NEXT_PUBLIC_SERVER_URL || "");

const signTransaction = (transaction: Transaction, sourceKeys: Keypair) =>
  transaction.sign(sourceKeys);

export const submitTransaction = async (transaction: Transaction) => {
  try {
    await server.submitTransaction(transaction);
  } catch (error) {
    console.error(error);
  }
};

const loadAccount = async (publicKey: string) => server.loadAccount(publicKey);

export const sendPayment: (paymentSummary: IPaymentSummary) => Promise<void> = async ({
  signerKey,
  destinationPublicKey,
  amount,
  memo,
}) => {
  const sourceKeys: Keypair = Keypair.fromSecret(signerKey);

  try {
    await loadAccount(destinationPublicKey);

    const transaction = await buildTransaction(
      sourceKeys.publicKey(),
      destinationPublicKey,
      amount,
      memo
    );

    signTransaction(transaction, sourceKeys);
    await submitTransaction(transaction);
  } catch (error) {
    console.error(error);
  }
};

export const buildTransaction = async (
  sourcePublicKey: string,
  destinationPublicKey: string,
  amount: string,
  memo?: string
) => {
  const sourceAccount = await loadAccount(sourcePublicKey);

  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublicKey,
        asset: Asset.native(),
        amount: amount,
      })
    )
    .addMemo(Memo.text(memo || ""))
    .setTimeout(60)
    .build();

  return transaction;
};

export const signTransactionWithWallet = async (
  transaction: Transaction,
  wallet: IWallet
) => {
  try {
    return await wallet.sign(transaction);
  } catch (error) {
    console.error(error);
  }
};

export const getTransactionFromXdr = (transactionXdr: string) => {
  try {
    const transactionEnvelope = xdr.TransactionEnvelope.fromXDR(
      transactionXdr,
      "base64"
    );
    return new Transaction(transactionEnvelope, Networks.TESTNET);
  } catch (error) {
    console.error(error);
  }
};
