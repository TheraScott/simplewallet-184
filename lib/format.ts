import { formatEther, type Hash } from 'viem';

export function formatEth(value?: bigint, fractionDigits = 4) {
  if (value === undefined) {
    return '0.0000';
  }

  const parsed = Number(formatEther(value));
  return parsed.toFixed(fractionDigits);
}

export function shortenAddress(address?: string) {
  if (!address) {
    return 'Not connected';
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function shortenHash(hash: Hash) {
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

export function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function statusLabel(status: string) {
  switch (status) {
    case 'preparing':
      return 'Preparing';
    case 'waiting_wallet':
      return 'Waiting Wallet';
    case 'pending':
      return 'Pending';
    case 'confirmed':
      return 'Confirmed';
    case 'failed':
      return 'Failed';
    default:
      return 'Idle';
  }
}

export function getErrorMessage(error: unknown) {
  const message =
    error instanceof Error ? error.message : 'Transaction could not be completed.';

  if (/user rejected|user denied|rejected/i.test(message)) {
    return 'Transaction was rejected in the wallet.';
  }

  if (/insufficient funds/i.test(message)) {
    return 'Insufficient funds for this action.';
  }

  if (/switch chain/i.test(message)) {
    return 'Please switch to Base and try again.';
  }

  return message;
}

export function toBaseScanTxUrl(hash: Hash) {
  return `https://basescan.org/tx/${hash}`;
}
