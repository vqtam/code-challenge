export const TOKEN_LIST_STALE_TIME_MS = 1000 * 60 * 5;
export const SWAP_SIMULATION_DELAY_MS = 900;
export const TOKEN_SELECTOR_DEBOUNCE_MS = 120;

export const TOKEN_SELECTOR_MODAL_SIZE = 560;
export const TOKEN_SELECTOR_SCROLL_MAX_HEIGHT = 420;
export const TOKEN_SELECTOR_OVERLAY_PROPS = {
  backgroundOpacity: 0.55,
  blur: 3,
};
export const TOKEN_SELECTOR_ICON_SIZE = 24;
export const TOKEN_SELECTOR_POPULAR_BUTTON_MAX_WIDTH = 128;
export const TOKEN_SELECTOR_PRICE_COLUMN_WIDTH = 88;
export const TOKEN_SELECTOR_ITEM_GAP = 6;

export const DEFAULT_SWAP_FORM_VALUES = {
  fromAmount: '0',
  fromCurrency: '',
  toCurrency: '',
};

export const PREFERRED_FROM_SYMBOL = 'ETH';
export const PREFERRED_TO_SYMBOL = 'USDC';
export const MIN_SUPPORTED_TOKEN_COUNT = 2;

export const SWAP_FORM_WIDTH = 'min(100%, 460px)';
export const SWAP_SKELETON_DELAY_MS = 160;
export const OUTPUT_AMOUNT_FONT_SIZE = 32;
export const AMOUNT_MAX_INTEGER_DIGITS = 18;
export const AMOUNT_MAX_FRACTION_DIGITS = 8;
export const SWAP_TOKEN_BUTTON_MIN_WIDTH = 112;
export const SWAP_TOKEN_BUTTON_MAX_WIDTH = 154;
export const SWAP_TOKEN_BUTTON_ICON_SIZE = 20;
export const SWAP_DETAILS_BUTTON_SIZE = 'sm';

export const MOCK_PRICE_IMPACT_LABEL = '<0.01%';
export const MOCK_MAX_SLIPPAGE_LABEL = '0.5%';
export const MOCK_NETWORK_FEE_USD = 0.42;

export const tokenQueryKeys = {
  all: ['tokens'] as const,
  list: () => [...tokenQueryKeys.all, 'list'] as const,
};
