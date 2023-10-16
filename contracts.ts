export const usdcId = 10458941;

interface AMM {
  contractAddress: string;
  question: string;
  image: string;
}

type AMMnumber = string;

export const AMMs: Record<AMMnumber, AMM> = {
  TWuTUFmw23gwkPDuQuxrfosbPigRzjjwUe: {
    contractAddress: 'TWuTUFmw23gwkPDuQuxrfosbPigRzjjwUe',
    question: 'Will Mbappé leave PSG?',
    image: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Mbapp%C3%A9_25032021.jpg',
  },
};
