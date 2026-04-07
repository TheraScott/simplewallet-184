'use client';

import { useState } from 'react';
import { Database, ShieldCheck, Trash2, Wallet } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ConnectCard } from '@/components/wallet/connect-card';
import { useWalletSnapshot } from '@/hooks/use-wallet-snapshot';
import { appConfig } from '@/lib/app-config';
import { clearLocalWalletData } from '@/lib/activity-store';
import {
  formatEth,
  formatTimestamp,
  shortenAddress,
  statusLabel,
} from '@/lib/format';

export default function MePage() {
  const snapshot = useWalletSnapshot();
  const [message, setMessage] = useState<string | null>(null);

  const clearHistory = () => {
    if (!snapshot.address) {
      setMessage('Connect a wallet before managing local cache.');
      return;
    }

    clearLocalWalletData(snapshot.address);
    setMessage('Local activity and saved amounts were cleared on this device.');
  };

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Me"
        title="Wallet, habits, and local cache"
        description="See what is read onchain, what is kept locally, and how this device remembers your recent amounts."
      />

      <ConnectCard />

      <section className="app-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Wallet profile</p>
            <h2 className="section-title mt-2">Connected identity</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF4FF] text-[#155EEF]">
            <Wallet size={22} />
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <div className="sub-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#667085]">
              Wallet address
            </p>
            <p className="mt-2 text-base font-semibold text-[#101828]">
              {snapshot.address ? shortenAddress(snapshot.address) : 'Not connected'}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="sub-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#667085]">
                Network
              </p>
              <p className="mt-2 text-base font-semibold text-[#101828]">
                {snapshot.isConnected
                  ? snapshot.isOnBase
                    ? 'Base'
                    : 'Wrong network'
                  : 'Connect first'}
              </p>
            </div>
            <div className="sub-card p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#667085]">
                Stored balance
              </p>
              <p className="mt-2 text-base font-semibold text-[#101828]">
                {snapshot.isConnected
                  ? `${formatEth(snapshot.storedBalance.data)} ETH`
                  : 'Connect first'}
              </p>
            </div>
          </div>
          <div className="sub-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#667085]">
              Contract address
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-[#101828]">
              {appConfig.contractAddress}
            </p>
          </div>
        </div>
      </section>

      <section className="app-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Common amounts</p>
            <h2 className="section-title mt-2">Recently used values</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF3] text-[#12B76A]">
            <Database size={22} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {snapshot.preferences.favoriteAmounts.length > 0 ? (
            snapshot.preferences.favoriteAmounts.map((amount) => (
              <span
                key={amount}
                className="pill border-[#D0D5DD] bg-[#F8FAFC] text-[#344054]"
              >
                {amount} ETH
              </span>
            ))
          ) : (
            <div className="sub-card w-full p-4">
              <p className="support-text">
                No amounts saved yet. Confirmed deposits and withdrawals on this
                device will populate this section.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="app-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Recent summary</p>
            <h2 className="section-title mt-2">Latest saved actions</h2>
          </div>
          <div className="pill border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]">
            Local cache
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {snapshot.activities.slice(0, 3).length > 0 ? (
            snapshot.activities.slice(0, 3).map((item) => (
              <div key={item.id} className="sub-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#101828]">
                      {item.type === 'deposit' ? 'Deposit' : 'Withdraw'} {item.amount}{' '}
                      ETH
                    </p>
                    <p className="support-text mt-1">{formatTimestamp(item.createdAt)}</p>
                  </div>
                  <span className="pill border-[#D0D5DD] bg-[#F8FAFC]">
                    {statusLabel(item.status)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="sub-card p-4">
              <p className="support-text">
                No local entries are available for this browser yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="app-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Local settings</p>
            <h2 className="section-title mt-2">Cache and safety notes</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF6ED] text-[#F79009]">
            <ShieldCheck size={22} />
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <div className="sub-card p-4">
            <p className="text-sm font-semibold text-[#101828]">
              Browser-only activity history
            </p>
            <p className="support-text mt-1">
              This Mini App stores recent actions locally because the contract
              does not expose a full user history list.
            </p>
          </div>
          <div className="sub-card p-4">
            <p className="text-sm font-semibold text-[#101828]">
              Saved amounts
            </p>
            <p className="support-text mt-1">
              Recently confirmed amounts are saved on this device to speed up the
              next deposit or withdrawal.
            </p>
          </div>
          <button type="button" className="secondary-button" onClick={clearHistory}>
            <Trash2 className="mr-2" size={16} />
            Clear local history on this device
          </button>
          {message ? <p className="support-text px-1">{message}</p> : null}
        </div>
      </section>
    </div>
  );
}
