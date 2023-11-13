import type { Transaction } from "stellar-sdk";
import type { FC } from "react";

export default interface IWallet {
  getPublicKey(privateKey?: string): Promise<string>;
  sign(tx: Transaction, privateKey?: string): Promise<string>;
  getName(): string;
  getFriendlyName(): string;
  getExtension(): string;
  getIconComponent(): FC;
}
