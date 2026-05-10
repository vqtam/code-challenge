import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Collapse,
  Divider,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { IconArrowsDownUp, IconChevronDown, IconInfoCircle } from '@tabler/icons-react';
import { useState, type ReactNode } from 'react';
import { Controller } from 'react-hook-form';

import { OverflowTooltip } from '@/components/overflow-tooltip/overflow-tooltip';
import { TokenIcon } from '@/components/token-icon/token-icon';
import { formatRate, formatTokenAmount, formatUsd } from '@/utils/format';

import {
  MOCK_MAX_SLIPPAGE_LABEL,
  MOCK_NETWORK_FEE_USD,
  MOCK_PRICE_IMPACT_LABEL,
  OUTPUT_AMOUNT_FONT_SIZE,
  MIN_SUPPORTED_TOKEN_COUNT,
  SWAP_DETAILS_BUTTON_SIZE,
  SWAP_FORM_WIDTH,
  SWAP_SKELETON_DELAY_MS,
  SWAP_TOKEN_BUTTON_ICON_SIZE,
  SWAP_TOKEN_BUTTON_MAX_WIDTH,
  SWAP_TOKEN_BUTTON_MIN_WIDTH,
} from '../constants';
import { useDelayedVisible } from '../hooks/use-delayed-visible';
import { type ModalTarget, useSwapForm } from '../hooks/use-swap-form';
import { useSwapQuote } from '../hooks/use-swap-quote';
import { useSubmitSwap } from '../hooks/use-submit-swap';
import { useTokenListQuery } from '../hooks/use-token-list-query';
import type { Token } from '../types/token';
import { TokenSelectorModal } from './token-selector-modal';

type TokenButtonProps = {
  token: Token | null;
  label: string;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
};

function TokenButton({ token, label, disabled, loading, onClick }: TokenButtonProps) {
  const button = (
    <Button
      disabled={disabled}
      maw={SWAP_TOKEN_BUTTON_MAX_WIDTH}
      miw={SWAP_TOKEN_BUTTON_MIN_WIDTH}
      px="sm"
      rightSection={<IconChevronDown size={18} />}
      sx={{ flexShrink: 0 }}
      variant="light"
      onClick={onClick}
    >
      {token ? (
        <Group align="center" gap="xs" miw={0} wrap="nowrap">
          <TokenIcon size={SWAP_TOKEN_BUTTON_ICON_SIZE} symbol={token.symbol} src={token.iconUrl} />
          <OverflowTooltip fw={700}>{token.symbol}</OverflowTooltip>
        </Group>
      ) : (
        label
      )}
    </Button>
  );

  if (loading) {
    return (
      <Skeleton radius="md" w={SWAP_TOKEN_BUTTON_MAX_WIDTH}>
        {button}
      </Skeleton>
    );
  }

  return button;
}

