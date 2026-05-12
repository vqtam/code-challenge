export const TOKEN_LIST_STALE_TIME_MS = 1000 * 60 * 5;
export const SWAP_SIMULATION_DELAY_MS = 900;
export const TOKEN_SELECTOR_DEBOUNCE_MS = 120;

export const DEFAULT_SWAP_FORM_VALUES = {
  fromAmount: '0',
  fromCurrency: '',
  toCurrency: '',
};

export const PREFERRED_FROM_SYMBOL = 'ETH';
export const PREFERRED_TO_SYMBOL = 'USDC';
export const MIN_SUPPORTED_TOKEN_COUNT = 2;

export const AMOUNT_MAX_INTEGER_DIGITS = 16;
export const AMOUNT_MAX_FRACTION_DIGITS = 8;

export const tokenQueryKeys = {
  all: ['tokens'] as const,
  list: () => [...tokenQueryKeys.all, 'list'] as const,
};
