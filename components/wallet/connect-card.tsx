'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  LogOut,
  Wallet,
  Waypoints,
} from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { shortenAddress } from '@/lib/format';

const connectorLabels: Record<string, string> = {
  coinbaseWalletSDK: 'Coinbase Wallet',
  injected: 'Browser Wallet',
};

export function ConnectCard() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connectAsync, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const [message, setMessage] = useState<string | null>(null);

  const wrongNetwork = isConnected && chainId !== base.id;

  if (isConnected) {
    return (
      <section className="app-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="pill border-[#ABEFC6] bg-[#ECFDF3] text-[#027A48]">
              <CheckCircle2 size={14} />
              Wallet connected
            </div>
            <p className="mt-4 text-lg font-semibold text-[#101828]">
              {shortenAddress(address)}
            </p>
            <p className="support-text mt-2">
              {wrongNetwork
                ? 'Switch to Base before sending a transaction.'
                : 'Funds are always tied to this wallet address.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => disconnect()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-white text-[#344054]"
            aria-label="Disconnect wallet"
          >
            <LogOut size={18} />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <div className="pill border-[#D0D5DD] bg-[#F8FAFC]">
            <Waypoints size={14} />
            {wrongNetwork ? 'Wrong network' : 'Base'}
          </div>
          {wrongNetwork ? (
            <button
              type="button"
              onClick={async () => {
                try {
                  setMessage(null);
                  await switchChainAsync({ chainId: base.id });
                } catch (error) {
                  setMessage(
                    error instanceof Error ? error.message : 'Unable to switch network.'
                  );
                }
              }}
              className="pill border-[#B2CCFF] bg-[#EFF4FF] text-[#155EEF]"
              disabled={isSwitching}
            >
              {isSwitching ? 'Switching...' : 'Switch to Base'}
            </button>
          ) : null}
        </div>

        {message ? <p className="support-text mt-3">{message}</p> : null}
      </section>
    );
  }

  return (
    <section className="app-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Connect</p>
          <h2 className="section-title mt-2">Choose a wallet</h2>
          <p className="support-text mt-2">
            Connect to read your contract balance, deposit ETH, and withdraw your
            own stored funds.
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF4FF] text-[#155EEF]">
          <Wallet size={22} />
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            type="button"
            disabled={isPending || !connector.ready}
            onClick={async () => {
              try {
                setMessage(null);
                await connectAsync({ connector });
              } catch (error) {
                setMessage(
                  error instanceof Error ? error.message : 'Unable to connect wallet.'
                );
              }
            }}
            className="secondary-button justify-between"
          >
            <span>{connectorLabels[connector.id] ?? connector.name}</span>
            <span className="text-xs text-[#667085]">
              {!connector.ready ? 'Unavailable' : 'Connect'}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-[22px] border border-[#FEDF89] bg-[#FFFAEB] p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="mt-0.5 text-[#F79009]" />
          <div>
            <p className="text-sm font-semibold text-[#B54708]">
              Wallet ETH and stored ETH are different
            </p>
            <p className="mt-1 text-sm leading-6 text-[#B54708]/90">
              Wallet ETH stays in your wallet. Stored ETH is ETH that you deposit
              into the contract under your own address.
            </p>
          </div>
        </div>
      </div>

      {message ? <p className="support-text mt-3">{message}</p> : null}
    </section>
  );
}
