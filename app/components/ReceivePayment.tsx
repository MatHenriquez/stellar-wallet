import { FC, useState } from "react";
import QRcode from "qrcode.react";

const ReceivePayment: FC<{
  destinationPublicKey: string;
  showQr: boolean;
  setShowQr: (value: boolean) => void;
}> = ({ destinationPublicKey, setShowQr, showQr }) => {
  const [linkText, setLinkText] = useState("Copy public key");

  const handleCopyText: (text: string) => void = (text): void => {
    const DELAY_IN_MILLISECONDS = 1000;
    navigator.clipboard.writeText(text);
    setLinkText("Copied!");
    setTimeout(() => {
      setLinkText("Copy public key");
    }, DELAY_IN_MILLISECONDS);
  };

  return (
    <>
      <ReceivePaymentButton setShowQr={setShowQr} />
      {showQr ? (
        <ReceivePaymentModal
          destinationPublicKey={destinationPublicKey}
          linkText={linkText}
          handleCopyText={handleCopyText}
          setShowQr={setShowQr}
        />
      ) : null}
    </>
  );
};

const ReceivePaymentButton: FC<{ setShowQr: (show: boolean) => void }> = ({
  setShowQr,
}) => {
  return (
    <button
      className="flex bg-indigo-950 text-white active:bg-indigo-800 font-bold uppercase text-l px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none ml-8 mr-1 mb-1 ease-linear transition-all duration-150 self-center disabled:bg-gray-400"
      data-cy="receive-payment-button"
      onClick={() => setShowQr(true)}
    >
      <QRIcon />
      <span className="ml-2">Receive</span>
    </button>
  );
};

const ReceivePaymentModal: FC<{
  destinationPublicKey: string;
  linkText: string;
  handleCopyText: (text: string) => void;
  setShowQr: (show: boolean) => void;
}> = ({ destinationPublicKey, linkText, handleCopyText, setShowQr }) => {
  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        data-cy="receive-payment-modal"
      >
        <div className="relative w-auto my-6 mx-auto max-w-sm">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-cyan-950 outline-none focus:outline-none">
            <ModalTitle />
            <ModalBody
              destinationPublicKey={destinationPublicKey}
              handleCopyText={handleCopyText}
              linkText={linkText}
            />
            <CloseModalButton setShowQr={setShowQr} />
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
};

const ModalTitle: FC = () => {
  return (
    <div
      className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t"
      data-cy="receive-modal-title"
    >
      <h3 className="text-3xl font-semibold">Your account QR code</h3>
    </div>
  );
};

const ModalBody: FC<{
  destinationPublicKey: string;
  handleCopyText: (text: string) => void;
  linkText: string;
}> = ({ destinationPublicKey, handleCopyText, linkText }) => {
  return (
    <div className="relative p-6 flex-auto">
      <QR destinationPublicKey={destinationPublicKey} />
      <ModalDescription />
      <CopyButton
        handleCopyText={handleCopyText}
        destinationPublicKey={destinationPublicKey}
        linkText={linkText}
      />
    </div>
  );
};

const ModalDescription: FC = () => {
  return (
    <p className="my-4" data-cy="receive-modal-description">
      Scan this QR code using a Stellar wallet app to make a payment to your
      account.
    </p>
  );
};

const CopyButton: FC<{
  handleCopyText: (text: string) => void;
  destinationPublicKey: string;
  linkText: string;
}> = ({ handleCopyText, destinationPublicKey, linkText }) => {
  return (
    <button
      className="bg-indigo-700 p-2 w-full"
      onClick={() => handleCopyText(destinationPublicKey)}
      data-cy="copy-text-modal-button"
    >
      {linkText}
    </button>
  );
};

const CloseModalButton: FC<{ setShowQr: (show: boolean) => void }> = ({
  setShowQr,
}) => {
  return (
    <div
      className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b"
    >
      <button
        className="font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 border-2 bg-red-500"
        type="button"
        onClick={() => setShowQr(false)}
        data-cy="close-receive-payment-button"
      >
        Close
      </button>
    </div>
  );
};

const QR: FC<{ destinationPublicKey: string }> = ({ destinationPublicKey }) => {
  return (
    <div
      className="flex flex-col items-center justify-center"
      data-cy="qr-code"
    >
      <div className="flex flex-col items-center justify-center">
        <QRcode value={destinationPublicKey} size={256} />
      </div>
    </div>
  );
};

const QRIcon: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
      />
    </svg>
  );
};

export default ReceivePayment;
