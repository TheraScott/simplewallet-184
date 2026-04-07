'use client';

import { PageHeader } from '@/components/layout/page-header';
import { ConnectCard } from '@/components/wallet/connect-card';
import { DepositForm } from '@/components/wallet/deposit-form';
import { SecurityCard } from '@/components/wallet/security-card';
import { useWalletSnapshot } from '@/hooks/use-wallet-snapshot';

export default function DepositPage() {
  const snapshot = useWalletSnapshot();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Deposit"
        title="Store ETH under your wallet"
        description="Deposit ETH into the contract and keep the balance tied to your connected address."
      />
      <ConnectCard />
      <DepositForm
        address={snapshot.address}
        isConnected={snapshot.isConnected}
        isOnBase={snapshot.isOnBase}
        walletBalance={snapshot.walletBalance.data?.value}
        storedBalance={snapshot.storedBalance.data}
        favoriteAmounts={snapshot.preferences.favoriteAmounts}
        onRefresh={snapshot.refetchAll}
      />
      <SecurityCard variant="compact" />
    </div>
  );
}
