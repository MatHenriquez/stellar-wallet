const { NEXT_PUBLIC_STELLAR_TESTNET_NETWORK } = process.env;

const StellarNetWork = {
  TESTNET: NEXT_PUBLIC_STELLAR_TESTNET_NETWORK || "",
};

export default StellarNetWork;
