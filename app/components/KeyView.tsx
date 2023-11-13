import { FC } from "react";

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

export default KeyView;