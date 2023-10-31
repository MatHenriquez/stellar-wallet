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
      </div>
      <Footer />
    </>
  );
};

const BalanceData: FC<{ balance: string | undefined }> = ({ balance }) => {
  return (
    <div className="flex flex-col w-full p-4 bg-cyan-900 shadow-lg">
      <h1 className="text-3xl mt-6">Your Balance</h1>
      <p className="text-4xl font-bold mt-8 p-2">{balance} Lumens (XLM)</p>
    </div>
  );
};

const KeyView: FC<{ publicKey: string }> = ({ publicKey }) => {
  return (
    <div className="flex flex-col w-full p-4 bg-cyan-900 shadow-lg">
      <h1 className="text-3xl mt-6">Your Stellar Public Key</h1>
      <p className="text-4xl font-bold mt-8 p-2 break-words">{publicKey}</p>
    </div>
  );
};

export default Dashboard;
