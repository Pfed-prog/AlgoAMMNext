import { Paper, Stack, Button, Badge, Text, Group, Center, Space } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PeraWalletConnect } from '@perawallet/connect';

import AmountContainer from '@/components/Pools/AmountContainer';
import SwapAmountContainer from '@/components/Swap/AmountContainer';
import { Coin } from '@/store/types';
import { useStore } from '@/store/store';
import { connectToPera } from '@/utils/connectWallet';
import { supplyAmm, withdrawAmm, queryApp, swap, redeem, OptInPool } from '@/services/transactions';
import { AMMs, usdcId } from 'contracts';

const peraWallet = new PeraWalletConnect({
  chainId: 416002,
});

const MarketPage = () => {
  const router = useRouter();

  const [appId, setAppId] = useState<number | null>();
  const [contractAddress, setContractAddress] = useState<string | null>();

  const [response, setResponse] = useState<string[]>([]);

  const [result, setResult] = useState<number>(0);
  const [poolFundingReserves, setPoolFundingReserves] = useState<number>(0);
  const [tokenFundingReserves, setTokenFundingReserves] = useState<number>(0);
  const [yesTokenReserves, setYesTokenReserves] = useState<number>(0);
  const [noTokenReserves, setNoTokenReserves] = useState<number>(0);
  const [poolTokensOutstanding, setPoolTokensOutstanding] = useState<number>(0);

  const [algoCoin, setAlgoCoin] = useState<Coin>({
    token: 'USDC',
  });

  const [coin_2, setCoin_2] = useState<Coin>({
    token: 'Yes',
  });

  const [poolToken, setPoolToken] = useState<number>(0);
  const [yesToken, setYesToken] = useState<number>(0);
  const [noToken, setNoToken] = useState<number>(0);

  const selectedAddress = useStore((state) => state.selectedAddress);

  const setAddresses = useStore((state) => state.setAddresses);
  const selectAddress = useStore((state) => state.selectAddress);

  const whoWon = () => {
    if (result === yesToken) {
      return 'Yes';
    }
    if (result === noToken) {
      return 'No';
    }
  };

  const amountOut = (reservesIn: number, tokenName: string) => {
    if (tokenName == 'Yes') {
      const reservesA = yesTokenReserves / 1000000;
      const reservesB = noTokenReserves / 1000000;
      const reservesOut = (reservesIn * reservesA) / (reservesIn + reservesB);
      return reservesOut.toFixed(6);
    }
    if (tokenName == 'No') {
      const reservesA = noTokenReserves / 1000000;
      const reservesB = yesTokenReserves / 1000000;
      const reservesOut = (reservesIn * reservesA) / (reservesIn + reservesB);
      return reservesOut.toFixed(6);
    }
  };

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();

    setAddresses([]);
    selectAddress(0);
  }

  useEffect(() => {
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector?.on('disconnect', handleDisconnectWalletClick);

        setAddresses(accounts);

        if (accounts.length) {
          selectAddress(0);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    let hydrated = router.isReady;
    if (hydrated) {
      const id = Number(router.query.id);

      setAppId(AMMs[id]?.appId);
      setContractAddress(AMMs[id]?.contractAddress);
      if (id) {
        queryApp(
          id,
          setYesToken,
          setNoToken,
          setPoolToken,
          setYesTokenReserves,
          setNoTokenReserves,
          setPoolTokensOutstanding,
          setPoolFundingReserves,
          setTokenFundingReserves,
          setResult
        );
      }
    }
  }, [response, router.isReady]);

  return (
    <>
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

          {selectedAddress ? (
            <>
              {result > 0 ? (
                <Button
                  onClick={() => {
                    if (selectedAddress && algoCoin.amount && contractAddress && appId)
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
                    : null}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      if (selectedAddress && algoCoin.amount && contractAddress && appId)
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
                      if (selectedAddress && algoCoin.amount && contractAddress && appId)
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
                      : null}
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
              Connect to Pera wallet
            </Button>
          )}
        </Stack>
      </Paper>
      <Space h="xl" />
      <Paper mx="auto" sx={{ maxWidth: 800 }} p="md" radius="xl" withBorder shadow="xl">
        <Stack>
          {result > 0 ? (
            <>
              <Badge size="xl" radius="xl" color="teal">
                <h3> Winner: {whoWon()}</h3>
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
                USDC left to withdraw: {(tokenFundingReserves / 1000000).toFixed(6)}
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
                {whoWon()} left to withdraw: {(tokenFundingReserves / 1000000 / 2).toFixed(6)}
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
                Token Funding Reserves: {(tokenFundingReserves / 1000000).toFixed(6)} USDC
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
                Pool Funding Reserves: {(poolFundingReserves / 1000000).toFixed(6)} USDC
              </Text>
              <Group position="center">
                <Badge size="xl" radius="xl" color="teal">
                  Yes Reserves: {(yesTokenReserves / 1000000).toFixed(6)}
                </Badge>
                <Badge size="xl" radius="xl" color="teal">
                  No Reserves: {(noTokenReserves / 1000000).toFixed(6)}
                </Badge>
              </Group>
              <Center>
                {noTokenReserves ? (
                  <Badge size="xl" radius="xl" color="indigo" variant="light">
                    Odds:{' '}
                    {((noTokenReserves / (yesTokenReserves + noTokenReserves)) * 100).toFixed(2)} %
                    Yes
                  </Badge>
                ) : null}
              </Center>
            </>
          )}

          <SwapAmountContainer coin={coin_2} setCoin={setCoin_2} />
          {result == 0 ? (
            <>
              <Button
                onClick={() => {
                  if (!selectedAddress)
                    return connectToPera(setAddresses, selectAddress, peraWallet);
                  if (selectedAddress && coin_2?.amount && contractAddress && appId)
                    return swap(
                      contractAddress,
                      appId,
                      coin_2?.amount,
                      coin_2?.token,
                      poolToken,
                      yesToken,
                      noToken,
                      selectedAddress,
                      setResponse,
                      peraWallet
                    );
                }}
                m={4}
                radius="xl"
              >
                {selectedAddress ? 'Swap' : 'Connect to wallet'}
              </Button>

              {coin_2.amount ? (
                <Text
                  component="span"
                  align="center"
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                  size="xl"
                  weight={700}
                  style={{ fontFamily: 'Greycliff CF, sans-serif' }}
                >
                  {amountOut(coin_2.amount, coin_2.token)}
                </Text>
              ) : null}
            </>
          ) : (
            <Button
              onClick={() => {
                if (!selectedAddress) return connectToPera(setAddresses, selectAddress, peraWallet);
                if (selectedAddress && coin_2?.amount && contractAddress && appId)
                  return redeem(
                    contractAddress,
                    appId,
                    coin_2?.amount,
                    coin_2?.token,
                    yesToken,
                    noToken,
                    selectedAddress,
                    setResponse,
                    peraWallet
                  );
              }}
              m={4}
              radius="xl"
            >
              {selectedAddress ? 'Redeem' : 'Connect to wallet'}
            </Button>
          )}
        </Stack>
      </Paper>

      <Space h="lg" />

      {selectedAddress ? (
        <Paper mx="auto" sx={{ maxWidth: 800 }} p="md" radius="xl" withBorder shadow="xl">
          <Stack>
            <Button
              onClick={() => {
                if (selectedAddress)
                  return OptInPool(
                    selectedAddress,
                    yesToken,
                    noToken,
                    poolToken,
                    usdcId,
                    setResponse,
                    peraWallet
                  );
              }}
              m={4}
              radius="xl"
            >
              Opt In to Pool assets
            </Button>
          </Stack>
        </Paper>
      ) : null}
    </>
  );
};

export default MarketPage;
