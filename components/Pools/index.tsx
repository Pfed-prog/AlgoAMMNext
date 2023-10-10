import { Paper, Stack, Button, Badge, Text } from '@mantine/core';
import { useState } from 'react';

import AmountContainer from './AmountContainer';
import { useStore } from '@/store/store';


const Pools = (option0: string, option1: string, amount: number, setAmount: Function) => {

  const connectToTron = () => {
    if (window.tronWeb?.defaultAddress.base58){
      setAddress(window.tronWeb.defaultAddress.base58)
    }
    if (!window.tronWeb?.defaultAddress.base58){
      console.log('install tronlink')
    }
  } 

  const yesToken = useStore((state) => state.yesToken);
  const noToken = useStore((state) => state.noToken);
  const poolToken = useStore((state) => state.poolToken);
  const result = useStore((state) => state.result);
  const poolFundingReserves = useStore((state) => state.poolFundingReserves);
  const poolTokensOutstanding = useStore((state) => state.poolTokensOutstanding);
  const address = useStore((state) => state.address);
  const setAddress = useStore((state) => state.setAddress);
  const setYesToken = useStore((state) => state.setYesToken);
  const setNoToken = useStore((state) => state.setNoToken);
  const setPoolToken = useStore((state) => state.setPoolToken);
  const setPoolFundingReserves = useStore((state) => state.setPoolFundingReserves);
  const setPoolTokensOutstanding = useStore((state) => state.setPoolTokensOutstanding);
  const setResult = useStore((state) => state.setResult);

  const [accountAddress, setAccountAddress] = useState<string | null>(null);

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
        <AmountContainer option0={option0} option1={option1} amount={amount} setAmount={setAmount}/>

        {accountAddress ? (
          <>
            {result > 0 ? (
              <Button
                onClick={() => {
                  if (address)
                    console.log(123)
                }}
                m={4}
                radius="xl"
              >
                Withdraw from AMM
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    if (accountAddress)
                    console.log(123)
                  }}
                  m={4}
                  radius="xl"
                >
                  Supply to AMM
                </Button>
                <Button
                  onClick={() => {
                    if (address)
                      console.log(123)
                  }}
                  m={4}
                  radius="xl"
                >
                  Withdraw from AMM
                </Button>
              </>
            )}
          </>
        ) : (
          <Button
            onClick={() => {
              if (!address) return connectToTron();
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
