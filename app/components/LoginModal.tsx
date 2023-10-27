"use client";

import { FC } from "react";

const LoginModal: FC<{
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  secretKey: string;
  setSecretKey: (value: string) => void;
  login: (secretKey: string) => void;
  errorMessage: string;
  setErrorMessage: (value: string) => void;
}> = ({ showModal, setShowModal, secretKey, setSecretKey, login, errorMessage, setErrorMessage }) => {
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setErrorMessage("");
    setSecretKey(e.target.value);
  }

  function handleLoginClick(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    login(secretKey);
  }

  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none dark:bg-neutral-600">
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Sign in with a secret Key
                  </h3>
                </div>

                <div className="relative p-6 flex-auto">
                  <form action="">
                    <input
                      type="password"
                      className="bg-slate-800 w-full"
                      placeholder="Secret key..."
                      onChange={handleInputChange}
                    />
                    <p className="text-red-600 bg-red-100">{errorMessage}</p>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 mt-6 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleLoginClick}
                    >
                      Sign In
                    </button>
                  </form>
                </div>

                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default LoginModal;
