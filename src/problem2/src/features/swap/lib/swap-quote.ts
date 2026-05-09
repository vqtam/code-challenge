import type { SwapRequest, SwapResult, Token } from '../types/token';

export function findTokenBySymbol(tokens: Token[], symbol: string) {
  return tokens.find((token) => token.symbol === symbol.toUpperCase()) ?? null;
}

export function createSwapQuote(request: SwapRequest, tokens: Token[]): SwapResult {
  const sourceToken = findTokenBySymbol(tokens, request.fromCurrency);
  const destinationToken = findTokenBySymbol(tokens, request.toCurrency);

  if (!sourceToken || !destinationToken) {
    throw new Error('Please choose two supported tokens.');
  }

  return {
    ...request,
    toAmount: (request.fromAmount * sourceToken.price) / destinationToken.price,
    executedAt: new Date().toISOString(),
  };
}
