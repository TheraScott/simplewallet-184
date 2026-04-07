'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownToLine, ArrowUpFromLine, Clock3, XCircle } from 'lucide-react';
import { type ActivityRecord } from '@/lib/activity-store';
import {
  formatTimestamp,
  shortenHash,
  statusLabel,
  toBaseScanTxUrl,
} from '@/lib/format';

type FilterValue = 'all' | 'deposit' | 'withdraw' | 'failed';

type ActivityListProps = {
  activities: ActivityRecord[];
  isConnected: boolean;
  showFilters?: boolean;
  limit?: number;
  emptyTitle: string;
  emptyDescription: string;
};

const filters: { label: string; value: FilterValue }[] = [
  { label: 'All', value: 'all' },
  { label: 'Deposits', value: 'deposit' },
  { label: 'Withdrawals', value: 'withdraw' },
  { label: 'Failed', value: 'failed' },
];

export function ActivityList({
  activities,
  isConnected,
  showFilters = true,
  limit,
  emptyTitle,
  emptyDescription,
}: ActivityListProps) {
  const [filter, setFilter] = useState<FilterValue>('all');

  const filtered = activities.filter((item) => {
    if (filter === 'all') {
      return true;
    }

    if (filter === 'failed') {
      return item.status === 'failed';
    }

    return item.type === filter;
  });

  const visibleItems = typeof limit === 'number' ? filtered.slice(0, limit) : filtered;

  if (!isConnected) {
    return (
      <section className="app-card p-5">
        <p className="section-title">Connect to view activity</p>
        <p className="support-text mt-2">
          Your local deposit and withdrawal timeline will appear here once a wallet
          is connected on this device.
        </p>
      </section>
    );
  }

  return (
    <section className="app-card p-5">
      {showFilters ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              className={
                filter === item.value
                  ? 'pill border-[#B2CCFF] bg-[#EFF4FF] text-[#155EEF]'
                  : 'pill border-[#D0D5DD] bg-white'
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}

      {visibleItems.length === 0 ? (
        <div className="sub-card p-5">
          <p className="section-title">{emptyTitle}</p>
          <p className="support-text mt-2">{emptyDescription}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleItems.map((item, index) => {
            const failed = item.status === 'failed';
            const isDeposit = item.type === 'deposit';
            const Icon = failed
              ? XCircle
              : isDeposit
                ? ArrowDownToLine
                : ArrowUpFromLine;

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="relative overflow-hidden rounded-[24px] border bg-white p-4"
              >
                <div className="absolute inset-y-5 left-5 w-px bg-[#EAECF0]" />
                <div className="relative flex gap-4">
                  <div
                    className={
                      failed
                        ? 'relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FEF3F2] text-[#F04438]'
                        : isDeposit
                          ? 'relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFF4FF] text-[#155EEF]'
                          : 'relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF6ED] text-[#F79009]'
                    }
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#101828]">
                          {isDeposit ? 'Deposit' : 'Withdraw'} {item.amount} ETH
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[#667085]">
                          <span className="inline-flex items-center gap-1">
                            <Clock3 size={13} />
                            {formatTimestamp(item.createdAt)}
                          </span>
                          <span className="pill border-[#D0D5DD] bg-[#F8FAFC]">
                            {statusLabel(item.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      {item.hash ? (
                        <a
                          href={toBaseScanTxUrl(item.hash)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#155EEF]"
                        >
                          {shortenHash(item.hash)}
                        </a>
                      ) : (
                        <span className="text-[#98A2B3]">No tx hash saved</span>
                      )}
                      {item.message ? (
                        <span className="text-[#98A2B3]">{item.message}</span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  );
}
