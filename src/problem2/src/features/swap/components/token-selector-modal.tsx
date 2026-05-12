import { Group, Modal, NavLink, ScrollArea, Stack, Text, TextInput } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { IconCheck, IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import { OverflowTooltip } from '@/components/overflow-tooltip/overflow-tooltip';
import { TokenIcon } from '@/components/token-icon/token-icon';
import { formatUsd } from '@/utils/format';

import { TOKEN_SELECTOR_DEBOUNCE_MS } from '../constants';
import type { Token } from '../types/token';

const useStyles = createStyles((theme, _params, u) => ({
  inner: {
    [u.smallerThan('sm')]: {
      padding: 0,
    },
  },
  content: {
    [u.smallerThan('sm')]: {
      borderRadius: 0,
      height: '100dvh',
      maxHeight: '100dvh',
      maxWidth: '100vw',
      width: '100vw',
    },
  },
  header: {
    [u.smallerThan('sm')]: {
      minHeight: 48,
      padding: '10px 12px 6px',
    },
  },
  title: {
    fontSize: theme.fontSizes.lg,
    lineHeight: 1.25,

    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.md,
      lineHeight: 1.2,
    },
  },
  body: {
    [u.smallerThan('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100dvh - 48px)',
      minHeight: 0,
      overflow: 'hidden',
      padding: '0 12px',
    },
  },
  close: {
    [u.smallerThan('sm')]: {
      height: 34,
      minWidth: 34,
      width: 34,
    },
  },
  contentStack: {
    [u.smallerThan('sm')]: {
      flex: '1 1 0',
      flexWrap: 'nowrap',
      gap: theme.spacing.xs,
      height: '100%',
      minHeight: 0,
    },
  },
  searchInput: {
    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.sm,
      height: 36,
      minHeight: 36,
    },
  },
  tokenIcon: {
    [u.smallerThan('sm')]: {
      height: 20,
      minWidth: 20,
      width: 20,
    },
  },
  scrollArea: {
    [u.smallerThan('sm')]: {
      display: 'none',
    },
  },
  mobileTokenListScroller: {
    display: 'none',

    [u.smallerThan('sm')]: {
      display: 'block',
      flex: '1 1 0',
      minHeight: 0,
      overflowY: 'auto',
      overscrollBehavior: 'contain',
      paddingBottom: theme.spacing.xs,
      WebkitOverflowScrolling: 'touch',
    },
  },
  tokenList: {
    [u.smallerThan('sm')]: {
      gap: 4,
    },
  },
  tokenNameRow: {
    [u.smallerThan('sm')]: {
      alignItems: 'center',
      gap: theme.spacing.xs,
      minWidth: 0,
      width: '100%',
    },
  },
  tokenName: {
    flex: '1 1 auto',
    minWidth: 0,
  },
  desktopPrice: {
    [u.smallerThan('sm')]: {
      display: 'none',
    },
  },
  mobilePrice: {
    display: 'none',

    [u.smallerThan('sm')]: {
      display: 'block',
      fontSize: theme.fontSizes.xs,
      lineHeight: 1.2,
      marginTop: 2,
    },
  },
  selectedIcon: {
    color: theme.colors[theme.primaryColor][5],
    flexShrink: 0,
  },
  tokenRightSection: {
    minWidth: 76,

    [u.smallerThan('sm')]: {
      minWidth: 'auto',
    },
  },
  navLink: {
    borderRadius: 'var(--mantine-radius-md)',
    transition: 'background-color 120ms ease, color 120ms ease',

    [u.smallerThan('sm')]: {
      '--nl-padding': '8px',
      maxWidth: '100%',
      minHeight: 54,
      overflow: 'hidden',
      width: '100%',
    },

    '.mantine-NavLink-label': {
      fontSize: theme.fontSizes.sm,
      minWidth: 0,
    },

    '.mantine-NavLink-description': {
      fontSize: theme.fontSizes.xs,
    },

    '.mantine-NavLink-body': {
      minWidth: 0,
      overflow: 'hidden',
    },

    '.mantine-NavLink-section': {
      [u.smallerThan('sm')]: {
        flexShrink: 0,
      },
    },
  },
}));

const MOBILE_MEDIA_QUERY = '(max-width: 47.99em)';

type TokenSelectorModalProps = {
  opened: boolean;
  tokens: Token[];
  selectedSymbol: string;
  excludedSymbol: string;
  title: string;
  onClose: () => void;
  onSelect: (symbol: string) => void;
};

