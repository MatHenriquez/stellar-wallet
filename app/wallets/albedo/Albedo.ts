import type { Transaction } from "stellar-sdk";
import AlbedoIcon from "../../components/wallet/AlbedoIcon";
import type ILocalStorage from "../../interfaces/storage";
import AbstractWallet from "./../AbstractWallet";
import type IWallet from "../../interfaces/wallet";
import StellarNetWork from "../../constants";
import albedo from "@albedo-link/intent";

export default class Albedo extends AbstractWallet implements IWallet {
  public static NAME = "albedo";
  public static FRIENDLY_NAME = "Albedo";
  public static albedoExtension = "https://albedo.link/";
  public albedoNetwork: string;

  constructor(storage: ILocalStorage) {
    super(storage);
    this.albedoNetwork = StellarNetWork.TESTNET;
  }

  public override async getPublicKey(): Promise<string> {
    const requestPublicKey = await albedo.publicKey({});
    super.persistWallet();
    return requestPublicKey.pubkey;
  }

  public override async sign(tx: Transaction) {
    const signedXdr = await albedo.tx({
      xdr: tx.toXDR(),
      network: this.albedoNetwork,
    });
    return signedXdr.signed_envelope_xdr;
  }

  public override getName(): string {
    return Albedo.NAME;
  }

  public override getFriendlyName(): string {
    return Albedo.FRIENDLY_NAME;
  }

  public override getIconComponent(): typeof AlbedoIcon {
    return AlbedoIcon;
  }

  public override getExtension(): string {
    return Albedo.albedoExtension;
  }
}
