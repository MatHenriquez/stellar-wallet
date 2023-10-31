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

  try {
    const account = await loadAccount(publicKey);
    return account.balances.find(
      (balance) => balance.asset_type === "native"
    )?.balance;
  } catch (error) {
    throw Error("Unfunded account");
  }
};

export default { loadAccount, getBalance };
