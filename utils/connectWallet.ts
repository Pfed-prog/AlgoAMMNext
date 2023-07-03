import { PeraWalletConnect } from '@perawallet/connect';

const peraWallet = new PeraWalletConnect({
  shouldShowSignTxnToast: false,
});

export const connectToMyAlgo = async (set: Function, setAddress: Function) => {
  peraWallet.connect().then((newAccounts) => {
    // Setup the disconnect event listener
    // peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);

    set(newAccounts);
    setAddress(newAccounts[0]);
  });

  console.log(888);
};
