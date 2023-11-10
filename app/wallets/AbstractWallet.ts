import { Transaction } from "stellar-sdk";
import ILocalStorage from "../interfaces/storage";
import { FC } from "react";
import IWallet from "../interfaces/wallet";
import NotImplementedError from "./errors/NotImplementedMethod";

export default abstract class AsbtractWallet implements IWallet {
  protected readonly WALLET_STORAGE_KEY = "wallet";
  constructor(protected storage: ILocalStorage) {}

  public getName(): string {
    throw new NotImplementedError();
  }

  public getFriendlyName(): string {
    throw new NotImplementedError();;
}

  public getPublicKey(_privateKey?: string): Promise<string> {
    throw new NotImplementedError();
  }

  public sign(_tx: Transaction): Promise<string> {
    throw new NotImplementedError();
  }

  public getExtension(): string {
    throw new NotImplementedError();
  }

  public getSvgIcon(): FC {
    throw new NotImplementedError();
  }

  protected persistWallet() {
    this.storage.clearStorage(this.WALLET_STORAGE_KEY);
    this.storage.storeItem(this.WALLET_STORAGE_KEY, this.getName());
  }
}
