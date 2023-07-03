import { Paper, Stack, Button, Badge, Text } from '@mantine/core';
import { useState, useEffect } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

import AmountContainer from './AmountContainer';
import { useStore, useResponse } from '@/store/store';
import { Coin } from '@/store/types';
import { connectToPera } from '@/utils/connectWallet';
import { queryGlobalPool, supplyAmm, withdrawAmm } from '@/services/transactions';

const Pools = (contractAddress: string, appId: number, peraWallet: PeraWalletConnect) => {
  const response = useResponse((state) => state.response);
  const setResponse = useResponse((state) => state.setResponse);

  const [algoCoin, setAlgoCoin] = useState<Coin>({
    token: 'USDC',
  });

  const yesToken = useStore((state) => state.yesToken);
  const noToken = useStore((state) => state.noToken);
  const poolToken = useStore((state) => state.poolToken);
  const result = useStore((state) => state.result);
  const poolFundingReserves = useStore((state) => state.poolFundingReserves);
  const poolTokensOutstanding = useStore((state) => state.poolTokensOutstanding);
  const selectedAddress = useStore((state) => state.selectedAddress);
  const setAddresses = useStore((state) => state.setAddresses);
  const selectAddress = useStore((state) => state.selectAddress);
  const setYesToken = useStore((state) => state.setYesToken);
  const setNoToken = useStore((state) => state.setNoToken);
  const setPoolToken = useStore((state) => state.setPoolToken);
  const setPoolFundingReserves = useStore((state) => state.setPoolFundingReserves);
  const setPoolTokensOutstanding = useStore((state) => state.setPoolTokensOutstanding);
  const setResult = useStore((state) => state.setResult);

  const [accountAddress, setAccountAddress] = useState<string | null>(null);

  useEffect(() => {
    queryGlobalPool(
      appId,
      setYesToken,
      setNoToken,
      setPoolToken,
      setPoolTokensOutstanding,
      setPoolFundingReserves,
      setResult
    );
  }, [response]);

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);

        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();

    setAccountAddress(null);
  }

  return (
    <Paper mx="auto" sx={{ maxWidth: 800 }} p="md" radius="xl" withBorder shadow="xl">
      <Stack>
        {result > 0 ? (
          <>
            <Badge size="xl" radius="xl" color="gold" component="a">
              Reserves:
            </Badge>
            <Text
              component="span"
              align="center"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
              size="xl"
              weight={700}
              style={{ fontFamily: 'Greycliff CF, sans-serif' }}
            >
              USDC: {(poolFundingReserves / 1000000).toFixed(6)}
            </Text>
            <Text
              component="span"
              align="center"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
              size="xl"
              weight={700}
              style={{ fontFamily: 'Greycliff CF, sans-serif' }}
            >
              LP Tokens: {(poolTokensOutstanding / 1000000).toFixed(6)}
            </Text>
          </>
        ) : (
          <>
            <Text
              component="span"
              align="center"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
              size="xl"
              weight={700}
              style={{ fontFamily: 'Greycliff CF, sans-serif' }}
            >
              Pool USDC Reserves: {(poolFundingReserves / 1000000).toFixed(6)}
            </Text>
            <Text
              component="span"
              align="center"
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
              size="xl"
              weight={700}
              style={{ fontFamily: 'Greycliff CF, sans-serif' }}
            >
              LP Tokens Outstanding: {(poolTokensOutstanding / 1000000).toFixed(6)}
            </Text>
          </>
        )}
        <AmountContainer coin={algoCoin} setCoin={setAlgoCoin} />

        {accountAddress ? (
          <>
            {result > 0 ? (
              <Button
                onClick={() => {
                  if (selectedAddress && algoCoin.amount)
                    return withdrawAmm(
                      contractAddress,
                      appId,
                      algoCoin.amount,
                      selectedAddress,
                      poolToken,
                      setResponse,
                      peraWallet
                    );
                }}
                m={4}
                radius="xl"
              >
                Withdraw from AMM
                {algoCoin.amount
                  ? (
                      (algoCoin.amount * (poolFundingReserves / 1000000)) /
                      (poolTokensOutstanding / 1000000)
                    ).toFixed(6) + 'USDC'
                  : ''}
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    if (accountAddress && algoCoin.amount)
                      return supplyAmm(
                        contractAddress,
                        appId,
                        algoCoin.amount,
                        selectedAddress,
                        yesToken,
                        noToken,
                        poolToken,
                        setResponse,
                        peraWallet
                      );
                  }}
                  m={4}
                  radius="xl"
                >
                  Supply to AMM {algoCoin.amount} {algoCoin.token}
                </Button>
                <Button
                  onClick={() => {
                    if (selectedAddress && algoCoin.amount)
                      return withdrawAmm(
                        contractAddress,
                        appId,
                        algoCoin.amount,
                        selectedAddress,
                        poolToken,
                        setResponse,
                        peraWallet
                      );
                  }}
                  m={4}
                  radius="xl"
                >
                  Withdraw from AMM{' '}
                  {algoCoin.amount && poolTokensOutstanding
                    ? (
                        (algoCoin?.amount * (poolFundingReserves / 1000000)) /
                        (poolTokensOutstanding / 1000000)
                      ).toFixed(6) + ' USDC'
                    : ''}
                </Button>
              </>
            )}
          </>
        ) : (
          <Button
            onClick={() => {
              if (!selectedAddress) return connectToPera(setAddresses, selectAddress, peraWallet);
            }}
            m={4}
            radius="xl"
          >
            Connect to wallet
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default Pools;
