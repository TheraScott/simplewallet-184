'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  PiggyBank,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { ActivityList } from '@/components/activity/activity-list';
import { BalanceCards } from '@/components/wallet/balance-cards';
import { ConnectCard } from '@/components/wallet/connect-card';
import { SecurityCard } from '@/components/wallet/security-card';
import { useWalletSnapshot } from '@/hooks/use-wallet-snapshot';

export default function HomePage() {
  const snapshot = useWalletSnapshot();

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="app-card overflow-hidden bg-soft-grid p-6"
      >
        <PageHeader
          eyebrow="Personal vault"
          title="Store ETH simply on Base"
          description="A clear vault for beginners: deposit ETH into the contract, withdraw only your own balance, and always know what is wallet ETH vs stored ETH."
        />
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="pill border-[#B2CCFF] bg-[#EFF4FF] text-[#155EEF]">
            <Sparkles size={14} />
            Low Gas
          </span>
          <span className="pill border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]">
            <ShieldCheck size={14} />
            Beginner Friendly
          </span>
        </div>
      </motion.section>

      <ConnectCard />

      <BalanceCards
        isConnected={snapshot.isConnected}
        isWalletLoading={snapshot.walletBalance.isLoading}
        isStoredLoading={snapshot.storedBalance.isLoading}
        walletBalance={snapshot.walletBalance.data?.formatted}
        storedBalance={snapshot.storedBalance.data}
        vaultBalance={snapshot.vaultBalance.data?.formatted}
      />

      <section className="grid grid-cols-2 gap-4">
        <Link
          href="/deposit"
          className="app-card group flex min-h-[172px] flex-col justify-between overflow-hidden bg-[#155EEF] p-5 text-white"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14">
            <ArrowDownToLine size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">Quick action</p>
            <h2 className="mt-1 text-2xl font-semibold">Deposit</h2>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Move ETH from your wallet into your stored balance.
            </p>
          </div>
        </Link>

        <Link
          href="/withdraw"
          className="app-card group flex min-h-[172px] flex-col justify-between overflow-hidden bg-[#101828] p-5 text-white"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/14">
            <ArrowUpFromLine size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">Quick action</p>
            <h2 className="mt-1 text-2xl font-semibold">Withdraw</h2>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Pull out only the funds that belong to your address.
            </p>
          </div>
        </Link>
      </section>

      <section className="app-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Overview</p>
            <h2 className="section-title mt-2">What this vault does</h2>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF3] text-[#12B76A]">
            <PiggyBank size={24} />
          </div>
        </div>
        <div className="mt-4 grid gap-3">
          <div className="sub-card p-4">
            <p className="text-sm font-semibold text-[#101828]">
              Wallet ETH Balance
            </p>
            <p className="support-text mt-1">
              Your spendable ETH in the connected wallet.
            </p>
          </div>
          <div className="sub-card p-4">
            <p className="text-sm font-semibold text-[#101828]">
              Contract Balance (Your Stored Balance)
            </p>
            <p className="support-text mt-1">
              ETH tracked by the contract under your wallet address.
            </p>
          </div>
        </div>
      </section>

      <SecurityCard />

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <p className="eyebrow">Recent</p>
            <h2 className="section-title mt-1">Latest activity</h2>
          </div>
          <Link href="/activity" className="text-sm font-semibold text-[#155EEF]">
            View all
          </Link>
        </div>
        <ActivityList
          activities={snapshot.activities}
          isConnected={snapshot.isConnected}
          showFilters={false}
          limit={3}
          emptyTitle="No local activity yet"
          emptyDescription="Your recent deposits and withdrawals will appear here after you make a transaction."
        />
      </section>
    </div>
  );
}
