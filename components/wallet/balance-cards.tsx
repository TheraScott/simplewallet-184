import { formatEth } from '@/lib/format';

type BalanceCardsProps = {
  isConnected: boolean;
  isWalletLoading: boolean;
  isStoredLoading: boolean;
  walletBalance?: string;
  storedBalance?: bigint;
  vaultBalance?: string;
};

export function BalanceCards({
  isConnected,
  isWalletLoading,
  isStoredLoading,
  walletBalance,
  storedBalance,
  vaultBalance,
}: BalanceCardsProps) {
  return (
    <section className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <article className="app-card p-5">
          <p className="eyebrow">Wallet ETH Balance</p>
          <p className="mt-4 text-3xl font-semibold text-[#101828]">
            {isConnected
              ? isWalletLoading
                ? 'Loading...'
                : `${Number(walletBalance ?? '0').toFixed(4)}`
              : '--'}
          </p>
          <p className="support-text mt-2">Spendable ETH in your wallet</p>
        </article>

        <article className="app-card p-5">
          <p className="eyebrow">Your Stored Balance</p>
          <p className="mt-4 text-3xl font-semibold text-[#101828]">
            {isConnected ? (isStoredLoading ? 'Loading...' : formatEth(storedBalance)) : '--'}
          </p>
          <p className="support-text mt-2">Tracked inside the contract for you</p>
        </article>
      </div>

      <article className="sub-card flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-semibold text-[#101828]">Vault address balance</p>
          <p className="support-text mt-1">
            Native ETH currently held by the contract address
          </p>
        </div>
        <div className="rounded-2xl bg-[#F8FAFC] px-4 py-2 text-sm font-semibold text-[#101828]">
          {vaultBalance ? `${Number(vaultBalance).toFixed(4)} ETH` : 'Loading...'}
        </div>
      </article>
    </section>
  );
}
