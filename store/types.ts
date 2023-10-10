export type Coin = {
  token: string;
  amount?: number;
};

export type Pair = {
  token_1: Coin;
  token_2: Coin;
};

export interface AmountContainerProps {
  option0: string;
  option1: string;
  amount: number;
  setAmount: Function;
}

export interface GlobalStateIndices {
  indices: Array<string>;
}
