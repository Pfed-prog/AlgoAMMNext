export const usdcId = 10458941;

interface AMM {
  appId: number;
  contractAddress: string;
  question: string;
  image: string;
}

type AMMnumber = number;

export const AMMs: Record<AMMnumber, AMM> = {
  105639497: {
    appId: 105639497,
    contractAddress: 'C5MTTIWVABNVG22TPGYETHVYVZCUD75F5SXOZR5A5L7CLQ6QHKWWTLKTSI',
    question: 'Will Mbappé leave PSG?',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Mbapp%C3%A9_25032021.jpg',
  },
};
