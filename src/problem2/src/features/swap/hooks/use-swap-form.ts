import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import {
  DEFAULT_SWAP_FORM_VALUES,
  MIN_SUPPORTED_TOKEN_COUNT,
  PREFERRED_FROM_SYMBOL,
  PREFERRED_TO_SYMBOL,
} from '../constants';
import {
  createSwapResolverSchema,
  sanitizeSwapAmountInput,
  type SwapFormValues,
} from '../lib/swap-schema';
import type { Token } from '../types/token';

export type ModalTarget = 'from' | 'to';

export function useSwapForm(tokens: Token[]) {
  const didInitialize = useRef(false);
  const tokenMap = useMemo(() => new Map(tokens.map((token) => [token.symbol, token])), [tokens]);
  const availableSymbols = useMemo(() => new Set(tokens.map((token) => token.symbol)), [tokens]);
  const resolverSchema = useMemo(
    () => createSwapResolverSchema(availableSymbols),
    [availableSymbols],
  );

  const form = useForm<SwapFormValues>({
    resolver: zodResolver(resolverSchema),
    defaultValues: DEFAULT_SWAP_FORM_VALUES,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (didInitialize.current || tokens.length < MIN_SUPPORTED_TOKEN_COUNT) {
      return;
    }

    const initialFrom = tokenMap.get(PREFERRED_FROM_SYMBOL) ?? tokens[0];
    const initialTo =
      tokenMap.get(PREFERRED_TO_SYMBOL) ??
      tokens.find((token) => token.symbol !== initialFrom.symbol) ??
      tokens[1];

    form.reset({
      ...DEFAULT_SWAP_FORM_VALUES,
      fromCurrency: initialFrom.symbol,
      toCurrency: initialTo.symbol,
    });
    didInitialize.current = true;
  }, [form, tokenMap, tokens]);

  function setAmount(value: string) {
    form.setValue('fromAmount', sanitizeSwapAmountInput(value), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  function reverseTokens() {
    const currentFrom = form.getValues('fromCurrency');
    const currentTo = form.getValues('toCurrency');

    form.setValue('fromCurrency', currentTo, { shouldDirty: true, shouldValidate: true });
    form.setValue('toCurrency', currentFrom, { shouldDirty: true, shouldValidate: true });
    void form.trigger(['fromCurrency', 'toCurrency']);
  }

  function selectToken(target: ModalTarget, symbol: string) {
    form.setValue(target === 'from' ? 'fromCurrency' : 'toCurrency', symbol, {
      shouldDirty: true,
      shouldValidate: true,
    });
    void form.trigger(['fromCurrency', 'toCurrency']);
  }

  return {
    control: form.control,
    errors: form.formState.errors,
    handleSubmit: form.handleSubmit,
    reverseTokens,
    selectToken,
    setAmount,
    tokenMap,
    watch: form.watch,
  };
}
