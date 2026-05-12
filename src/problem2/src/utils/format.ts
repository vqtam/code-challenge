export function formatUsd(value: number) {
  if (!Number.isFinite(value)) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value >= 1 ? 2 : 6,
  }).format(value);
}

export function formatTokenAmount(value: number) {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value >= 1 ? 6 : 8,
  }).format(value);
}

export function formatRate(value: number) {
  if (!Number.isFinite(value)) {
    return '0';
  }

  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: value >= 1 ? 6 : 8,
  }).format(value);
}

export function formatPriceTimestamp(value: string | null) {
  if (!value) {
    return 'Unavailable';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
