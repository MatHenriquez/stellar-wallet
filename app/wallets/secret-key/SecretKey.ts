import type { Transaction } from "stellar-sdk";
import { Keypair } from "stellar-sdk";
import SecretKeyIcon from "../../components/wallet/SecretKeyIcon";
import AbstractWallet from "../AbstractWallet";
import type IWallet from "../../interfaces/wallet";

export default class SecretKey extends AbstractWallet implements IWallet {
  public static NAME = "secretKey";
  public static FRIENDLY_NAME = "Secret key";

  public override async getPublicKey(secretKey: string) {
    const requestPublicKey = Keypair.fromSecret(secretKey);
    this.storage.storeItem("publicKey", requestPublicKey.publicKey());
    super.persistWallet();
    return requestPublicKey.publicKey();
  }

  public override async sign(tx: Transaction, secretKey: string) {
    const keyPair = Keypair.fromSecret(secretKey);
    tx.sign(keyPair);
    return tx.toXDR();
  }

  public override getName(): string {
    return SecretKey.NAME;
  }

  public override getFriendlyName(): string {
    return SecretKey.FRIENDLY_NAME;
  }

  public override getIconComponent(): typeof SecretKeyIcon {
    return SecretKeyIcon;
  }
}
