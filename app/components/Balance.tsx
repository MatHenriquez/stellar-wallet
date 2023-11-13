import { FC } from "react";
import ReceivePayment from "./ReceivePayment";
import SendPaymentButton from "./SendPaymentButton";

const Balance: FC<{
  balance: string | undefined;
  setShowPaymentModal: (value: boolean) => void;
  isFunded: boolean;
  showQr: boolean;
  setShowQr: (value: boolean) => void;
  publicKey: string;
}> = ({
  balance,
  setShowPaymentModal,
  isFunded,
  showQr,
  setShowQr,
  publicKey,
}) => {
  return (
    <div className="flex flex-col w-full p-4 bg-cyan-900 shadow-lg">
      <h1 className="text-3xl mt-6" data-cy="balance-title">
        Your Balance
      </h1>
      <div className="flex flex-col md:flex-row">
        <p className="text-4xl font-bold mt-8 p-2" data-cy="balance-value">
          {balance || 0} Lumens (XLM)
        </p>
        <div className="flex">
          <SendPaymentButton
            setShowPaymentModal={setShowPaymentModal}
            isFunded={isFunded}
          />
          <ReceivePayment
            destinationPublicKey={publicKey}
            setShowQr={setShowQr}
            showQr={showQr}
          />
        </div>
      </div>
    </div>
  );
};

export default Balance;
