import { Avatar } from '@mantine/core';
import { useState } from 'react';

type TokenIconProps = {
  symbol: string;
  src: string;
  size?: number;
};

export function TokenIcon({ symbol, src, size = 36 }: TokenIconProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Avatar
      alt={`${symbol} token icon`}
      color="cyan"
      name={symbol}
      radius="xl"
      size={size}
      src={hasError ? null : src}
      onError={() => setHasError(true)}
    >
      {symbol.slice(0, 2)}
    </Avatar>
  );
}
