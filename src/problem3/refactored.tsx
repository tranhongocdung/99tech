import React, { useMemo } from 'react';

// Placeholder for BoxProps if using a UI library like Material-UI or Chakra UI
interface BoxProps {
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

// Add blockchain property to WalletBalance
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

// Mock hooks for demonstration (replace with real implementations)
const useWalletBalances = (): WalletBalance[] => [
  { currency: 'ETH', amount: 1.5, blockchain: 'Ethereum' },
  { currency: 'OSMO', amount: 0, blockchain: 'Osmosis' },
  { currency: 'ARB', amount: 2, blockchain: 'Arbitrum' },
];
const usePrices = (): Record<string, number> => ({ ETH: 2000, OSMO: 1, ARB: 1.5 });

// Placeholder WalletRow component
const WalletRow: React.FC<{
  className?: string;
  amount: number;
  usdValue: number;
  formattedAmount: string;
  currency: string;
}> = ({ className, amount, usdValue, formattedAmount, currency }) => (
  <div className={className} style={{ display: 'flex', gap: 8 }}>
    <span>{currency}</span>
    <span>{formattedAmount}</span>
    <span>${usdValue.toFixed(2)}</span>
  </div>
);

// Placeholder for classes
const classes = { row: 'wallet-row' };

interface Props extends BoxProps {}

// Priority lookup object for blockchains
const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
  // Add more blockchains here as needed
};

/**
 * Returns the priority for a given blockchain using a lookup object.
 * This makes it easy to add or update priorities in the future.
 */
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
};

const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const walletBalances = useWalletBalances();
  const prices = usePrices();

  // Filter for valid and positive balances, then sort by priority
  const filteredAndSortedBalances = useMemo(() => {
    return walletBalances
      .filter((balance) => getPriority(balance.blockchain) > -99 && balance.amount > 0)
      .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain));
  }, [walletBalances]);

  // Format balances for display
  const formattedWalletBalances: FormattedWalletBalance[] = useMemo(() =>
    filteredAndSortedBalances.map((balance) => ({
      ...balance,
      formatted: balance.amount.toFixed(4), // Use 4 decimals for consistency
    })),
    [filteredAndSortedBalances]
  );

  // Render wallet rows with better error handling and descriptive key
  const walletRows = formattedWalletBalances.map((balance) => {
    const price = prices[balance.currency];
    const usdValue = price !== undefined ? price * balance.amount : 0;
    return (
      <WalletRow
        className={classes.row}
        key={`${balance.currency}-${balance.blockchain}`}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
        currency={balance.currency}
      />
    );
  });

  return <div {...rest}>{walletRows}</div>;
};

export default WalletPage; 