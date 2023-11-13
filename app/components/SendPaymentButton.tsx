import { FC } from "react";

const SendPaymentButton: FC<{
    setShowPaymentModal: (value: boolean) => void;
    isFunded: boolean;
  }> = ({ setShowPaymentModal, isFunded }) => {
    return (
      <button
        className="flex bg-indigo-950 text-white active:bg-indigo-800 font-bold uppercase text-l px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ml-8 mr-1 mb-1 ease-linear transition-all duration-150 self-center disabled:bg-gray-400"
        type="button"
        disabled={!isFunded}
        onClick={() => setShowPaymentModal(true)}
        data-cy="send-payment-button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
        Send
      </button>
    );
  };

  export default SendPaymentButton;