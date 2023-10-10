import create from 'zustand';

export interface ResponseState {
  response: string[];
  setResponse: (response: string[]) => void;
}

export interface StoreState {
  open: boolean;
  address: string | null;
  yesToken: number;
  noToken: number;
  poolToken: number;
  yesTokenReserves: number;
  noTokenReserves: number;
  result: number;
  tokenFundingReserves: number;
  poolFundingReserves: number;
  poolTokensOutstanding: number;
  setYesToken: (yesToken: number) => void;
  setNoToken: (noToken: number) => void;
  setPoolToken: (poolToken: number) => void;
  setYesTokenReserves: (yesToken: number) => void;
  setNoTokenReserves: (yesToken: number) => void;
  setResult: (result: number) => void;
  setTokenFundingReserves: (tokenFundingReserves: number) => void;
  setPoolFundingReserves: (poolFundingReserves: number) => void;
  setPoolTokensOutstanding: (poolTokensOutstanding: number) => void;
  toggleOpen: () => void;
  setAddress: (address: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  open: false,
  address: null,
  yesToken: 0,
  noToken: 0,
  poolToken: 0,
  yesTokenReserves: 0,
  noTokenReserves: 0,
  tokenFundingReserves: 0,
  poolFundingReserves: 0,
  poolTokensOutstanding: 0,
  result: 0,
  setYesToken: (yesToken: number) => set(() => ({ yesToken: yesToken })),
  setNoToken: (noToken: number) => set(() => ({ noToken: noToken })),
  setPoolToken: (poolToken: number) => set(() => ({ poolToken: poolToken })),
  setYesTokenReserves: (yesTokenReserves: number) =>
    set(() => ({ yesTokenReserves: yesTokenReserves })),
  setNoTokenReserves: (noTokenReserves: number) =>
    set(() => ({ noTokenReserves: noTokenReserves })),
  setTokenFundingReserves: (tokenFundingReserves: number) =>
    set(() => ({ tokenFundingReserves: tokenFundingReserves })),
  setPoolFundingReserves: (poolFundingReserves: number) =>
    set(() => ({ poolFundingReserves: poolFundingReserves })),
  setPoolTokensOutstanding: (poolTokensOutstanding: number) =>
    set(() => ({ poolTokensOutstanding: poolTokensOutstanding })),
  setResult: (result: number) => set(() => ({ result: result })),
  setAddress: (address: string) => set(() => ({ address: address })),
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));

export const useResponse = create<ResponseState>((set) => ({
  response: [],
  setResponse: (response: string[]) => set(() => ({ response: response })),
}));
