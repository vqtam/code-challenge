import {
  Badge,
  Button,
  Group,
  Modal,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch, IconTrendingUp } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import { OverflowTooltip } from '@/components/overflow-tooltip/overflow-tooltip';
import { TokenIcon } from '@/components/token-icon/token-icon';
import { formatUsd } from '@/utils/format';

import {
  TOKEN_SELECTOR_DEBOUNCE_MS,
  TOKEN_SELECTOR_ICON_SIZE,
  TOKEN_SELECTOR_ITEM_GAP,
  TOKEN_SELECTOR_MODAL_SIZE,
  TOKEN_SELECTOR_OVERLAY_PROPS,
  TOKEN_SELECTOR_POPULAR_BUTTON_MAX_WIDTH,
  TOKEN_SELECTOR_PRICE_COLUMN_WIDTH,
  TOKEN_SELECTOR_SCROLL_MAX_HEIGHT,
} from '../constants';
import { popularSymbols } from '../lib/token-metadata';
import type { Token } from '../types/token';

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

  const popularTokens = useMemo(
    () => popularSymbols.flatMap((symbol) => tokens.find((token) => token.symbol === symbol) ?? []),
    [tokens],
  );

  function handleSelect(symbol: string) {
    if (symbol === excludedSymbol) {
      return;
    }

    onSelect(symbol);
    onClose();
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={TOKEN_SELECTOR_MODAL_SIZE}
      overlayProps={TOKEN_SELECTOR_OVERLAY_PROPS}
    >
      <Stack gap="md">
        <TextInput
          autoFocus
          leftSection={<IconSearch size={18} />}
          placeholder="Search name or symbol"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
        />

        <Group gap="xs">
          {popularTokens.map((token) => (
            <Button
              key={token.symbol}
              disabled={token.symbol === excludedSymbol}
              leftSection={
                <TokenIcon
                  size={TOKEN_SELECTOR_ICON_SIZE}
                  symbol={token.symbol}
                  src={token.iconUrl}
                />
              }
              maw={TOKEN_SELECTOR_POPULAR_BUTTON_MAX_WIDTH}
              size="compact-md"
              variant={token.symbol === selectedSymbol ? 'filled' : 'light'}
              onClick={() => handleSelect(token.symbol)}
            >
              <OverflowTooltip>{token.symbol}</OverflowTooltip>
            </Button>
          ))}
        </Group>

        <Group gap="xs">
          <IconTrendingUp size={18} />
          <Text c="dimmed" fw={700} size="sm">
            Tokens sorted by popularity and price
          </Text>
        </Group>

        <ScrollArea.Autosize mah={TOKEN_SELECTOR_SCROLL_MAX_HEIGHT} offsetScrollbars>
          <Stack gap={TOKEN_SELECTOR_ITEM_GAP}>
            {filteredTokens.map((token) => {
              const isSelected = token.symbol === selectedSymbol;
              const isExcluded = token.symbol === excludedSymbol;

              return (
                <NavLink
                  key={token.symbol}
                  active={isSelected}
                  description={token.symbol}
                  disabled={isExcluded}
                  label={
                    <Group gap="xs" miw={0} wrap="nowrap">
                      <OverflowTooltip>{token.name}</OverflowTooltip>
                      {isExcluded ? (
                        <Badge color="red" variant="light">
                          In use
                        </Badge>
                      ) : null}
                    </Group>
                  }
                  leftSection={
                    <TokenIcon
                      symbol={token.symbol}
                      src={token.iconUrl}
                      size={TOKEN_SELECTOR_ICON_SIZE}
                    />
                  }
                  noWrap
                  rightSection={
                    <Stack gap={2} align="flex-end" miw={TOKEN_SELECTOR_PRICE_COLUMN_WIDTH}>
                      <OverflowTooltip fw={700} fz="sm" ta="right">
                        {formatUsd(token.price)}
                      </OverflowTooltip>
                    </Stack>
                  }
                  sx={{ borderRadius: 'var(--mantine-radius-md)' }}
                  variant="light"
                  onClick={() => handleSelect(token.symbol)}
                />
              );
            })}

            {filteredTokens.length === 0 ? (
              <Text c="dimmed" ta="center" py="xl">
                No tokens found.
              </Text>
            ) : null}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Modal>
  );
}
