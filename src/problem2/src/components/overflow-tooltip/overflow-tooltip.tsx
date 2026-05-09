import { Box, Tooltip, type BoxProps } from '@mantine/core';
import { useResizeObserver } from '@mantine/hooks';
import { mergeSx } from '@mantine/emotion';
import { useCallback, useEffect, useState, type ReactNode } from 'react';

type OverflowTooltipProps = BoxProps & {
  children: ReactNode;
  label?: ReactNode;
};

export function OverflowTooltip({ children, label, sx, ...props }: OverflowTooltipProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [resizeRef, rect] = useResizeObserver<HTMLElement>();

  const ref = useCallback(
    (node: HTMLElement | null) => {
      setElement(node);
      resizeRef(node);
    },
    [resizeRef],
  );

  useEffect(() => {
    if (!element) {
      setIsOverflowing(false);
      return;
    }

    setIsOverflowing(element.scrollWidth > element.clientWidth);
  }, [children, element, label, rect.width]);

  return (
    <Tooltip
      disabled={!isOverflowing}
      events={{ hover: true, focus: true, touch: true }}
      label={label ?? children}
      multiline
      withArrow
    >
      <Box
        ref={ref}
        component="span"
        miw={0}
        sx={mergeSx(
          {
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          sx,
        )}
        tabIndex={isOverflowing ? 0 : undefined}
        {...props}
      >
        {children}
      </Box>
    </Tooltip>
  );
}
