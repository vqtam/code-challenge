export const tokenNames: Record<string, string> = {
  ATOM: 'Cosmos Hub',
  AXL: 'Axelar',
  BTC: 'Bitcoin',
  BUSD: 'Binance USD',
  CRO: 'Cronos',
  ETH: 'Ethereum',
  EVMOS: 'Evmos',
  IBCX: 'IBC Index',
  IRIS: 'IRISnet',
  JUNO: 'Juno',
  KUJI: 'Kujira',
  LUNA: 'Terra',
  NGM: 'e-Money',
  OSMO: 'Osmosis',
  SCRT: 'Secret',
  STARS: 'Stargaze',
  STRD: 'Stride',
  SWTH: 'Carbon',
  USDC: 'USD Coin',
  USDT: 'Tether',
  WBTC: 'Wrapped Bitcoin',
};

export function getTokenName(symbol: string) {
  return tokenNames[symbol] ?? symbol;
}
