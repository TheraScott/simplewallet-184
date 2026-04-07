'use client';

import { PageHeader } from '@/components/layout/page-header';
import { ActivityList } from '@/components/activity/activity-list';
import { ConnectCard } from '@/components/wallet/connect-card';
import { useWalletSnapshot } from '@/hooks/use-wallet-snapshot';

export default function ActivityPage() {
  const snapshot = useWalletSnapshot();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Activity"
        title="Your recent actions"
        description="This timeline is restored from local browser storage and updated after each wallet transaction."
      />
      <ConnectCard />
      <ActivityList
        activities={snapshot.activities}
        isConnected={snapshot.isConnected}
        emptyTitle="No activity recovered"
        emptyDescription="The contract does not expose a full per-user history list, so this screen builds from the transactions recorded on this device."
      />
    </div>
  );
}
