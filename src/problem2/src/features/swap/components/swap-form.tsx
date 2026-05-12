import {
  ActionIcon,
  Alert,
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
import { createStyles } from '@mantine/emotion';
import { IconArrowsDownUp, IconChevronDown, IconInfoCircle } from '@tabler/icons-react';
import { useState, type ReactNode } from 'react';
import { Controller } from 'react-hook-form';

import { DetailRow } from '@/components/detail-row/detail-row';
import { OverflowTooltip } from '@/components/overflow-tooltip/overflow-tooltip';
import { TokenIcon } from '@/components/token-icon/token-icon';
import { formatPriceTimestamp, formatRate, formatTokenAmount, formatUsd } from '@/utils/format';

import { MIN_SUPPORTED_TOKEN_COUNT } from '../constants';
import { useDelayedVisible } from '../hooks/use-delayed-visible';
import { type ModalTarget, useSwapForm } from '../hooks/use-swap-form';
import { useSwapQuote } from '../hooks/use-swap-quote';
import { useSubmitSwap } from '../hooks/use-submit-swap';
import { useTokenListQuery } from '../hooks/use-token-list-query';
import type { Token } from '../types/token';
import { TokenSelectorModal } from './token-selector-modal';

const SWAP_SKELETON_DELAY_MS = 160;

const useStyles = createStyles((theme, _params, u) => ({
  form: {
    padding: theme.spacing.md,
    width: 'min(100%, 460px)',

    [u.smallerThan('sm')]: {
      padding: theme.spacing.xs,
    },
  },
  formStack: {
    [u.smallerThan('sm')]: {
      gap: theme.spacing.sm,
    },
  },
  title: {
    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.md,
    },
  },
  description: {
    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.xs,
    },
  },
  swapCard: {
    padding: theme.spacing.md,

    [u.smallerThan('sm')]: {
      padding: theme.spacing.xs,
    },
  },
  cardHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLabel: {
    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.xs,
    },
  },
  tokenButton: {
    flexShrink: 0,
    height: 32,
    maxWidth: 154,
    minHeight: 32,
    minWidth: 112,
    paddingInline: 8,

    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.xs,
      maxWidth: 108,
      minWidth: 88,
      paddingInline: 6,
    },
  },
  tokenButtonInner: {
    [u.smallerThan('sm')]: {
      gap: 4,
    },
  },
  tokenButtonIcon: {
    [u.smallerThan('sm')]: {
      height: 16,
      minWidth: 16,
      width: 16,
    },
  },
  tokenButtonSkeleton: {
    width: 154,

    [u.smallerThan('sm')]: {
      maxWidth: 108,
      minWidth: 88,
      width: 108,
    },
  },
  amountField: {
    alignItems: 'center',
    display: 'flex',
    minHeight: 34,

    [u.smallerThan('sm')]: {
      minHeight: 30,
    },
  },
  helperText: {
    width: '100%',

    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.xs,
    },
  },
  outputAmount: {
    alignItems: 'center',
    display: 'flex',
    minHeight: 34,
    width: '100%',

    [u.smallerThan('sm')]: {
      minHeight: 30,
    },
  },
  reverseButton: {
    [u.smallerThan('sm')]: {
      height: 32,
      minWidth: 32,
      width: 32,
    },
  },
  submitButton: {
    [u.smallerThan('sm')]: {
      fontSize: theme.fontSizes.sm,
      height: 36,
    },
  },
}));

type TokenButtonProps = {
  token: Token | null;
  label: string;
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
};

function TokenButton({ token, label, disabled, loading, onClick }: TokenButtonProps) {
  const { classes } = useStyles();
  const button = (
    <Button
      className={classes.tokenButton}
      disabled={disabled}
      rightSection={<IconChevronDown size={16} />}
      size="sm"
      variant="light"
      onClick={onClick}
    >
      {token ? (
        <Group
          align="center"
          className={classes.tokenButtonInner}
          gap="xs"
          miw={0}
          wrap="nowrap"
        >
          <TokenIcon
            className={classes.tokenButtonIcon}
            size={20}
            symbol={token.symbol}
            src={token.iconUrl}
          />
          <OverflowTooltip fw={700}>{token.symbol}</OverflowTooltip>
        </Group>
      ) : (
        label
      )}
    </Button>
  );

  if (loading) {
    return (
      <Skeleton className={classes.tokenButtonSkeleton} radius="md">
        {button}
      </Skeleton>
    );
  }

  return button;
}

