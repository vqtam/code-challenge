import { notifications } from '@mantine/notifications';

import { formatTokenAmount } from '@/utils/format';

import type { SwapFormValues } from '../lib/swap-schema';
import { useSwapMutation } from './use-swap-mutation';

export function useSubmitSwap() {
  const swapMutation = useSwapMutation();

  async function submitSwap(values: SwapFormValues) {
    try {
      const result = await swapMutation.mutateAsync({
        fromAmount: Number(values.fromAmount),
        fromCurrency: values.fromCurrency,
        toCurrency: values.toCurrency,
      });

      notifications.show({
        color: 'blue',
        title: 'Swap simulated',
        message: `${values.fromAmount} ${result.fromCurrency} -> ${formatTokenAmount(
          result.toAmount,
        )} ${result.toCurrency}`,
      });
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Swap unavailable',
        message: getErrorMessage(error, 'Please choose two supported tokens.'),
      });
    }
  }

  return {
    submitSwap,
    swapMutation,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
