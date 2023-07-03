import { PeraWalletConnect } from '@perawallet/connect';

export const connectToPera = async (
  setAddresses: Function,
  setAddress: Function,
  peraWallet: PeraWalletConnect
) => {
  function handleDisconnectWalletClick() {
    peraWallet.disconnect();
    setAddresses([]);
    setAddress(0);
  }

  peraWallet
    .connect()
    .then((newAccounts) => {
      peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);
      setAddresses(newAccounts);
      setAddress(0);
    })
    .catch((error) => {
      if (error?.data?.type !== 'CONNECT_MODAL_CLOSED') {
        console.log(error);
      }
    });
};
