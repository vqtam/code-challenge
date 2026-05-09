import { z } from 'zod';

import { AMOUNT_MAX_FRACTION_DIGITS, AMOUNT_MAX_INTEGER_DIGITS } from '../constants';

const SWAP_AMOUNT_PATTERN = new RegExp(
  `^\\d{1,${AMOUNT_MAX_INTEGER_DIGITS}}(?:\\.\\d{0,${AMOUNT_MAX_FRACTION_DIGITS}})?$`,
);

export const swapFormSchema = z.object({
  fromAmount: z
    .string()
    .trim()
    .min(1, 'Enter an amount.')
    .regex(
      SWAP_AMOUNT_PATTERN,
      `Enter up to ${AMOUNT_MAX_INTEGER_DIGITS} digits and ${AMOUNT_MAX_FRACTION_DIGITS} decimals.`,
    )
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, {
      message: 'Enter an amount greater than 0.',
    }),
  fromCurrency: z.string().trim().min(1, 'Select a token to sell.'),
  toCurrency: z.string().trim().min(1, 'Select a token to receive.'),
});

export type SwapFormValues = z.infer<typeof swapFormSchema>;

export function createSwapResolverSchema(availableSymbols: Set<string>) {
  return swapFormSchema.superRefine((values, context) => {
    if (values.fromCurrency === values.toCurrency) {
      context.addIssue({
        code: 'custom',
        path: ['toCurrency'],
        message: 'Choose two different tokens.',
      });
    }

    if (availableSymbols.size === 0) {
      return;
    }

    if (!availableSymbols.has(values.fromCurrency)) {
      context.addIssue({
        code: 'custom',
        path: ['fromCurrency'],
        message: 'Selected sell token is not available.',
      });
    }

    if (!availableSymbols.has(values.toCurrency)) {
      context.addIssue({
        code: 'custom',
        path: ['toCurrency'],
        message: 'Selected receive token is not available.',
      });
    }
  });
}

export function sanitizeSwapAmountInput(value: string) {
  const normalizedValue = value.replace(',', '.').replace(/[^\d.]/g, '');
  const [rawInteger = '', ...fractionParts] = normalizedValue.split('.');
  const integer = rawInteger.replace(/^0+(?=\d)/, '').slice(0, AMOUNT_MAX_INTEGER_DIGITS);
  const hasDecimal = normalizedValue.includes('.');
  const fraction = fractionParts.join('').slice(0, AMOUNT_MAX_FRACTION_DIGITS);

  if (hasDecimal) {
    return `${integer || '0'}.${fraction}`;
  }

  return integer;
}
