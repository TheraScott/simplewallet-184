'use client';

import { useAccount, useBalance, useChainId, useReadContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { zeroAddress } from 'viem';
import { simpleWalletContract } from '@/lib/contracts';
import { useActivityStore } from './use-activity-store';

export function useWalletSnapshot() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const walletBalance = useBalance({
    address,
    chainId: base.id,
    query: { enabled: Boolean(address) },
  });
  const storedBalance = useReadContract({
    ...simpleWalletContract,
    functionName: 'balances',
    args: [address ?? zeroAddress],
    query: { enabled: Boolean(address) },
  });
  const vaultBalance = useBalance({
    address: simpleWalletContract.address,
    chainId: base.id,
  });
  const { activities, preferences } = useActivityStore(address);

  const refetchAll = async () => {
    await Promise.all([
      walletBalance.refetch(),
      storedBalance.refetch(),
      vaultBalance.refetch(),
    ]);
  };

  return {
    address,
    isConnected,
    isOnBase: chainId === base.id,
    walletBalance,
    storedBalance,
    vaultBalance,
    activities,
    preferences,
    refetchAll,
  };
}
