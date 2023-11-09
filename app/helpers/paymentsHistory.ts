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
    ({amount, created_at, asset_type, from, to, transaction_hash, transaction_successful, type}: ServerApi.OperationRecord) => {
      formattedPaymentsHistory.push({
        amount: amount,
        date: created_at.slice(0, 10),
        time: created_at.slice(11, 16),
        assetType: asset_type,
        sourceAccount: from,
        destinationAccount: to,
        transactionHash: transaction_hash,
        successful: transaction_successful,
        type: type,
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
