"use client";
import React, { FC, useEffect, useState } from "react";
import Navbar from "../components/Header";
import accountHelper from "../helpers/account";
import Footer from "../components/Footer";

const Dashboard: FC = () => {
  const [isFunded, setIsFunded] = useState(true);
  const [publicKey, setPublicKey] = useState("" as string);
  const [isLogged, setIsLogged] = useState(true);
  const [balance, setBalance] = useState("" as string | undefined);

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
        <BalanceData balance={balance} />
        <KeyView publicKey={publicKey} />
        <UnfundedMessage isFunded={isFunded} />
      </div>
      <Footer />
    </>
  );
};

const BalanceData: FC<{ balance: string | undefined }> = ({ balance }) => {
  return (
    <div className="flex flex-col w-full p-4 bg-cyan-900 shadow-lg">
      <h1 className="text-3xl mt-6" data-cy="balance-title">
        Your Balance
      </h1>
      <p className="text-4xl font-bold mt-8 p-2" data-cy="balance-value">
        {balance} Lumens (XLM)
      </p>
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
      {isFunded ? (
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

export default Dashboard;