export function SwapForm() {
  const { classes } = useStyles();
  const tokenListQuery = useTokenListQuery();
  const showLoadingPlaceholders = useDelayedVisible(
    tokenListQuery.isPending,
    SWAP_SKELETON_DELAY_MS,
  );
  const { submitSwap, swapMutation } = useSubmitSwap();
  const tokens = tokenListQuery.data ?? [];
  const [modalTarget, setModalTarget] = useState<ModalTarget | null>(null);
  const [detailsOpened, setDetailsOpened] = useState(false);
  const { control, errors, handleSubmit, reverseTokens, selectToken, setAmount, tokenMap, watch } =
    useSwapForm(tokens);

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
  const latestPriceUpdate = getLatestPriceUpdate(fromToken?.updatedAt, toToken?.updatedAt);
  const toAmountText = toAmount > 0 ? formatTokenAmount(toAmount) : '0';

  const fromHelperText = errors.fromAmount?.message ?? formatUsd(fromUsdValue);
  const toHelperText = errors.toCurrency?.message ?? formatUsd(toUsdValue);
  const rateText = `1 ${fromToken?.symbol ?? '-'} = ${formatRate(rate)} ${toToken?.symbol ?? '-'}`;
  const amountFontSizes = getAmountFontSizes(fromAmount);
  const outputFontSizes = getAmountFontSizes(toAmountText);

  function handleSelectToken(symbol: string) {
    if (!modalTarget) {
      return;
    }

    selectToken(modalTarget, symbol);
  }

  return (
    <Paper className={classes.form} shadow="md" withBorder>
      <form onSubmit={handleSubmit(submitSwap)}>
        <Stack className={classes.formStack} gap="md">
          <Stack gap={2}>
            <Text className={classes.title} fw={700} size="lg">
              Swap
            </Text>
            <Text c="dimmed" className={classes.description} size="sm">
              Preview a simulated token swap with live prices.
            </Text>
          </Stack>

          {tokenListQuery.isError ? (
            <Alert color="red" icon={<IconInfoCircle size={18} />} title="Price feed unavailable">
              {getErrorMessage(tokenListQuery.error, 'Unexpected price loading error.')}
            </Alert>
          ) : null}

          {tokenListQuery.isSuccess && !isReady ? (
            <Alert color="yellow" icon={<IconInfoCircle size={18} />} title="Not enough token data">
              The price feed must return at least two supported tokens before a swap can be
              reviewed.
            </Alert>
          ) : null}

          <Stack gap="xs">
            <SwapCard
              label="From"
              tokenControl={
                <TokenButton
                  disabled={isActionDisabled}
                  label="Select"
                  loading={showLoadingPlaceholders}
                  token={fromToken}
                  onClick={() => setModalTarget('from')}
                />
              }
            >
              <Controller
                control={control}
                name="fromAmount"
                render={({ field }) => (
                  <div className={classes.amountField}>
                    <TextInput
                      aria-invalid={errors.fromAmount ? true : undefined}
                      aria-label="Amount to sell"
                      inputMode="decimal"
                      name={field.name}
                      placeholder="0"
                      ref={field.ref}
                      size="md"
                      styles={(_theme, _props, u) => ({
                        input: {
                          fontSize: amountFontSizes.desktop,
                          height: 34,
                          lineHeight: 1.1,
                          minHeight: 34,
                          paddingBlock: 0,
                          [u.smallerThan('sm')]: {
                            fontSize: amountFontSizes.mobile,
                            height: 30,
                            minHeight: 30,
                          },
                        },
                      })}
                      value={field.value}
                      variant="unstyled"
                      w="100%"
                      onBlur={field.onBlur}
                      onChange={(event) => setAmount(event.currentTarget.value)}
                    />
                  </div>
                )}
              />
              <OverflowTooltip
                c={errors.fromAmount ? 'red' : 'dimmed'}
                className={classes.helperText}
                fw={600}
                fz="sm"
                label={fromHelperText}
              >
                {fromHelperText}
              </OverflowTooltip>
            </SwapCard>

            <Group justify="center">
              <ActionIcon
                aria-label="Reverse swap direction"
                className={classes.reverseButton}
                disabled={isActionDisabled}
                size="md"
                variant="light"
                onClick={reverseTokens}
              >
                <IconArrowsDownUp size={18} />
              </ActionIcon>
            </Group>

            <SwapCard
              label="To"
              tokenControl={
                <TokenButton
                  disabled={isActionDisabled}
                  label="Select"
                  loading={showLoadingPlaceholders}
                  token={toToken}
                  onClick={() => setModalTarget('to')}
                />
              }
            >
              {showLoadingPlaceholders ? (
                <Skeleton height={32} maw="70%" />
              ) : (
                <div className={classes.outputAmount}>
                  <OverflowTooltip
                    fw={700}
                    fz={outputFontSizes.desktop}
                    lh={1.2}
                    sx={(_theme, u) => ({
                      width: '100%',
                      [u.smallerThan('sm')]: {
                        fontSize: outputFontSizes.mobile,
                      },
                    })}
                  >
                    {toAmountText}
                  </OverflowTooltip>
                </div>
              )}
              {showLoadingPlaceholders ? (
                <Skeleton height={18} maw={96} />
              ) : (
                <OverflowTooltip
                  c={errors.toCurrency ? 'red' : 'dimmed'}
                  className={classes.helperText}
                  fw={600}
                  fz="sm"
                  label={toHelperText}
                >
                  {toHelperText}
                </OverflowTooltip>
              )}
            </SwapCard>
          </Stack>

          <Button
            className={classes.submitButton}
            disabled={isActionDisabled}
            fullWidth
            loading={swapMutation.isPending}
            size="md"
            type="submit"
          >
            Review swap
          </Button>

          <Stack gap="xs">
            <DetailRow
              label="Rate"
              loading={showLoadingPlaceholders}
              skeletonWidth={160}
              value={rateText}
            />
            <DetailRow
              label="Sell value"
              loading={showLoadingPlaceholders}
              skeletonWidth={56}
              value={formatUsd(fromUsdValue)}
            />

            <Collapse expanded={detailsOpened}>
              <Stack gap="xs" mt="xs">
                <Divider />
                <DetailRow label="Receive value" value={formatUsd(toUsdValue)} />
                <DetailRow label="Price updated" value={formatPriceTimestamp(latestPriceUpdate)} />
              </Stack>
            </Collapse>

            <Button
              color="gray"
              disabled={isActionDisabled}
              size="sm"
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

type SwapCardProps = {
  children: ReactNode;
  label: string;
  tokenControl: ReactNode;
};

function SwapCard({ children, label, tokenControl }: SwapCardProps) {
  const { classes } = useStyles();

  return (
    <Paper className={classes.swapCard} withBorder>
      <Stack gap="xs">
        <Group className={classes.cardHeader} wrap="nowrap">
          <Text c="dimmed" className={classes.cardLabel} fw={700} size="sm">
            {label}
          </Text>
          {tokenControl}
        </Group>
        {children}
      </Stack>
    </Paper>
  );
}

function getAmountFontSizes(value: string) {
  const length = value.replace(/[^\d]/g, '').length;

  if (length > 14) {
    return { desktop: 22, mobile: 18 };
  }

  if (length > 10) {
    return { desktop: 24, mobile: 20 };
  }

  return { desktop: 28, mobile: 24 };
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getLatestPriceUpdate(...dates: Array<string | null | undefined>) {
  return dates
    .filter((date): date is string => Boolean(date))
    .reduce<string | null>((latest, date) => {
      const nextTime = new Date(date).getTime();

      if (Number.isNaN(nextTime)) {
        return latest;
      }

      if (!latest) {
        return date;
      }

      const latestTime = new Date(latest).getTime();

      return Number.isNaN(latestTime) || nextTime > latestTime ? date : latest;
    }, null);
}
