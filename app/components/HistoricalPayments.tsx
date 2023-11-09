import { FC } from "react";
import { IPaymentHistory } from "../interfaces/payments";

const HistoricalPayment: FC<{
  historicalPayment: IPaymentHistory;
  index: number;
}> = ({
  index,
  historicalPayment: {
    amount,
    date,
    time,
    assetType,
    sourceAccount,
    destinationAccount,
    transactionHash,
    successful,
    type,
  },
}) => {
  return (
    <div
      className="p-8 border-t-2 shadow-xl"
      data-cy="payments-history-container"
    >
      <p
        className="font-bold text-xl mb-4"
        data-cy={`payment-title-${index}`}
      >{`${type.toUpperCase()}`}</p>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <p className="break-words" data-cy={`source-account-payment-${index}`}>
          <span className="font-bold">From: </span>
          {sourceAccount}
        </p>
        <p
          className="break-words"
          data-cy={`destination-account-payment-${index}`}
        >
          <span className="font-bold">To: </span>
          {destinationAccount}
        </p>
        <p className="break-words" data-cy={`payment-date-${index}`}>
          <span className="font-bold">Date: </span>
          {date}
        </p>
        <p className="break-words" data-cy={`payment-time-${index}`}>
          <span className="font-bold">Time: </span>
          {time}
        </p>
        <p className="break-words" data-cy={`amount-payment-${index}`}>
          <span className="font-bold">Amount: </span>
          {amount} {assetType === "native" ? "XML" : assetType}
        </p>
        <p className="break-words" data-cy={`payment-hash-${index}`}>
          <span className="font-bold">Hash: </span>
          {transactionHash}
        </p>
        <p className="break-words" data-cy={`payment-status-${index}`}>
          <span className="font-bold">Status: </span>
          {successful ? (
            <span className="text-green-500">Success</span>
          ) : (
            <span className="text-red-500">Failed</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default HistoricalPayment;
