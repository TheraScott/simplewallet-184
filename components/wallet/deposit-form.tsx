'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownToLine, Coins, ShieldCheck } from 'lucide-react';
import { usePublicClient, useSwitchChain, useWriteContract } from 'wagmi';
import { base } from 'wagmi/chains';
import { type Address, parseEther } from 'viem';
import { addActivity, rememberAmount, updateActivity } from '@/lib/activity-store';
import { simpleWalletContract } from '@/lib/contracts';
import { formatEth, getErrorMessage } from '@/lib/format';
import { TransactionStatus } from './transaction-status';

type DepositFormProps = {
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

const defaultAmounts = ['0.001', '0.005', '0.01', '0.05'];
const gasReserve = parseEther('0.0002');

export function DepositForm({
  address,
  isConnected,
  isOnBase,
  walletBalance,
  storedBalance,
  favoriteAmounts,
  onRefresh,
}: DepositFormProps) {
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<TransactionState>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync, isPending } = useWriteContract();
  const publicClient = usePublicClient({ chainId: base.id });
  const quickAmounts = favoriteAmounts.length > 0 ? favoriteAmounts : defaultAmounts;

  const submitDeposit = async () => {
    const activityId = `deposit-${Date.now()}`;
    const trimmedAmount = amount.trim();

    try {
      setHash(undefined);
      setMessage(null);
      setStatus('preparing');

      if (!isConnected || !address) {
        throw new Error('Connect your wallet first.');
      }

      if (!trimmedAmount) {
        throw new Error('Enter an amount to deposit.');
      }

      const depositValue = parseEther(trimmedAmount);
      if (depositValue <= 0n) {
        throw new Error('Amount must be greater than 0.');
      }

      if (!walletBalance) {
        throw new Error('Wallet balance is still loading. Try again in a moment.');
      }

      if (walletBalance < depositValue + gasReserve) {
        throw new Error('Insufficient balance for deposit and gas.');
      }

      if (!isOnBase) {
        await switchChainAsync({ chainId: base.id });
      }

      setStatus('waiting_wallet');

      const txHash = await writeContractAsync({
        ...simpleWalletContract,
        functionName: 'deposit',
        value: depositValue,
      });

      setHash(txHash);
      setStatus('pending');
      setMessage('Deposit submitted. Waiting for confirmation on Base.');

      addActivity(address, {
        id: activityId,
        type: 'deposit',
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
      setMessage('Deposit confirmed. Your stored balance has been refreshed.');
      setAmount('');
      await onRefresh();
    } catch (error) {
      const resolvedMessage = getErrorMessage(error);
      setStatus('failed');
      setMessage(resolvedMessage);

      if (address) {
        addActivity(address, {
          id: `${activityId}-failed`,
          type: 'deposit',
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
        className="app-card overflow-hidden bg-[#155EEF] p-5 text-white"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-white/70">Action</p>
            <h2 className="mt-2 text-3xl font-semibold">Deposit Now</h2>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Funds are stored under your wallet address and can only be managed by
              that same address later.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-[22px] bg-white/14">
            <ArrowDownToLine size={24} />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-white/15 bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Wallet balance
            </p>
            <p className="mt-2 text-xl font-semibold">
              {formatEth(walletBalance)} ETH
            </p>
          </div>
          <div className="rounded-[22px] border border-white/15 bg-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Current stored
            </p>
            <p className="mt-2 text-xl font-semibold">
              {formatEth(storedBalance)} ETH
            </p>
          </div>
        </div>
      </motion.div>

      <div className="app-card p-5">
        <label className="text-sm font-semibold text-[#101828]" htmlFor="deposit-amount">
          Amount in ETH
        </label>
        <div className="mt-3">
          <input
            id="deposit-amount"
            className="text-field text-3xl"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {quickAmounts.map((value) => (
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

        <div className="mt-5 rounded-[22px] border border-[#D0D5DD] bg-[#F8FAFC] p-4">
          <div className="flex items-start gap-3">
            <Coins size={18} className="mt-0.5 text-[#155EEF]" />
            <div>
              <p className="text-sm font-semibold text-[#101828]">
                Funds are stored under your wallet address
              </p>
              <p className="support-text mt-1">
                Deposit moves ETH into the contract. Your main wallet balance goes
                down, while your stored balance goes up.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={submitDeposit}
          disabled={isPending || status === 'pending' || status === 'waiting_wallet'}
          className="primary-button mt-5"
        >
          {status === 'waiting_wallet'
            ? 'Waiting for wallet...'
            : status === 'pending'
              ? 'Transaction Pending...'
              : 'Deposit Now'}
        </button>
      </div>

      <div className="sub-card p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck size={18} className="mt-0.5 text-[#12B76A]" />
          <div>
            <p className="text-sm font-semibold text-[#101828]">Before you send</p>
            <p className="support-text mt-1">
              Keep a little ETH in your wallet for gas. This app checks your wallet
              balance before letting you deposit.
            </p>
          </div>
        </div>
      </div>

      <TransactionStatus state={status} message={message} hash={hash} />
    </section>
  );
}
