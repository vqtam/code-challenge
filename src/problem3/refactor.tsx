interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps {}

const DEFAULT_PRIORITY = -99;

const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? DEFAULT_PRIORITY;
};

const WalletPage = ({ children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const walletBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);
        return priority > DEFAULT_PRIORITY && balance.amount > 0;
      })
      .sort((left, right) => {
        return getPriority(right.blockchain) - getPriority(left.blockchain);
      })
      .map((balance) => {
        const price = prices[balance.currency] ?? 0;

        return {
          ...balance,
          formatted: balance.amount.toFixed(),
          usdValue: price * balance.amount,
        };
      });
  }, [balances, prices]);

  return (
    <div {...rest}>
      {children}

      {walletBalances.map((balance) => (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}-${balance.currency}`}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

export default WalletPage;
