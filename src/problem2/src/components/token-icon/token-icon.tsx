import { Avatar, type BoxProps } from '@mantine/core';
import { useState } from 'react';

type TokenIconProps = {
  className?: string;
  symbol: string;
  src: string;
  size?: number;
  sx?: BoxProps['sx'];
};

export function TokenIcon({ className, symbol, src, size = 36, sx }: TokenIconProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Avatar
      alt={`${symbol} token icon`}
      className={className}
      color="cyan"
      name={symbol}
      radius="xl"
      size={size}
      src={hasError ? null : src}
      sx={sx}
      onError={() => setHasError(true)}
    >
      {symbol.slice(0, 2)}
    </Avatar>
  );
}
