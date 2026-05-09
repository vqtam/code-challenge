import { AppConfig } from '@/config';

import type { Token } from '../types/token';
import { getTokenName, popularSymbols } from './token-metadata';
import type { RawTokenPrice } from './token-price-response';

export function normalizeTokenPrices(rawPrices: RawTokenPrice[]) {
  const deduped = new Map<string, RawTokenPrice>();

  for (const rawToken of rawPrices) {
    const symbol = rawToken.currency.toUpperCase();
    const current = deduped.get(symbol);

    if (!current || isNewer(rawToken.date, current.date)) {
      deduped.set(symbol, { ...rawToken, currency: symbol });
    }
  }

  return Array.from(deduped.values())
    .map<Token>((rawToken) => ({
      symbol: rawToken.currency,
      name: getTokenName(rawToken.currency),
      price: rawToken.price,
      updatedAt: rawToken.date ?? null,
      iconUrl: `${AppConfig.TOKEN_ICON_BASE_URL}/${rawToken.currency}.svg`,
    }))
    .sort(sortTokens);
}

function isNewer(nextDate: string | null | undefined, currentDate: string | null | undefined) {
  if (!nextDate) {
    return false;
  }

  if (!currentDate) {
    return true;
  }

  return new Date(nextDate).getTime() > new Date(currentDate).getTime();
}

function sortTokens(left: Token, right: Token) {
  const leftPopularIndex = popularSymbols.indexOf(left.symbol);
  const rightPopularIndex = popularSymbols.indexOf(right.symbol);
  const leftIsPopular = leftPopularIndex !== -1;
  const rightIsPopular = rightPopularIndex !== -1;

  if (leftIsPopular && rightIsPopular) {
    return leftPopularIndex - rightPopularIndex;
  }

  if (leftIsPopular) {
    return -1;
  }

  if (rightIsPopular) {
    return 1;
  }

  return right.price - left.price;
}
