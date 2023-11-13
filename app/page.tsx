"use client";
import { FC, useState, useEffect } from "react";
import { generateKeys } from "./helpers/generateKeys";
import { Keypair } from "stellar-sdk";
import { IKeyPair } from "./interfaces/keys";
import InfoModal from "./components/InfoModal";
import { savePublicKey, redirectToDashboard } from "./helpers/login";
import Footer from "./components/Footer";
import WalletFactory from "./helpers/WalletFactory";
import IWallet from "./interfaces/wallet";
import WalletLoginButton from "./components/wallet/WalletLoginButton";

const Index: FC = () => {
  const [keys, setKeys] = useState({} as IKeyPair);
  const [loginKey, setLoginKey] = useState("" as string);
  const [displayError, setDisplayError] = useState(false);
  const [loginError, setLoginError] = useState("" as string);
  const [wallets, setWallets] = useState([] as IWallet[]);

  useEffect(() => {
    const wallets = WalletFactory.createAll();
    setWallets(wallets);
    const init = async () => {
      const { Modal, Ripple, initTE } = await import("tw-elements");
      initTE({ Modal, Ripple });
    };
    init();
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    console.log(e.target.value);
    setLoginKey(e.target.value);
  }

  function handleCreateClick(): void {
    const newKeys: Keypair = generateKeys();
    const generatedKeys: IKeyPair = {} as IKeyPair;
    generatedKeys.publicKey = newKeys.publicKey();
    generatedKeys.secretKey = newKeys.secret();
    setKeys(generatedKeys);
  }

  async function handleLogin(wallet: IWallet) {
    try {
      const publicKey = await wallet.getPublicKey(loginKey);
      savePublicKey(publicKey);
      redirectToDashboard();
    } catch (error) {
      console.error(error);
      setDisplayError(true);
      setLoginError("Unable to log in");
    }
  }

  return (
    <>
      <div id="home-container" className="flex flex-col h-screen bg-cyan-950">
        <nav className="relative flex w-full flex-wrap items-center justify-between py-2 text-neutral-500 shadow-lg hover:text-neutral-700 focus:text-neutral-700 lg:py-4 h-24">
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

        <div className="flex flex-col h-5/6 justify-around items-center">
          <div>
            {wallets.map((wallet, index) => (
              <WalletLoginButton
                wallet={wallet}
                handleLogin={handleLogin}
                key={index}
              />
            ))}

            <input
              type="password"
              placeholder="Paste your secret key"
              className="w-96 bg-cyan-700 text-white"
              onChange={handleInputChange}
              data-cy="secret-key-input"
            />
          </div>

          {displayError ? (
            <LoginError
              setDisplayError={setDisplayError}
              loginError={loginError}
            />
          ) : null}

          <a
            className="cursor-pointer underline underline-offset-8"
            onClick={handleCreateClick}
            data-te-toggle="modal"
            data-te-target="#info-modal"
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            Create new keys and Sign Up
          </a>
        </div>
      </div>

      <InfoModal publicKey={keys.publicKey} secretKey={keys.secretKey} />

      <Footer />
    </>
  );
};

const LoginError: FC<{
  setDisplayError: (value: boolean) => void;
  loginError: string;
}> = ({ setDisplayError, loginError }) => {
  return (
    <div className="flex flex-row bg-red-100 border border-red-400 text-red-700 rounded mt-4">
      <strong className="font-bold px-4 py-3" data-cy="login-error-message">
        {loginError}
      </strong>
      <button
        className="ml-2 mb-4 bg-red-700 px-1 text-white"
        onClick={() => setDisplayError(false)}
        data-cy="error-message-close-button"
      >
        X
      </button>
    </div>
  );
};

export default Index;
