"use client";
import React, { FC, useEffect, useState } from "react";
import Navbar from "../components/Header";
import accountHelper from "../helpers/account";
import Footer from "../components/Footer";
import { IPaymentSummary, IPaymentHistory } from "../interfaces/payments";
import {
  sendPayment,
  buildTransaction,
  signTransactionWithWallet,
  submitTransaction,
  getTransactionFromXdr,
} from "../helpers/payments";
import PaymentModal from "../components/PaymentModal";
import { IFormErrors } from "../interfaces/errors";
import paymentFormValidation from "../helpers/paymentFormValidation";
import getPaymentsHistory, {
  paginatePaymentsHistory,
} from "../helpers/paymentsHistory";
import HistoricalPayments from "../components/HistoricalPayments";
import Pagination from "@component/components/Pagination";
import Balance from "@component/components/Balance";
import KeyView from "@component/components/KeyView";
import UnfundedMessage from "@component/components/UnfundedMessage";
import IWallet from "@component/interfaces/wallet";
import WalletFactory from "../helpers/WalletFactory";

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
  const [showQr, setShowQr] = useState(false);
  const [wallets, setWallets] = useState([] as IWallet[]);
  const [isPaymentSignedWithWallet, setIsPaymentSignedWithWallet] =
    useState(false);
  const [signError, setSignError] = useState("" as string);
  const [walletSignedTransaction, setWalletSignedTransaction] = useState(
    "" as string
  );

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
      balance,
      isPaymentSignedWithWallet
    );
    setFormError(formErrors);
    return !(Object.keys(formErrors).length > 0);
  };

  const handleSignWithWallet = async (wallet: IWallet) => {
    const transaction = await buildTransaction(
      publicKey,
      paymentSummary.destinationPublicKey,
      paymentSummary.amount,
      paymentSummary.memo
    );

    const signedTransaction = await signTransactionWithWallet(
      transaction,
      wallet
    );
    if (!signedTransaction) setSignError("Payment signature error");

    setIsPaymentSignedWithWallet(true);
    setWalletSignedTransaction(signedTransaction || "");
    setSignError("Payment signature error");
  };

  const handleSendPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validatePaymentForm()) {
      if (isPaymentSignedWithWallet && walletSignedTransaction !== "") {
        const transaction = getTransactionFromXdr(walletSignedTransaction);
        if (transaction) await submitTransaction(transaction);
      } else await sendPayment(paymentSummary);

      setAlertColor("green");
      setPaymentResponse("Successful payment");
      setShowPaymentAlert(true);
      setPaymentSummary({} as IPaymentSummary);
      setFormError({} as IFormErrors);
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
      getPaymentsHistory(storedPublicKey).then(
        (paymentsHistory: IPaymentHistory[]) => {
          setPaymentsHistory(paymentsHistory);
        }
      );
      const wallets = WalletFactory.createAll();
      setWallets(wallets);
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
          setShowQr={setShowQr}
          showQr={showQr}
          publicKey={publicKey}
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
          wallets={wallets}
          handleSignWithWallet={handleSignWithWallet}
          signError={signError}
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

export default Dashboard;
