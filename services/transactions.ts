import { PeraWalletConnect } from '@perawallet/connect';
import algosdk from 'algosdk';

import { connectAlgod } from '@/utils/connectAlgod';
import { GlobalStateIndices } from '@/store/types';
import { usdcId } from 'contracts';

const algodClient = connectAlgod();

export const supplyAmm = async (
  contractAddress: string,
  appId: number,
  usdcAmount: number,
  selectedAddress: string,
  yesToken: number,
  noToken: number,
  poolToken: number,
  setResponse: Function,
  peraWallet: PeraWalletConnect
) => {
  try {
    const params = await algodClient.getTransactionParams().do();

    const enc = new TextEncoder();

    const accounts = undefined;
    const foreignApps = undefined;
    const foreignAssets = [usdcId, noToken, yesToken, poolToken];
    const closeRemainderTo = undefined;
    const note = undefined;
    const amount = 2000;

    usdcAmount = usdcAmount * 1000000;

    const txn1 = algosdk.makePaymentTxnWithSuggestedParams(
      selectedAddress,
      contractAddress,
      amount,
      closeRemainderTo,
      note,
      params
    );

    const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: selectedAddress,
      to: contractAddress,
      assetIndex: usdcId,
      amount: usdcAmount,
      note: note,
    });

    const txn3 = algosdk.makeApplicationNoOpTxn(
      selectedAddress,
      params,
      appId,
      [enc.encode('supply')],
      accounts,
      foreignApps,
      foreignAssets
    );

    const txnsArray = [txn1, txn2, txn3];
    algosdk.assignGroupID(txnsArray);

    try {
      const signedTxnGroups = await peraWallet.signTransaction([
        [{ txn: txn1, signers: [selectedAddress] }],
        [{ txn: txn2, signers: [selectedAddress] }],
        [{ txn: txn3, signers: [selectedAddress] }],
      ]);

      const { txId } = await algodClient.sendRawTransaction(signedTxnGroups).do();

      setResponse(txId);
      console.log(`txns signed successfully! - txID: ${txId}`);
    } catch (error) {
      console.log("Couldn't sign all txns", error);
    }
  } catch (err) {
    console.error(err);
  }
};

export const swap = async (
  contractAddress: string,
  appId: number,
  usdcAmount: number,
  tokenName: string,
  poolToken: number,
  yesToken: number,
  noToken: number,
  selectedAddress: string,
  setResponse: Function,
  peraWallet: PeraWalletConnect
) => {
  try {
    let choice;
    if (tokenName === 'Yes') {
      choice = 'buy_yes';
    }
    if (tokenName === 'No') {
      choice = 'buy_no';
    }

    const params = await algodClient.getTransactionParams().do();

    const enc = new TextEncoder();

    const accounts = undefined;
    const foreignApps = undefined;
    const foreignAssets = [usdcId, poolToken, yesToken, noToken];
    const closeRemainderTo = undefined;
    const note = undefined;
    const amount = 2000;

    usdcAmount = usdcAmount * 1000000;

    const txn1 = algosdk.makePaymentTxnWithSuggestedParams(
      selectedAddress,
      contractAddress,
      amount,
      closeRemainderTo,
      note,
      params
    );

    const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: selectedAddress,
      to: contractAddress,
      assetIndex: usdcId,
      amount: usdcAmount,
      note: note,
    });

    const txn3 = algosdk.makeApplicationNoOpTxn(
      selectedAddress,
      params,
      appId,
      [enc.encode('swap'), enc.encode(choice)],
      accounts,
      foreignApps,
      foreignAssets
    );

    const txnsArray = [txn1, txn2, txn3];
    algosdk.assignGroupID(txnsArray);

    try {
      const signedTxnGroups = await peraWallet.signTransaction([
        [{ txn: txn1, signers: [selectedAddress] }],
        [{ txn: txn2, signers: [selectedAddress] }],
        [{ txn: txn3, signers: [selectedAddress] }],
      ]);
      const { txId } = await algodClient.sendRawTransaction(signedTxnGroups).do();

      setResponse(txId);
      console.log(`txns signed successfully! - txID: ${txId}`);
    } catch (error) {
      console.log("Couldn't sign all txns", error);
    }
  } catch (err) {
    console.error(err);
  }
};