export function TokenSelectorModal({
  opened,
  tokens,
  selectedSymbol,
  excludedSymbol,
  title,
  onClose,
  onSelect,
}: TokenSelectorModalProps) {
  const { classes } = useStyles();
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, TOKEN_SELECTOR_DEBOUNCE_MS);

  const filteredTokens = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return tokens;
    }

    return tokens.filter((token) => {
      const symbol = token.symbol.toLowerCase();
      const name = token.name.toLowerCase();
      return symbol.includes(normalizedQuery) || name.includes(normalizedQuery);
    });
  }, [debouncedQuery, tokens]);

  function handleSelect(symbol: string) {
    if (symbol === excludedSymbol) {
      return;
    }

    onSelect(symbol);
    onClose();
  }

  const tokenList = (
    <TokenList
      classes={classes}
      excludedSymbol={excludedSymbol}
      filteredTokens={filteredTokens}
      selectedSymbol={selectedSymbol}
      onSelect={handleSelect}
    />
  );

  return (
    <Modal
      classNames={classes}
      opened={opened}
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      size={560}
      title={title}
      onClose={onClose}
    >
      <Stack className={classes.contentStack} gap="md">
        <TextInput
          autoFocus
          classNames={{ input: classes.searchInput }}
          leftSection={<IconSearch size={18} />}
          placeholder="Search name or symbol"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />

        {isMobile ? (
          <div className={classes.mobileTokenListScroller}>{tokenList}</div>
        ) : (
          <ScrollArea
            className={classes.scrollArea}
            h={420}
            mah="56vh"
            offsetScrollbars="y"
            scrollbars="y"
          >
            {tokenList}
          </ScrollArea>
        )}
      </Stack>
    </Modal>
  );
}

type TokenListProps = {
  classes: ReturnType<typeof useStyles>['classes'];
  excludedSymbol: string;
  filteredTokens: Token[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
};

function TokenList({
  classes,
  excludedSymbol,
  filteredTokens,
  selectedSymbol,
  onSelect,
}: TokenListProps) {
  return (
    <Stack className={classes.tokenList} gap={6}>
      {filteredTokens.map((token) => {
        const isSelected = token.symbol === selectedSymbol;
        const isExcluded = token.symbol === excludedSymbol;

        return (
          <NavLink
            key={token.symbol}
            active={isSelected}
            className={classes.navLink}
            description={
              <TokenDescription classes={classes} price={token.price} symbol={token.symbol} />
            }
            disableRightSectionRotation
            disabled={isExcluded}
            label={
              <Group className={classes.tokenNameRow} gap="xs" miw={0} wrap="nowrap">
                <OverflowTooltip className={classes.tokenName}>{token.name}</OverflowTooltip>
              </Group>
            }
            leftSection={
              <TokenIcon
                className={classes.tokenIcon}
                size={24}
                src={token.iconUrl}
                symbol={token.symbol}
              />
            }
            noWrap
            rightSection={
              <TokenListRightSection classes={classes} isSelected={isSelected} token={token} />
            }
            variant="light"
            onClick={() => onSelect(token.symbol)}
          />
        );
      })}

      {filteredTokens.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          No tokens found.
        </Text>
      ) : null}
    </Stack>
  );
}

type TokenDescriptionProps = {
  classes: ReturnType<typeof useStyles>['classes'];
  price: number;
  symbol: string;
};

function TokenDescription({ classes, price, symbol }: TokenDescriptionProps) {
  return (
    <>
      <Text component="span" inherit>
        {symbol}
      </Text>
      <Text className={classes.mobilePrice} component="span" fw={700} size="xs">
        {formatUsd(price)}
      </Text>
    </>
  );
}

type TokenListRightSectionProps = {
  classes: ReturnType<typeof useStyles>['classes'];
  isSelected: boolean;
  token: Token;
};

function TokenListRightSection({ classes, isSelected, token }: TokenListRightSectionProps) {
  return (
    <Group className={classes.tokenRightSection} gap="xs" wrap="nowrap">
      <Stack className={classes.desktopPrice} gap={2} align="flex-end" miw={76}>
        <OverflowTooltip fw={700} fz="sm" ta="right">
          {formatUsd(token.price)}
        </OverflowTooltip>
      </Stack>
      {isSelected ? <IconCheck className={classes.selectedIcon} size={16} /> : null}
    </Group>
  );
}
