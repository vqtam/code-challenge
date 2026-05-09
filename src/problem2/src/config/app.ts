const DEFAULT_PRICES_URL = 'https://interview.switcheo.com/prices.json';
const DEFAULT_TOKEN_ICON_BASE_URL =
  'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export const AppConfig = {
  PRICES_URL: import.meta.env.VITE_PRICES_URL || DEFAULT_PRICES_URL,
  TOKEN_ICON_BASE_URL: import.meta.env.VITE_TOKEN_ICON_BASE_URL || DEFAULT_TOKEN_ICON_BASE_URL,
};
