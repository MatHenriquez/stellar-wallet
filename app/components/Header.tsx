"use client";
import React, { FC, useState } from "react";

const Navbar: FC<{
  publicKey: string;
  isLogged: boolean;
  setIsLogged: (value: boolean) => void;
}> = ({ publicKey, isLogged, setIsLogged }) => {
  const [linkText, setLinkText] = useState("copy");

  const handleCopyText: (text: string) => void = (text): void => {
    const DELAY_IN_MILLISECONDS = 1000;

    navigator.clipboard.writeText(text);
    setLinkText("copied!");

    setTimeout(() => {
      setLinkText("copy");
    }, DELAY_IN_MILLISECONDS);
  };

  const handleLogOut: () => void = () => {
    if (isLogged) {
      localStorage.removeItem("publicKey");
      setIsLogged(false);
      window.location.href = "/";
    } else {
      window.location.href = "/";
    }
  };

  return (
    <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-cyan-950 mb-3" data-cy="header-container">
      <div className="px-4 flex flex-wrap items-center justify-between w-full">
        <Brand />
        <UserKey
          publicKey={publicKey}
          handleCopyText={handleCopyText}
          linkText={linkText}
        />
        <LogOutButton handleLogOut={handleLogOut} isLogged={isLogged} />
      </div>
    </nav>
  );
};

const Brand: FC = () => {
  return (
    <a
      className="text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
      href="#"
    >
      My_Wallet
    </a>
  );
};

const UserKey: FC<{
  publicKey: string;
  handleCopyText: (text: string) => void;
  linkText: string;
}> = ({ publicKey, handleCopyText, linkText }) => {
  const abbreviatePublicKey: (key: string) => string = (
    publicKey: string
  ): string => {
    return publicKey.slice(0, 5) + "..." + publicKey.slice(-2);
  };

  return (
    <div className="flex">
      <p className="text-sm font-bold mr-2">{abbreviatePublicKey(publicKey)}</p>
      <button
        className="text-sm underline underline-offset-2"
        onClick={() => handleCopyText(publicKey)}
      >
        {linkText}
      </button>
    </div>
  );
};

const LogOutButton: FC<{ handleLogOut: () => void; isLogged: boolean }> = ({
  handleLogOut,
  isLogged,
}) => {
  return (
    <button
      className="underline underline-offset-2"
      type="button"
      onClick={handleLogOut}
    >
      {isLogged ? "Sign out" : "Sign in"}
    </button>
  );
};

export default Navbar;
