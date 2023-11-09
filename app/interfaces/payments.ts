export interface IPaymentSummary {
  signerKey: string;
  destinationPublicKey: string;
  amount: string;
  memo: string;
  timeOutInSeconds: number;
  fee: number;
}

export interface IPaymentHistory {
  amount: string;
  date: string;
  time: string;
  assetType: string;
  sourceAccount: string;
  destinationAccount: string;
  transactionHash: string;
  successful: boolean;
  type: string;
}