export const redeem = async (
  contractAddress: string,
  appId: number,
  tokenAmount: number,
  tokenName: string,
  yesToken: number,
  noToken: number,
  selectedAddress: string,
  setResponse: Function,
  peraWallet: PeraWalletConnect
) => {
  try {
    let tokenId = 0;
    if (tokenName == 'Yes') {
      tokenId = yesToken;
    }
    if (tokenName == 'No') {
      tokenId = noToken;
    }

    const params = await algodClient.getTransactionParams().do();

    const enc = new TextEncoder();

    const accounts = undefined;
    const foreignApps = undefined;
    const foreignAssets = [usdcId, tokenId];
    const closeRemainderTo = undefined;
    const note = undefined;
    const amount = 2000;

    tokenAmount = tokenAmount * 1000000;

    const txn1 = algosdk.makePaymentTxnWithSuggestedParams(
      selectedAddress,
      contractAddress,
      amount,
      closeRemainderTo,
      note,
      params
    );

    const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: selectedAddress,
      to: contractAddress,
      assetIndex: tokenId,
      amount: tokenAmount,
      note: note,
    });

    const txn3 = algosdk.makeApplicationNoOpTxn(
      selectedAddress,
      params,
      appId,
      [enc.encode('redeem')],
      accounts,
      foreignApps,
      foreignAssets
    );

    const txnsArray = [txn1, txn2, txn3];
    algosdk.assignGroupID(txnsArray);

    try {
      const signedTxnGroups = await peraWallet.signTransaction([
        [{ txn: txn1, signers: [selectedAddress] }],
        [{ txn: txn2, signers: [selectedAddress] }],
        [{ txn: txn3, signers: [selectedAddress] }],
      ]);

      const { txId } = await algodClient.sendRawTransaction(signedTxnGroups).do();

      setResponse(txId);
      console.log(`txns signed successfully! - txID: ${txId}`);
    } catch (error) {
      console.log("Couldn't sign all txns", error);
    }
  } catch (err) {
    console.error(err);
  }
};

export const setupAmm = async (
  contractAddress: string,
  appId: number,
  selectedAddress: string,
  setResponse: Function,
  peraWallet: PeraWalletConnect
) => {
  try {
    const params = await algodClient.getTransactionParams().do();

    const enc = new TextEncoder();

    const accounts = undefined;
    const foreignApps = undefined;
    const foreignAssets = [usdcId];
    const closeRemainderTo = undefined;
    const note = undefined;
    const amount = 510000;

    const txn1 = algosdk.makePaymentTxnWithSuggestedParams(
      selectedAddress,
      contractAddress,
      amount,
      closeRemainderTo,
      note,
      params
    );

    const txn2 = algosdk.makeApplicationNoOpTxn(
      selectedAddress,
      params,
      appId,
      [enc.encode('setup')],
      accounts,
      foreignApps,
      foreignAssets
    );

    const txnsArray = [txn1, txn2];
    algosdk.assignGroupID(txnsArray);

    try {
      const signedTxnGroups = await peraWallet.signTransaction([
        [{ txn: txn1, signers: [selectedAddress] }],
        [{ txn: txn2, signers: [selectedAddress] }],
      ]);

      const { txId } = await algodClient.sendRawTransaction(signedTxnGroups).do();

      setResponse(txId);
      console.log(`txns signed successfully! - txID: ${txId}`);
    } catch (error) {
      console.log("Couldn't sign all txns", error);
    }
  } catch (err) {
    console.error(err);
  }
};

export const withdrawAmm = async (
  contractAddress: string,
  appId: number,
  poolTokenAmount: number,
  selectedAddress: string,
  poolToken: number,
  setResponse: Function,
  peraWallet: PeraWalletConnect
) => {
  try {
    const params = await algodClient.getTransactionParams().do();

    const enc = new TextEncoder();

    const accounts = undefined;
    const foreignApps = undefined;
    const foreignAssets = [usdcId, poolToken];
    const closeRemainderTo = undefined;
    const note = undefined;
    const amount = 2000;

    poolTokenAmount = poolTokenAmount * 1000000;

    const txn1 = algosdk.makePaymentTxnWithSuggestedParams(
      selectedAddress,
      contractAddress,
      amount,
      closeRemainderTo,
      note,
      params
    );

    const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams: {
        ...params,
      },
      from: selectedAddress,
      to: contractAddress,
      assetIndex: poolToken,
      amount: poolTokenAmount,
      note: note,
    });

    const txn3 = algosdk.makeApplicationNoOpTxn(
      selectedAddress,
      params,
      appId,
      [enc.encode('withdraw')],
      accounts,
      foreignApps,
      foreignAssets
    );

    const txnsArray = [txn1, txn2, txn3];
    algosdk.assignGroupID(txnsArray);

    try {
      const signedTxnGroups = await peraWallet.signTransaction([
        [{ txn: txn1, signers: [selectedAddress] }],
        [{ txn: txn2, signers: [selectedAddress] }],
        [{ txn: txn3, signers: [selectedAddress] }],
      ]);

      const { txId } = await algodClient.sendRawTransaction(signedTxnGroups).do();

      setResponse(txId);
      console.log(`txns signed successfully! - txID: ${txId}`);
    } catch (error) {
      console.log("Couldn't sign all txns", error);
    }
  } catch (err) {
    console.error(err);
  }
};

