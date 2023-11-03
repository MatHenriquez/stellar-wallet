export interface IPaymentData {
  signerKey: string;
  destinationPublicKey: string;
  amount: string;
  memo: string;
  timeOutInSeconds: number;
  fee: number;
}

export interface IPaymentResponse {
  sourcePublicKey: string;
  destinationPublicKey: string;
  amount: string;
  status: string;
  erroeMessage?: string;
}
