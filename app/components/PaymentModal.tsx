import { FC } from "react";
import { IPaymentSummary } from "../interfaces/payments";
import { IFormErrors } from "../interfaces/errors";
import PaymentResponseAlert from "./PaymentResponseAlert";
import IWallet from "@component/interfaces/wallet";
import SignButtons from "./wallet/SignButton";
import SecretKey from "@component/wallets/secret-key/SecretKey";

const PaymentModal: FC<{
  showPaymentModal: boolean;
  setShowPaymentModal: (value: boolean) => void;
  handleSendPayment: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formError: IFormErrors;
  setPaymentSummary: (value: IPaymentSummary) => void;
  setFormError: (value: IFormErrors) => void;
  paymentResponse: string;
  color: string;
  isFunded: boolean;
  wallets: IWallet[];
  handleSignWithWallet: (wallet: IWallet) => void;
  signError: string;
  secretKeyInputVisible: boolean;
}> = ({
  showPaymentModal,
  setShowPaymentModal,
  handleSendPayment,
  handleInputChange,
  formError,
  setPaymentSummary,
  setFormError,
  paymentResponse,
  color,
  isFunded,
  wallets,
  handleSignWithWallet,
  signError,
  secretKeyInputVisible,
}) => {
  const handleResetModal = () => {
    setShowPaymentModal(false);
    setPaymentSummary({} as IPaymentSummary);
    setFormError({} as IFormErrors);
  };

  return (
    <>
      {showPaymentModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-cyan-900 outline-none focus:outline-none">
                <div
                  className="flex items-start justify-between p-5 border-blueGray-200 rounded-t w-screen"
                  data-cy="payment-modal"
                >
                  <h3
                    className="text-3xl font-semibold"
                    data-cy="send-payment-modal-title"
                  >
                    Send Lumens
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={handleResetModal}
                    disabled={!isFunded}
                  >
                    <span className="h-6 w-6 text-2xl">×</span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                  <PaymentForm
                    handleSendPayment={handleSendPayment}
                    handleInputChange={handleInputChange}
                    wallets={wallets}
                    handleSignWithWallet={handleSignWithWallet}
                    secretKeyInputVisible={secretKeyInputVisible}
                  />
                  <PaymentResponseAlert
                    paymentResponse={paymentResponse}
                    color={color}
                  />
                  <FormErrors formError={formError} />
                  {signError ? (
                    <span className="text-red-500 font-bold">*{signError}</span>
                  ) : null}
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-2 bg-red-500"
                    type="button"
                    onClick={handleResetModal}
                    data-cy="close-payment-modal-button"
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

const PaymentForm: FC<{
  handleSendPayment: (event: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  wallets: IWallet[];
  handleSignWithWallet: (wallet: IWallet) => void;
  secretKeyInputVisible: boolean;
}> = ({
  handleSendPayment,
  handleInputChange,
  wallets,
  handleSignWithWallet,
  secretKeyInputVisible,
}) => {
  return (
    <div>
      <form action="" className="flex flex-col" onSubmit={handleSendPayment}>
        <label htmlFor="amount" data-cy="amount-label">
          Amount
        </label>
        <input
          className="px-2 py-1 placeholder-blueGray-300 text-black relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-5/6"
          type="text"
          name="amount"
          id="amount"
          onChange={handleInputChange}
          data-cy="amount-input"
        />
        <label
          htmlFor="destination-public-key"
          data-cy="destination-account-label"
        >
          Destination
        </label>
        <input
          className="px-2 py-1 placeholder-blueGray-300 text-black relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-5/6"
          type="text"
          name="destinationPublicKey"
          id="destination-public-key"
          onChange={handleInputChange}
          data-cy="destination-account-input"
        />
        <label htmlFor="memo" data-cy="memo-label">
          Memo (Optional)
        </label>
        <input
          className="px-2 py-1 placeholder-blueGray-300 text-black relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-5/6"
          type="text"
          name="memo"
          id="memo"
          onChange={handleInputChange}
          data-cy="memo-input"
        />

        <label htmlFor="signer-key" data-cy="signer-account-label">
          Signer
        </label>
        {secretKeyInputVisible ? (
          <input
            className="px-2 py-1 placeholder-blueGray-300 text-black relative bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-5/6"
            type="password"
            name="signerKey"
            id="signer-key"
            onChange={handleInputChange}
            data-cy="signer-account-input"
          />
        ) : (
          <span className="font-bold text-green-500">✔ Signed!</span>
        )}

        {secretKeyInputVisible ? (
          <div>
            <span data-cy="sign-transaction-message">Or sign with:</span>
            {wallets.map((wallet, index) => {
              if (wallet.getName() !== SecretKey.NAME)
                return (
                  <SignButtons
                    key={index}
                    wallet={wallet}
                    handleSignWithWallet={handleSignWithWallet}
                  />
                );
            })}
          </div>
        ) : null}

        <input
          className="font-bold uppercase px-6 py-2 w-1/6 mt-4 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-2 bg-emerald-600"
          type="submit"
          value="Send"
          data-cy="send-payment-modal-button"
        />
      </form>
    </div>
  );
};

const FormErrors: FC<{ formError: IFormErrors }> = ({
  formError: { amountError, destinationPublicKeyError, signerKeyError },
}) => {
  return (
    <div className="text-red-500 font-bold">
      {amountError ? (
        <p data-cy="amount-error-message">*{amountError}</p>
      ) : null}
      {destinationPublicKeyError ? (
        <p data-cy="destination-account-error-message">
          *{destinationPublicKeyError}
        </p>
      ) : null}
      {signerKeyError ? (
        <p data-cy="signer-account-error-message">*{signerKeyError}</p>
      ) : null}
    </div>
  );
};

export default PaymentModal;
