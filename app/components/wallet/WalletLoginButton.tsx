import IWallet from "../../interfaces/wallet";
import { FC } from "react";

const WalletLoginButton: FC<{
  wallet: IWallet;
  handleLogin: (wallet: IWallet) => Promise<void>;
}> = ({ wallet, handleLogin }) => {
  const walletName = wallet.getFriendlyName();
  const Icon = wallet.getSvgIcon();

  return (
    <a
      className="flex items-center bg-slate-900 text-white active:bg-slate-600 font-bold rounded shadow-md hover:shadow-xl outline-none focus:outline-none ease-linear transition-all duration-150 text-xl mt-9 justify-center w-96 h-20 hover:cursor-pointer"
      onClick={() => handleLogin(wallet)}
      data-cy={`${wallet.getName()}-login-button`}
    >
      <Icon />
      <span className="ml-4">Connect with {walletName}</span>
    </a>
  );
};

export default WalletLoginButton;
