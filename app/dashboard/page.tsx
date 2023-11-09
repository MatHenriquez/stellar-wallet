"use client";
import React, { FC, useEffect, useState } from "react";
import Navbar from "../components/Header";
import accountHelper from "../helpers/account";
import Footer from "../components/Footer";
import { IPaymentSummary, IPaymentHistory } from "../interfaces/payments";
import { sendPayment } from "../helpers/payments";
import PaymentModal from "../components/PaymentModal";
import { IFormErrors } from "../interfaces/errors";
import paymentFormValidation from "../helpers/paymentFormValidation";
import getPaymentsHistory, {
  paginatePaymentsHistory,
} from "../helpers/paymentsHistory";
import HistoricalPayments from "../components/HistoricalPayments";
import Pagination from "@component/components/Pagination";

const Dashboard: FC = () => {
  const [isFunded, setIsFunded] = useState(false);
  const [publicKey, setPublicKey] = useState("" as string);
  const [isLogged, setIsLogged] = useState(true);
  const [balance, setBalance] = useState("" as string | undefined);
  const [paymentSummary, setPaymentSummary] = useState({} as IPaymentSummary);
  const [paymentResponse, setPaymentResponse] = useState("" as string);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [formError, setFormError] = useState({} as IFormErrors);
  const [alertColor, setAlertColor] = useState("" as string);
  const [paymentsHistory, setPaymentsHistory] = useState(
    [] as IPaymentHistory[]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage, setPaymentsPerPage] = useState(5);
  const [displayedPayments, setDisplayedPayments] = useState(
    [] as IPaymentHistory[]
  );
  const [numberOfPages, setNumberOfPages] = useState(0 as number);

  const getAccountBalance = async (publicKey: string) => {
    try {
      const balance = await accountHelper.getBalance(publicKey);
      setBalance(balance);
      setIsFunded(true);
    } catch (error) {
      setBalance("0");
      setIsFunded(false);
    }
  };

  const validatePaymentForm = () => {
    const formErrors = paymentFormValidation.isFormValid(
      paymentSummary,
      balance
    );
    setFormError(formErrors);
    return !(Object.keys(formErrors).length > 0);
  };

  const handleSendPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validatePaymentForm()) {
      await sendPayment(paymentSummary);
      setShowPaymentModal(false);
      getAccountBalance(publicKey);
      setPaymentResponse("Successful payment");
      setShowPaymentAlert(true);
      setAlertColor("green");
      setPaymentSummary({} as IPaymentSummary);
    } else {
      setAlertColor("red");
      setShowPaymentAlert(true);
      setPaymentResponse("Payment Failed");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPaymentSummary({ ...paymentSummary, [name]: value });
  };

  useEffect(() => {
    const storedPublicKey: string | null =
      window.localStorage.getItem("publicKey");
    if (storedPublicKey) {
      setPublicKey(storedPublicKey);
      setIsLogged(true);
      getAccountBalance(storedPublicKey);
      getPaymentsHistory(storedPublicKey).then((paymentsHistory: IPaymentHistory[]) => {
        setPaymentsHistory(paymentsHistory);
      });
    }
  }, []);

  useEffect(() => {
    setDisplayedPayments(
      paginatePaymentsHistory(paymentsHistory, currentPage, paymentsPerPage)
    );
    setNumberOfPages(Math.ceil(paymentsHistory.length / paymentsPerPage));
  }, [paymentsHistory, currentPage, paymentsPerPage]);

  return (
    <>
      <div className="min-h-screen bg-cyan-950">
        <Navbar
          publicKey={publicKey}
          isLogged={isLogged}
          setIsLogged={setIsLogged}
        />
        <Balance
          balance={balance}
          setShowPaymentModal={setShowPaymentModal}
          isFunded={isFunded}
        />
        <KeyView publicKey={publicKey} />
        <UnfundedMessage isFunded={isFunded} />

        <PaymentModal
          showPaymentModal={showPaymentModal}
          setShowPaymentModal={setShowPaymentModal}
          handleSendPayment={handleSendPayment}
          handleInputChange={handleInputChange}
          formError={formError}
          setPaymentSummary={setPaymentSummary}
          setFormError={setFormError}
          paymentResponse={paymentResponse}
          color={alertColor}
          isFunded={isFunded}
        />
                <div>
          <div className="flex flex-col">
            <h1 className="text-3xl mt-6 p-4" data-cy="payments-history-title">
              Payments History
            </h1>
            <Pagination
              numberOfPages={numberOfPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
          {displayedPayments.length === 0 && (
            <p className="ml-8" data-cy="no-payments-message">
              There are no payments to show
            </p>
          )}
          {displayedPayments.map((paymentHistory, index) => (
            <HistoricalPayments
              key={index}
              index={index}
              historicalPayment={paymentHistory}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

const Balance: FC<{
  balance: string | undefined;
  setShowPaymentModal: (value: boolean) => void;
  isFunded: boolean;
}> = ({ balance, setShowPaymentModal, isFunded }) => {
  return (
    <div className="flex flex-col w-full p-4 bg-cyan-900 shadow-lg">
      <h1 className="text-3xl mt-6" data-cy="balance-title">
        Your Balance
      </h1>
      <div className="flex">
        <p className="text-4xl font-bold mt-8 p-2" data-cy="balance-value">
          {balance || 0} Lumens (XLM)
        </p>
        <SendPaymentButton
          setShowPaymentModal={setShowPaymentModal}
          isFunded={isFunded}
        />
      </div>
    </div>
  );
};

const KeyView: FC<{ publicKey: string }> = ({ publicKey }) => {
  return (
    <div className="flex flex-col w-full p-4 bg-cyan-900 shadow-lg">
      <h1 className="text-3xl mt-6" data-cy="public-key-title">
        Your Stellar Public Key
      </h1>
      <p
        className="text-4xl font-bold mt-8 p-2 break-words"
        data-cy="public-key-value"
      >
        {publicKey}
      </p>
    </div>
  );
};

const UnfundedMessage: FC<{ isFunded: boolean }> = ({ isFunded }) => {
  return (
    <div className="bg-cyan-900 flex justify-center">
      {!isFunded ? (
        <div className="text-white px-6 py-4 border-0 rounded flex justify-center mb-4 bg-red-500 w-1/2">
          <span className="text-xl inline-block mr-5 align-middle"></span>
          <span className="inline-block align-middle mr-8">
            This account is currently inactive. To activate it, send at least 1
            lumen (XLM) to the Stellar public key displayed above.
          </span>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

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

export default Dashboard;
