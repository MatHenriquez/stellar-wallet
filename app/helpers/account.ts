import { Server } from "stellar-sdk";
const server: Server = new Server("https://horizon-testnet.stellar.org");

const loadAccount = async (publicKey: string) => {
  try {
    return await server.loadAccount(publicKey);
  } catch (error) {
    throw new Error("Unfunded account");
  }
};

const getBalance = async (publicKey: string): Promise<string | undefined> => {
  let balance: string | undefined = "0";

  try {
    const account = await loadAccount(publicKey);
    balance = account.balances.find(
      (balance) => balance.asset_type === "native"
    )?.balance;
  } catch (error) {
    throw Error("Unfunded account");
  }

  return balance;
};

export default { loadAccount, getBalance };
