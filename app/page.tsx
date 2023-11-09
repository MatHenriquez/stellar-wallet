"use client";

import { FC, useState, useEffect } from "react";
import { generateKeys } from "./helpers/generateKeys";
import { Keypair } from "stellar-sdk";
import { IKeyPair } from "./interfaces/keys";
import InfoModal from "./components/InfoModal";
import LoginModal from "./components/LoginModal";
import loginHelper from "./helpers/login";
import Footer from "./components/Footer";
import loginWithAlbedo from "./helpers/albedo";

const Index: FC = () => {
  const [keys, setKeys] = useState({} as IKeyPair);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginKey, setLoginKey] = useState("" as string);
  const [errorMessage, setErrorMessage] = useState("" as string);
  const [albedoError, setAlbedoError] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { Modal, Ripple, initTE } = await import("tw-elements");
      initTE({ Modal, Ripple });
    };
    init();
  }, []);

  function handleCreateClick(): void {
    const newKeys: Keypair = generateKeys();

    const generatedKeys: IKeyPair = {} as IKeyPair;
    generatedKeys.publicKey = newKeys.publicKey();
    generatedKeys.secretKey = newKeys.secret();

    setKeys(generatedKeys);
  }

  function handleLogin(secretKey: string): void {
    try {
      const publickKey: string = loginHelper.getPublicKey(secretKey);
      loginHelper.savePublicKey(publickKey);
      loginHelper.redirectToDashboard();
    } catch (error) {
      setErrorMessage("Invalid secret key");
    }
  }

  async function handleAlbedoLogin() {
    const albedoResponse = await loginWithAlbedo();
    if (albedoResponse) {
      loginHelper.savePublicKey(albedoResponse.pubkey);
      loginHelper.redirectToDashboard();
    } else {
      setAlbedoError(true);
    }
  }

  return (
    <>
      <div
        id="home-container"
        className="grid grid-cols-1 grid-rows-6 h-screen bg-cyan-950"
      >
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

        <div className="grid place-items-center">
          <a
            className="bg-slate-900 text-white active:bg-slate-600 font-bold px-16 py-5 rounded shadow-md hover:shadow-xl outline-none focus:outline-none ease-linear transition-all duration-150 text-xl mt-4"
            onClick={handleAlbedoLogin}
            data-cy="albedo-login-button"
          >
            Connect with Albedo
          </a>

          {albedoError ? <AlbedoError setAlbedoError={setAlbedoError} /> : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 place-items-center row-span-5">
          <div className="relative mb-12 px-3 lg:mb-0">
            <a
              className="cursor-pointer underline underline-offset-8"
              onClick={() => setShowLoginModal(true)}
            >
              Sign In with your Secret Key
            </a>
          </div>

          <div className="relative mb-12 px-3 lg:mb-0">
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
          <InfoModal publicKey={keys.publicKey} secretKey={keys.secretKey} />
          {showLoginModal ? (
            <LoginModal
              showModal={showLoginModal}
              setShowModal={setShowLoginModal}
              login={handleLogin}
              secretKey={loginKey}
              setSecretKey={setLoginKey}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  );
};

const AlbedoError: FC<{ setAlbedoError: (value: boolean) => void }> = ({
  setAlbedoError,
}) => {
  return (
    <div className="flex flex-row bg-red-100 border border-red-400 text-red-700 rounded mt-4">
      <strong className="font-bold px-4 py-3">Error!</strong>
      <button
        className="ml-2 mb-4 bg-red-700 px-1 text-white"
        onClick={() => setAlbedoError(false)}
      >
        X
      </button>
    </div>
  );
};

export default Index;