export const OptInPool = async (
  selectedAddress: string,
  yesToken: number,
  noToken: number,
  poolToken: number,
  reserveToken: number,
  setResponse: Function,
  peraWallet: PeraWalletConnect
) => {
  try {
    const params = await algodClient.getTransactionParams().do();

    const txn1 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      amount: 0,
      from: selectedAddress,
      suggestedParams: {
        ...params,
      },
      to: selectedAddress,
      assetIndex: yesToken,
    });

    const txn2 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      amount: 0,
      from: selectedAddress,
      suggestedParams: {
        ...params,
      },
      to: selectedAddress,
      assetIndex: noToken,
    });

    const txn3 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      amount: 0,
      from: selectedAddress,
      suggestedParams: {
        ...params,
      },
      to: selectedAddress,
      assetIndex: poolToken,
    });

    const txn4 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      amount: 0,
      from: selectedAddress,
      suggestedParams: {
        ...params,
      },
      to: selectedAddress,
      assetIndex: reserveToken,
    });

    try {
      const signedTxnGroups = await peraWallet.signTransaction([
        [{ txn: txn1, signers: [selectedAddress] }],
        [{ txn: txn2, signers: [selectedAddress] }],
        [{ txn: txn3, signers: [selectedAddress] }],
        [{ txn: txn4, signers: [selectedAddress] }],
      ]);

      for (const signedTxnGroup of signedTxnGroups) {
        const { txId } = await algodClient.sendRawTransaction(signedTxnGroup).do();

        console.log(`txns signed successfully! - txID: ${txId}`);
      }
    } catch (error) {
      console.log("Couldn't sign all txns", error);
    }
  } catch (err) {
    console.error(err);
  }
};

export const queryApp = async (
  appId: number,
  setYesToken: Function,
  setNoToken: Function,
  setPoolToken: Function,
  setYesTokenReserves: Function,
  setNoTokenReserves: Function,
  setPoolTokensOutstanding: Function,
  setPoolFundingReserves: Function,
  setTokenFundingReserves: Function,
  setResult: Function
) => {
  const app = await algodClient.getApplicationByID(appId).do();

  for (const [key, value] of Object.entries(app['params']['global-state'] as GlobalStateIndices)) {
    if (value['key'] == 'eWVzX3Rva2VuX2tleQ==') {
      setYesToken(value['value']['uint']);
    }
    if (value['key'] == 'bm9fdG9rZW5fa2V5') {
      setNoToken(value['value']['uint']);
    }

    if (value['key'] == 'eWVzX3Rva2Vuc19yZXNlcnZlcw==') {
      setYesTokenReserves(value['value']['uint']);
    }

    if (value['key'] == 'bm9fdG9rZW5zX3Jlc2VydmVz') {
      setNoTokenReserves(value['value']['uint']);
    }

    if (value['key'] == 'cG9vbF90b2tlbl9rZXk=') {
      setPoolToken(value['value']['uint']);
    }
    if (value['key'] == 'cG9vbF90b2tlbnNfb3V0c3RhbmRpbmdfa2V5') {
      setPoolTokensOutstanding(value['value']['uint']);
    }

    if (value['key'] == 'cG9vbF9mdW5kaW5nX3Jlc2VydmVz') {
      setPoolFundingReserves(value['value']['uint']);
    }

    if (value['key'] == 'dG9rZW5fZnVuZGluZ19yZXNlcnZlcw==') {
      setTokenFundingReserves(value['value']['uint']);
    }

    if (value['key'] == 'cmVzdWx0') {
      setResult(value['value']['uint']);
    }
  }
};
