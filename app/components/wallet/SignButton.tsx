import type { FC } from "react";
import type IWallet from "../../interfaces/wallet";

const SignButton: FC<{
  wallet: IWallet;
  handleSignWithWallet: (wallet: IWallet) => void;
}> = ({ wallet, handleSignWithWallet }) => {
  const walletName = wallet.getFriendlyName();
  return (
    <a
      data-cy={`sign-with-${wallet.getName()}`}
      className="underline ml-2 hover:cursor-pointer"
      onClick={() => handleSignWithWallet(wallet)}
    >
      {walletName}
    </a>
  );
};

export default SignButton;
