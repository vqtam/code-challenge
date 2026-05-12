import { Group, Skeleton, Text } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import type { ReactNode } from 'react';

import { OverflowTooltip } from '@/components/overflow-tooltip/overflow-tooltip';

const useStyles = createStyles((theme, _params, u) => ({
  root: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    [u.smallerThan('sm')]: {
      alignItems: 'stretch',
      flexDirection: 'column',
      gap: 2,
    },
  },
  label: {
    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.xs,
    },
  },
  value: {
    maxWidth: '70%',
    textAlign: 'right',

    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.xs,
      maxWidth: '100%',
      textAlign: 'left',
      width: '100%',
    },
  },
}));

type DetailRowProps = {
  label: string;
  loading?: boolean;
  skeletonWidth?: number;
  value: ReactNode;
};

export function DetailRow({ label, loading = false, skeletonWidth = 96, value }: DetailRowProps) {
  const { classes } = useStyles();

  return (
    <Group className={classes.root} wrap="nowrap">
      <Text c="dimmed" className={classes.label} fw={600} size="sm">
        {label}
      </Text>
      {loading ? (
        <Skeleton height={18} width={skeletonWidth} />
      ) : (
        <OverflowTooltip className={classes.value} fw={700} fz="sm">
          {value}
        </OverflowTooltip>
      )}
    </Group>
  );
}
