import { useMemo } from 'react';

import type { Token } from '../types/token';

type UseSwapQuoteInput = {
  amount: string;
  fromToken: Token | null;
  toToken: Token | null;
};

export function useSwapQuote({ amount, fromToken, toToken }: UseSwapQuoteInput) {
  return useMemo(() => {
    const amountNumber = Number(amount);
    const hasValidAmount = Number.isFinite(amountNumber) && amountNumber > 0;
    const toAmount =
      hasValidAmount && fromToken && toToken ? (amountNumber * fromToken.price) / toToken.price : 0;

    return {
      fromUsdValue: hasValidAmount && fromToken ? amountNumber * fromToken.price : 0,
      rate: fromToken && toToken ? fromToken.price / toToken.price : 0,
      toAmount,
      toUsdValue: toAmount * (toToken?.price ?? 0),
    };
  }, [amount, fromToken, toToken]);
}
