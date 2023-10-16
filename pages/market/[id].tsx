import { Paper, Stack, Button, Badge, Text, Image, Center } from '@mantine/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import PairJson from "@/utils/Pair.json"
import TokenJson from "@/utils/Token.json"
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

  const [vote, setVote] = useState<string>('');

  const [amount, setAmount] = useState<number>(0);

  const [reserveToken, setReserveToken] = useState<string>('');

  const [resolved, setResolved] = useState<number>(0);
  const [result, setResult] = useState<number>(0);

  const [TronWeb, setTronWeb] = useState();

  const address = useStore((state) => state.address);

  const setAddress = useStore((state) => state.setAddress);

  const PairABI = PairJson.abi;
  const TokenABI = TokenJson.abi;

  const queryApp = async (id: string) => {
    const tronWeb = window.tronWeb;
    setTronWeb(window.tronWeb)
    const contractPair = await tronWeb.contract(PairABI, id);
    let option0 = await contractPair.option0().call();
    setOption0(option0);

    let option1 = await contractPair.option1().call();
    setOption1(option1);

    let eventResolved = await contractPair.eventResolved().call();
    setResolved(eventResolved);

    let eventResult = await contractPair.eventResult().call();
    setResult(eventResult);

    let reserveTokenAddress = await contractPair.reserveToken().call();
    setReserveToken(reserveTokenAddress);
  }

  const appVote = async(id: string, option: number) => {
    const tronWeb = window.tronWeb;
    const contractPair = await tronWeb.contract(PairABI, id);
    const contractToken = await tronWeb.contract(TokenABI, reserveToken);
    if (option === 0){
      let amountToVote = String(amount * 1000000000000000000);
      console.log(await contractToken.approve(id, amountToVote).send())
      await contractPair.voteNo(amountToVote).send();
    }
    if (option === 1){
      let amountToVote = String(amount * 1000000000000000000);
      console.log(await contractToken.approve(id, amountToVote).send())
      await contractPair.voteYes(amountToVote).send();
    }
  }

  const connectToTron = () => {
    if (window.tronWeb?.defaultAddress.base58){
      setAddress(window.tronWeb.defaultAddress.base58)
      setTronWeb(window.tronWeb)
    }
    if (!window.tronWeb?.defaultAddress.base58){
      console.log('install tronlink')
    }
  } 

  useEffect(() => {
    let hydrated = router.isReady;

    if (hydrated) {
      const id = String(router.query.id)

      if (id) {
        setQuestion(AMMs[id]?.question)
        setContractAddress(AMMs[id]?.contractAddress);
        setImage(AMMs[id]?.image)
        queryApp(id);
      }
    }
  }, [router.isReady, TronWeb, address]);

  return (
    <>
      <Paper mx="auto" sx={{ maxWidth: 800 }} p="md" radius="xl" withBorder shadow="xl">
        <Stack>
          <Badge size="xl" radius="xl" color="gold" component="div">
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

          <AmountContainer option0={option0} option1={option1} amount={amount} setAmount={setAmount} setVote={setVote} />

          {address ? (
            <Button
              onClick={async () => {
                if (address && contractAddress && amount > 0)
                  if (vote === option0)
                    appVote(router.query.id as string, 0)
                  if (vote === option1)
                    appVote(router.query.id as string, 1)
              }}
              m={4}
              radius="xl"
            >
              Vote {vote}
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
