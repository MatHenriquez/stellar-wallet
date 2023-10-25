"use client";

import { FC } from "react";
import { generateKeys } from "./helpers/generateKeys";
import { Keypair } from "stellar-sdk";
import { useState } from "react";

interface KeyPair {
  publicKey: string;
  secretKey: string;
}

const Index: FC = () => {

  const [keys, setKeys] = useState({} as KeyPair);

  function handleCreateClick(): KeyPair {
    const newKeys: Keypair = generateKeys();

    const generatedKeys: KeyPair = {} as KeyPair;
    generatedKeys.publicKey = newKeys.publicKey();
    generatedKeys.secretKey = newKeys.secret();

    setKeys(generatedKeys);
  }

  return (
    <div className="grid grid-cols-1 grid-rows-6 h-screen bg-cyan-950">
      <nav className="relative flex w-full flex-wrap items-center justify-between py-2 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700  lg:py-4">
        <div className="flex w-full flex-wrap items-center justify-between px-3">
          <div className="ml-10">
            <a
              className="text-xl font-semibold text-neutral-800 dark:text-neutral-200"
              href="#"
            >
              My_Wallet
            </a>
          </div>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 place-items-center row-span-5">
        <div className="relative mb-12 px-3 lg:mb-0">
          <a className="cursor-pointer underline underline-offset-8">
            Sign In with your Secret Key
          </a>
        </div>

        <div className="relative mb-12 px-3 lg:mb-0">
          <a className="cursor-pointer underline underline-offset-8" onClick={handleCreateClick}>
            Create new keys and Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
