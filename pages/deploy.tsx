import { Stack, Text, Button, TextInput, Center } from '@mantine/core';
import { useState } from 'react';

import { useStore } from '@/store/store';
import FactoryJson from '@/utils/Factory.json';

declare global {
  interface Window {
    tronWeb: any;
  }
}

export default function Deploy() {
  const [firstOption, setFirstOption] = useState('Yes');
  const [secondOption, setSecondOption] = useState('No');
  const [tokenAddress, setTokenAddress] = useState('TLBaRhANQoJFTqre9Nf1mjuwNWjCJeYqUL');

  const setAddress = useStore((state) => state.setAddress);
  const address = useStore((state) => state.address);

  const FactoryABI = FactoryJson.abi;

  const connectToTron = () => {
    if (window.tronWeb?.defaultAddress.base58) {
      setAddress(window.tronWeb.defaultAddress.base58);
    }
    if (!window.tronWeb?.defaultAddress.base58) {
      console.log('install tronlink');
    }
  };

  const deployPair = async (option0: string, option1: string, address: string) => {
    const { tronWeb } = window;
    //factor of 5
    //const result = await tronWeb.transactionBuilder.updateEnergyLimit("TJ8sRynQEQqu9xF9R4RQzLxG1YTryZ8Sed", 6712508,"TFiZZgqPnb7Ngb9u3moNno4a6nGWd5EQki")
    const contract = await tronWeb.contract(FactoryABI, 'TJ8sRynQEQqu9xF9R4RQzLxG1YTryZ8Sed');
    const result = await contract.createPair(option0, option1, address).send();
    console.log(result);
    const pairsN = await contract.allPairsLength().call();
    console.log(Number(pairsN));
  };

  return (
    <>
      <Center>
        {!address ? (
          <Button
            onClick={() => {
              if (!address) {
                connectToTron();
              }
            }}
            m={4}
            radius="xl"
          >
            Connect the wallet
          </Button>
        ) : (
          <Stack>
            <Text>{address}</Text>
            <TextInput
              label="First Option"
              value={firstOption}
              onChange={(event) => setFirstOption(event.currentTarget.value)}
            />
            <TextInput
              label="Second Option"
              value={secondOption}
              onChange={(event) => setSecondOption(event.currentTarget.value)}
            />
            <TextInput
              label="Reserve Token"
              value={tokenAddress}
              onChange={(event) => setTokenAddress(event.currentTarget.value)}
            />
            <Button
              onClick={() => {
                deployPair(firstOption, secondOption, tokenAddress);
              }}
              m={4}
              radius="xl"
            >
              Deploy
            </Button>
          </Stack>
        )}
      </Center>
    </>
  );
}
