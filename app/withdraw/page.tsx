'use client';

import { PageHeader } from '@/components/layout/page-header';
import { ConnectCard } from '@/components/wallet/connect-card';
import { SecurityCard } from '@/components/wallet/security-card';
import { WithdrawForm } from '@/components/wallet/withdraw-form';
import { useWalletSnapshot } from '@/hooks/use-wallet-snapshot';

export default function WithdrawPage() {
  const snapshot = useWalletSnapshot();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Withdraw"
        title="Withdraw only your stored ETH"
        description="This action pulls funds from your contract balance back to your wallet. You cannot withdraw another user's funds."
      />
      <ConnectCard />
      <WithdrawForm
        address={snapshot.address}
        isConnected={snapshot.isConnected}
        isOnBase={snapshot.isOnBase}
        walletBalance={snapshot.walletBalance.data?.value}
        storedBalance={snapshot.storedBalance.data}
        favoriteAmounts={snapshot.preferences.favoriteAmounts}
        onRefresh={snapshot.refetchAll}
      />
      <SecurityCard variant="compact" emphasis="warning" />
    </div>
  );
}
