import { Server, ServerApi } from "stellar-sdk";
import { IPaymentHistory } from "@component/interfaces/payments";

const server: Server = new Server(process.env.NEXT_PUBLIC_SERVER_URL || "");
const historyLimit: number = 100;

const getPaymentsHistory = async (publicKey: string) => {
  const accountTransactions = await server
    .operations()
    .forAccount(publicKey)
    .order("desc")
    .limit(historyLimit)
    .call();

  return formatPaymentsHistory(accountTransactions);
};

const formatPaymentsHistory: (
  unformattedPaymentsHistory: ServerApi.CollectionPage<ServerApi.OperationRecord>
) => IPaymentHistory[] = (unformattedPaymentsHistory) => {
  const formattedPaymentsHistory: IPaymentHistory[] = [];

  unformattedPaymentsHistory.records.forEach(
    (payment: ServerApi.OperationRecord) => {
      formattedPaymentsHistory.push({
        amount: payment.amount,
        date: payment.created_at.slice(0, 10),
        time: payment.created_at.slice(11, 16),
        assetType: payment.asset_type,
        sourceAccount: payment.from,
        destinationAccount: payment.to,
        transactionHash: payment.transaction_hash,
        successful: payment.transaction_successful,
        type: payment.type,
      });
    }
  );

  return formattedPaymentsHistory;
};

export const paginatePaymentsHistory = (
  paymentsHistory: IPaymentHistory[],
  currentPage: number,
  paymentsPerPage: number
) => {
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  return paymentsHistory.slice(indexOfFirstPayment, indexOfLastPayment);
};

export default getPaymentsHistory;
