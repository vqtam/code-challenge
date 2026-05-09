export type Token = {
  symbol: string;
  name: string;
  price: number;
  updatedAt: string | null;
  iconUrl: string;
};

export type SwapRequest = {
  fromAmount: number;
  fromCurrency: string;
  toCurrency: string;
};

export type SwapResult = SwapRequest & {
  toAmount: number;
  executedAt: string;
};
