import { AppConfig } from '@/config';

import { SWAP_SIMULATION_DELAY_MS } from '../constants';
import { createSwapQuote, findTokenBySymbol } from '../lib/swap-quote';
import { normalizeTokenPrices } from '../lib/token-price-normalizer';
import { parseTokenPriceResponse } from '../lib/token-price-response';
import type { SwapRequest, SwapResult } from '../types/token';

export const TokenService = {
  async getList() {
    const response = await fetch(AppConfig.PRICES_URL);

    if (!response.ok) {
      throw new Error('Could not load token prices. Please try again.');
    }

    const payload: unknown = await response.json();
    const rawPrices = parseTokenPriceResponse(payload);

    return normalizeTokenPrices(rawPrices);
  },

  async get(symbol: string) {
    const tokens = await TokenService.getList();
    return findTokenBySymbol(tokens, symbol);
  },

  async swap(request: SwapRequest): Promise<SwapResult> {
    const tokens = await TokenService.getList();

    await new Promise((resolve) => window.setTimeout(resolve, SWAP_SIMULATION_DELAY_MS));

    return createSwapQuote(request, tokens);
  },
};
