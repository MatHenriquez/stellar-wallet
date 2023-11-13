import { FC } from "react";

const UnfundedMessage: FC<{ isFunded: boolean }> = ({ isFunded }) => {
  return (
    <div className="bg-cyan-900 flex justify-center">
      {!isFunded ? (
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

export default UnfundedMessage;
