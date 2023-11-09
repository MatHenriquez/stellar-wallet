import { FC } from "react";

const PaymentResponseAlert: FC<{
  paymentResponse: string;
  color: string;
}> = ({ paymentResponse, color }) => {
  return (
    <>
      <div
        className={`text-white p-2 border-0 rounded flex mb-4 bg-${color}-500 align-middle justify-center`}
      >
        <span
          className={"inline-block text-xl mr-8"}
          data-cy="payment-response-alert"
        >
          {paymentResponse}
        </span>
      </div>
    </>
  );
};

export default PaymentResponseAlert;
