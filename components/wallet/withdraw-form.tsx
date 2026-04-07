'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowUpFromLine, ShieldCheck } from 'lucide-react';
import { usePublicClient, useSwitchChain, useWriteContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { type Address, formatEther, parseEther } from 'viem';
import { addActivity, rememberAmount, updateActivity } from '@/lib/activity-store';
import { simpleWalletContract } from '@/lib/contracts';
import { formatEth, getErrorMessage } from '@/lib/format';
import { TransactionStatus } from './transaction-status';

type WithdrawFormProps = {
  address?: Address;
  isConnected: boolean;
  isOnBase: boolean;
  walletBalance?: bigint;
  storedBalance?: bigint;
  favoriteAmounts: string[];
  onRefresh: () => Promise<unknown>;
};

type TransactionState =
  | 'idle'
  | 'preparing'
  | 'waiting_wallet'
  | 'pending'
  | 'confirmed'
  | 'failed';

const gasReserve = parseEther('0.0002');

export function WithdrawForm({
  address,
  isConnected,
  isOnBase,
  walletBalance,
  storedBalance,
  favoriteAmounts,
  onRefresh,
}: WithdrawFormProps) {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<TransactionState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();
  const publicClient = usePublicClient({ chainId: base.id });

  const submitWithdraw = async () => {
    const activityId = `withdraw-${Date.now()}`;
    const trimmedAmount = amount.trim();

    try {
      setHash(undefined);
      setMessage(null);
      setStatus('preparing');

      if (!isConnected || !address) {
        throw new Error('Connect your wallet first.');
      }

      if (!trimmedAmount) {
        throw new Error('Enter an amount to withdraw.');
      }

      const withdrawValue = parseEther(trimmedAmount);
      if (withdrawValue <= 0n) {
        throw new Error('Amount must be greater than 0.');
      }

      if (!storedBalance && storedBalance !== 0n) {
        throw new Error('Stored balance is still loading. Try again in a moment.');
      }

      if (withdrawValue > storedBalance) {
        throw new Error('Insufficient contract balance for this withdrawal.');
      }

      if (!walletBalance || walletBalance < gasReserve) {
        throw new Error('Keep a little wallet ETH for gas before withdrawing.');
      }

      if (!isOnBase) {
        await switchChainAsync({ chainId: base.id });
      }

      setStatus('waiting_wallet');

      const txHash = await writeContractAsync({
        ...simpleWalletContract,
        functionName: 'withdraw',
        args: [withdrawValue],
      });

      setHash(txHash);
      setStatus('pending');
      setMessage('Withdrawal submitted. Waiting for confirmation on Base.');

      addActivity(address, {
        id: activityId,
        type: 'withdraw',
        amount: trimmedAmount,
        status: 'pending',
        hash: txHash,
        createdAt: new Date().toISOString(),
      });

      const receipt = await publicClient?.waitForTransactionReceipt({ hash: txHash });

      if (!receipt || receipt.status !== 'success') {
        throw new Error('Transaction failed before confirmation.');
      }

      updateActivity(address, activityId, {
        status: 'confirmed',
      });
      rememberAmount(address, trimmedAmount);
      setStatus('confirmed');
      setMessage('Withdrawal confirmed. Your balances have been refreshed.');
      setAmount('');
      await onRefresh();
    } catch (error) {
      const resolvedMessage = getErrorMessage(error);
      setStatus('failed');
      setMessage(resolvedMessage);

      if (address) {
        addActivity(address, {
          id: `${activityId}-failed`,
          type: 'withdraw',
          amount: trimmedAmount || '0',
          status: 'failed',
          hash,
          createdAt: new Date().toISOString(),
          message: resolvedMessage,
        });
      }
    }
  };

  return (
    <section className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="app-card overflow-hidden border-[#FEC84B] bg-[#101828] p-5 text-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-white/70">Action</p>
            <h2 className="mt-2 text-3xl font-semibold">Withdraw Funds</h2>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Only your own stored balance can be withdrawn. This page checks the
              amount against your contract balance before sending.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-white/14">
            <ArrowUpFromLine size={24} />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/15 bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Available to withdraw
            </p>
            <p className="mt-2 text-xl font-semibold">
              {formatEth(storedBalance)} ETH
            </p>
          </div>
          <div className="rounded-[22px] border border-white/15 bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Wallet gas buffer
            </p>
            <p className="mt-2 text-xl font-semibold">
              {formatEth(walletBalance)} ETH
            </p>
          </div>
        </div>
      </motion.div>

      <div className="app-card p-5">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-semibold text-[#101828]" htmlFor="withdraw-amount">
            Amount in ETH
          </label>
          <button
            type="button"
            className="pill border-[#FEDF89] bg-[#FFFAEB] text-[#B54708]"
            onClick={() => setAmount(storedBalance ? formatEther(storedBalance) : '0')}
          >
            Max
          </button>
        </div>
        <div className="mt-3">
          <input
            id="withdraw-amount"
            className="text-field text-3xl"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {favoriteAmounts.slice(0, 4).map((value) => (
            <button
              key={value}
              type="button"
              className="pill border-[#D0D5DD] bg-[#F8FAFC]"
              onClick={() => setAmount(value)}
            >
              {value} ETH
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[22px] border border-[#FEDF89] bg-[#FFFAEB] p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 text-[#F79009]" />
            <div>
              <p className="text-sm font-semibold text-[#B54708]">
                Balance and gas checks are stricter here
              </p>
              <p className="mt-1 text-sm leading-6 text-[#B54708]/90">
                Withdraw cannot exceed your stored balance, and you still need a bit
                of wallet ETH to pay gas for the transaction.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={submitWithdraw}
          disabled={isPending || status === 'pending' || status === 'waiting_wallet'}
          className="primary-button mt-5 bg-[#101828]"
        >
          {status === 'waiting_wallet'
            ? 'Waiting for wallet...'
            : status === 'pending'
              ? 'Transaction Pending...'
              : 'Withdraw'}
        </button>
      </div>

      <div className="sub-card p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 text-[#12B76A]" />
          <div>
            <p className="text-sm font-semibold text-[#101828]">
              Safe by address ownership
            </p>
            <p className="support-text mt-1">
              The contract balance is tracked per address. This app does not expose
              a shared pool or transfer-to-others flow.
            </p>
          </div>
        </div>
      </div>

      <TransactionStatus state={status} message={message} hash={hash} />
    </section>
  );
}
