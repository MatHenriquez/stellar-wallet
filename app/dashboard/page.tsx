"use client";
import React, { FC, useEffect, useState } from "react";
import Navbar from "../components/Header";
import accountHelper from "../helpers/account";
import Footer from "../components/Footer";
import { IPaymentData } from "../interfaces/payments";
import { sendPayment } from "../helpers/payments";
import PaymentModal from "../components/PaymentModal";
import { IFormErrors } from "../interfaces/errors";
import paymentFormValidation from "../helpers/paymentFormValidation";

const Dashboard: FC = () => {
  const [isFunded, setIsFunded] = useState(true);
  const [publicKey, setPublicKey] = useState("" as string);
  const [isLogged, setIsLogged] = useState(true);
  const [balance, setBalance] = useState("" as string | undefined);
  const [paymentData, setPaymentData] = useState({} as IPaymentData);
  const [paymentResponse, setPaymentResponse] = useState("" as string);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPaymentAlert, setShowPaymentAlert] = useState(false);
  const [formError, setFormError] = useState({} as IFormErrors);
  const [alertColor, setAlertColor] = useState("" as string);

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

  const handleSendPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formErrors = paymentFormValidation.isFormDataValid(
        paymentData,
        balance
      );
      setFormError(formErrors);
      if (Object.keys(formErrors).length > 0)
        throw new Error("Invalid form data");
      await sendPayment(paymentData);
      setShowPaymentModal(false);
      getAccountBalance(publicKey);
      setPaymentResponse("Successful payment");
      setShowPaymentAlert(true);
      setAlertColor("green");
      setPaymentData({} as IPaymentData);
    } catch (error) {
      setAlertColor("red");
      setPaymentResponse("Payment Failed");
      setShowPaymentAlert(true);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  useEffect(() => {
    if (window.localStorage) {
      const storedPublicKey: string | null =
        window.localStorage.getItem("publicKey");
      if (storedPublicKey) {
        setPublicKey(storedPublicKey);
        setIsLogged(true);
        getAccountBalance(storedPublicKey);
      }
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-cyan-950">
        <Navbar
          publicKey={publicKey}
          isLogged={isLogged}
          setIsLogged={setIsLogged}
        />
        <BalanceData
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
          setPaymentData={setPaymentData}
          setFormError={setFormError}
          paymentResponse={paymentResponse}
          color={alertColor}
        />
      </div>
      <Footer />
    </>
  );
};

const BalanceData: FC<{
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
          {balance} Lumens (XLM)
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
