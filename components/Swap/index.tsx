import { Paper, Stack, Button, Group, Badge, Text, Center } from '@mantine/core';
import { useEffect, useState } from 'react';

import AmountContainer from './AmountContainer';

import { useStore, useResponse } from '@/store/store';
import { Coin } from '@/store/types';

const Swap = (option0: string, option1: string, amount: number, setAmount: Function) => {
  const yesToken = useStore((state) => state.yesToken);
  const noToken = useStore((state) => state.noToken);
  const yesTokenReserves = useStore((state) => state.yesTokenReserves);
  const noTokenReserves = useStore((state) => state.noTokenReserves);
  const tokenFundingReserves = useStore((state) => state.tokenFundingReserves);
  const poolFundingReserves = useStore((state) => state.poolFundingReserves);
  const result = useStore((state) => state.result);
  const address = useStore((state) => state.address);

  const [coin_2, setCoin_2] = useState<Coin>({
    token: 'Yes',
  });

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

  const whoWon = () => {
    if (result == yesToken) {
      return 'Yes';
    }
    if (result == noToken) {
      return 'No';
    }
  };

  const [vote, setVote] = useState<string>('');

  return (
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

        <AmountContainer option0={option0} option1={option1} amount={amount} setAmount={setAmount} setVote={setVote} />
        {result == 0 ? (
          <>
            <Button
              onClick={() => {
              }}
              m={4}
              radius="xl"
            >
              {address ? 'Swap' : 'Connect to wallet'}
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
              if (address && coin_2?.amount)
                console.log(123)
            }}
            m={4}
            radius="xl"
          >
            {address ? 'Redeem' : 'Connect to wallet'}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default Swap;