export function SwapForm() {
  const tokenListQuery = useTokenListQuery();
  const showLoadingPlaceholders = useDelayedVisible(
    tokenListQuery.isPending,
    SWAP_SKELETON_DELAY_MS,
  );
  const { submitSwap, swapMutation } = useSubmitSwap();
  const tokens = tokenListQuery.data ?? [];
  const [modalTarget, setModalTarget] = useState<ModalTarget | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const {
    control,
    errors,
    handleSubmit,
    reverseTokens,
    selectToken,
    setAmount,
    tokenMap,
    watch,
  } = useSwapForm(tokens);

  const [fromAmount, fromCurrency, toCurrency] = watch([
    'fromAmount',
    'fromCurrency',
    'toCurrency',
  ]);
  const fromToken = tokenMap.get(fromCurrency) ?? null;
  const toToken = tokenMap.get(toCurrency) ?? null;
  const { fromUsdValue, rate, toAmount, toUsdValue } = useSwapQuote({
    amount: fromAmount,
    fromToken,
    toToken,
  });
  const isReady = tokenListQuery.isSuccess && tokens.length >= MIN_SUPPORTED_TOKEN_COUNT;
  const isActionDisabled = !isReady || swapMutation.isPending;

  const fromHelperText = errors.fromAmount?.message ?? formatUsd(fromUsdValue);
  const toHelperText = errors.toCurrency?.message ?? formatUsd(toUsdValue);
  const rateText = `1 ${fromToken?.symbol ?? '-'} = ${formatRate(rate)} ${toToken?.symbol ?? '-'}`;

  function handleSelectToken(symbol: string) {
    if (!modalTarget) {
      return;
    }

    selectToken(modalTarget, symbol);
  }

  return (
    <Paper w={SWAP_FORM_WIDTH} p="lg" shadow="md" withBorder>
      <form onSubmit={handleSubmit(submitSwap)}>
        <Stack gap="md">
          <Stack gap={2}>
            <Text fw={700} size="xl">
              Swap
            </Text>
            <Text c="dimmed" size="sm">
              Preview a simulated token swap with live prices.
            </Text>
          </Stack>

          {tokenListQuery.isError ? (
            <Alert color="red" icon={<IconInfoCircle size={18} />} title="Price feed unavailable">
              {getErrorMessage(tokenListQuery.error, 'Unexpected price loading error.')}
            </Alert>
          ) : null}

          <Stack gap="xs">
            <SwapCard>
              <Stack gap={4} miw={0}>
                <Text c="dimmed" fw={700} size="sm">
                  From
                </Text>
                <Controller
                  control={control}
                  name="fromAmount"
                  render={({ field }) => (
                    <TextInput
                      aria-invalid={errors.fromAmount ? true : undefined}
                      aria-label="Amount to sell"
                      inputMode="decimal"
                      name={field.name}
                      placeholder="0"
                      ref={field.ref}
                      size="xl"
                      value={field.value}
                      variant="unstyled"
                      onBlur={field.onBlur}
                      onChange={(event) => setAmount(event.currentTarget.value)}
                    />
                  )}
                />
                <OverflowTooltip
                  c={errors.fromAmount ? 'red' : 'dimmed'}
                  fw={600}
                  fz="sm"
                  label={fromHelperText}
                >
                  {fromHelperText}
                </OverflowTooltip>
              </Stack>

              <TokenButton
                disabled={isActionDisabled}
                label="Select"
                loading={showLoadingPlaceholders}
                token={fromToken}
                onClick={() => setModalTarget('from')}
              />
            </SwapCard>

            <Box ta="center">
              <ActionIcon
                aria-label="Reverse swap direction"
                disabled={isActionDisabled}
                size="lg"
                variant="light"
                onClick={reverseTokens}
              >
                <IconArrowsDownUp size={20} />
              </ActionIcon>
            </Box>

            <SwapCard>
              <Stack gap={4} miw={0}>
                <Text c="dimmed" fw={700} size="sm">
                  To
                </Text>
                {showLoadingPlaceholders ? (
                  <Skeleton height={38} maw="70%" />
                ) : (
                  <OverflowTooltip fw={700} fz={OUTPUT_AMOUNT_FONT_SIZE} lh={1.2}>
                    {toAmount > 0 ? formatTokenAmount(toAmount) : '0'}
                  </OverflowTooltip>
                )}
                {showLoadingPlaceholders ? (
                  <Skeleton height={18} maw={96} />
                ) : (
                  <OverflowTooltip
                    c={errors.toCurrency ? 'red' : 'dimmed'}
                    fw={600}
                    fz="sm"
                    label={toHelperText}
                  >
                    {toHelperText}
                  </OverflowTooltip>
                )}
              </Stack>

              <TokenButton
                disabled={isActionDisabled}
                label="Select"
                loading={showLoadingPlaceholders}
                token={toToken}
                onClick={() => setModalTarget('to')}
              />
            </SwapCard>
          </Stack>

          <Button
            disabled={isActionDisabled}
            fullWidth
            loading={swapMutation.isPending}
            size="lg"
            type="submit"
          >
            Review swap
          </Button>

          <Stack gap="xs">
            <Group justify="space-between" wrap="nowrap">
              <Text c="dimmed" fw={600} size="sm">
                Rate
              </Text>
              {showLoadingPlaceholders ? (
                <Skeleton height={18} width={160} />
              ) : (
                <OverflowTooltip fw={700} fz="sm" maw="70%" ta="right">
                  {rateText}
                </OverflowTooltip>
              )}
            </Group>
            <Group justify="space-between" wrap="nowrap">
              <Text c="dimmed" fw={600} size="sm">
                Price impact
              </Text>
              {showLoadingPlaceholders ? (
                <Skeleton height={18} width={56} />
              ) : (
                <Text c="teal" fw={700} size="sm">
                  {MOCK_PRICE_IMPACT_LABEL}
                </Text>
              )}
            </Group>

            <Collapse expanded={detailsOpened}>
              <Stack gap="xs" mt="xs">
                <Divider />
                <Group justify="space-between" wrap="nowrap">
                  <Text c="dimmed" fw={600} size="sm">
                    Max slippage
                  </Text>
                  <Text fw={700} size="sm">
                    {MOCK_MAX_SLIPPAGE_LABEL}
                  </Text>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                  <Text c="dimmed" fw={600} size="sm">
                    Network fee
                  </Text>
                  <Text fw={700} size="sm">
                    {formatUsd(MOCK_NETWORK_FEE_USD)}
                  </Text>
                </Group>
              </Stack>
            </Collapse>

            <Button
              color="gray"
              disabled={isActionDisabled}
              size={SWAP_DETAILS_BUTTON_SIZE}
              variant="subtle"
              onClick={() => setDetailsOpened((opened) => !opened)}
            >
              {detailsOpened ? 'Hide details' : 'Show details'}
            </Button>
          </Stack>
        </Stack>
      </form>

      <TokenSelectorModal
        excludedSymbol={modalTarget === 'from' ? toCurrency : fromCurrency}
        opened={modalTarget !== null}
        selectedSymbol={modalTarget === 'from' ? fromCurrency : toCurrency}
        title={modalTarget === 'from' ? 'Select an asset to sell' : 'Select an asset to receive'}
        tokens={tokens}
        onClose={() => setModalTarget(null)}
        onSelect={handleSelectToken}
      />
    </Paper>
  );
}

function SwapCard({ children }: { children: ReactNode }) {
  return (
    <Paper p="md" withBorder>
      <Box
        sx={{
          alignItems: 'center',
          display: 'grid',
          gap: 'var(--mantine-spacing-md)',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
