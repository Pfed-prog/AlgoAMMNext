import { Paper, Stack, Button, Badge, Text, Image, Center } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PairJson from "@/utils/Pair.json"
import AmountContainer from '@/components/Pools/AmountContainer';
import { useStore } from '@/store/store';
import { AMMs } from 'contracts';

const MarketPage = () => {
  const router = useRouter();

  const [contractAddress, setContractAddress] = useState<string | null>();

  const [question, setQuestion] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [option0, setOption0] = useState<string>('');
  const [option1, setOption1] = useState<string>('');

  const [amount, setAmount] = useState<number>(0);

  const [resolved, setResolved] = useState<number>(0);
  const [result, setResult] = useState<number>(0);

  const address = useStore((state) => state.address);

  const setAddress = useStore((state) => state.setAddress);

  const PairABI = PairJson.abi;

  const queryApp = async (id: string) => {
    const tronWeb = window.tronWeb;
    let contractPair = await tronWeb.contract(PairABI, id);
    console.log(contractPair);

    let option0 = await contractPair.option0().call();
    setOption0(option0);

    let option1 = await contractPair.option1().call();
    setOption1(option1);

    let eventResolved = await contractPair.eventResolved().call();
    setResolved(eventResolved);

    let eventResult = await contractPair.eventResult().call();
    setResult(eventResult);
  } 

  const connectToTron = () => {
    if (window.tronWeb?.defaultAddress.base58){
      setAddress(window.tronWeb.defaultAddress.base58)
    }
    if (!window.tronWeb?.defaultAddress.base58){
      console.log('install tronlink')
    }
  } 

  useEffect(() => {
    let hydrated = router.isReady;

    if (hydrated) {
      const id = String(router.query.id);
      setQuestion(AMMs[id]?.question)
      setContractAddress(AMMs[id]?.contractAddress);
      setImage(AMMs[id]?.image)

      if (id) {
        queryApp(
          id
        );
      }
    }
  }, [router.isReady]);

  return (
    <>
      <Paper mx="auto" sx={{ maxWidth: 800 }} p="md" radius="xl" withBorder shadow="xl">
        <Stack>
          <Badge size="xl" radius="xl" color="gold" component="a">
            {question}
          </Badge>
          <Center>
              <Image width={270} height={200} src={image} />
          </Center>
          <Text
            component="span"
            align="center"
            variant="gradient"
            gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
            size="xl"
            weight={700}
            style={{ fontFamily: 'Greycliff CF, sans-serif' }}
          >
            {option0} - {option1}
          </Text>

          <AmountContainer option0={option0} option1={option1} amount={amount} setAmount={setAmount} />

          {address ? (
                <Button
                  onClick={() => {
                    if (address && contractAddress && amount > 0)
                      console.log(amount)
                  }}
                  m={4}
                  radius="xl"
                >
                  Vote
                </Button>  
          ) : (
            <Button
              onClick={() => {
                if (!address) return connectToTron();
              }}
              m={4}
              radius="xl"
            >
              Connect to TronLink wallet
            </Button>
          )}
        </Stack>
      </Paper>
    </>
  );
};

export default MarketPage;
