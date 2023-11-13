import LocalStorage from "../helpers/storage";
import type IWallet from "../interfaces/wallet";
import InvalidWalletError from "./errors/InvalidWallet";
import Albedo from "./albedo/Albedo";

export default class WalletFactory {
  createAll(): IWallet[] {
    return [Albedo.NAME].map(this.create);
  }

  create(name: string) {
    let wallet: IWallet;
    const storage = new LocalStorage();
    switch (name) {
      case Albedo.NAME:
        wallet = new Albedo(storage);
        break;
      default:
        throw new InvalidWalletError();
    }
    return wallet;
  }
}
