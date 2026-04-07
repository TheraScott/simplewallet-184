import { LockKeyhole, ShieldCheck, WalletCards } from 'lucide-react';

type SecurityCardProps = {
  variant?: 'default' | 'compact';
  emphasis?: 'safe' | 'warning';
};

export function SecurityCard({
  variant = 'default',
  emphasis = 'safe',
}: SecurityCardProps) {
  const compact = variant === 'compact';
  const title =
    emphasis === 'warning' ? 'Withdrawal notes' : 'Simple safety checks';

  return (
    <section className="app-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Safety</p>
          <h2 className="section-title mt-2">{title}</h2>
        </div>
        <div
          className={
            emphasis === 'warning'
              ? 'flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF6ED] text-[#F79009]'
              : 'flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF3] text-[#12B76A]'
          }
        >
          <ShieldCheck size={22} />
        </div>
      </div>

      <div className={`mt-4 grid gap-3 ${compact ? '' : 'sm:grid-cols-3'}`}>
        <div className="sub-card p-4">
          <LockKeyhole size={18} className="text-[#155EEF]" />
          <p className="mt-3 text-sm font-semibold text-[#101828]">
            Your balance only
          </p>
          <p className="support-text mt-1">
            The contract tracks balances per wallet address, so you manage only your
            own funds.
          </p>
        </div>
        <div className="sub-card p-4">
          <WalletCards size={18} className="text-[#12B76A]" />
          <p className="mt-3 text-sm font-semibold text-[#101828]">
            Clear balance split
          </p>
          <p className="support-text mt-1">
            This app always separates wallet ETH from stored ETH to avoid beginner
            confusion.
          </p>
        </div>
        <div className="sub-card p-4">
          <ShieldCheck
            size={18}
            className={emphasis === 'warning' ? 'text-[#F79009]' : 'text-[#155EEF]'}
          />
          <p className="mt-3 text-sm font-semibold text-[#101828]">
            Withdraw guarded
          </p>
          <p className="support-text mt-1">
            The contract includes reentrancy protection on withdrawal, and the UI
            checks balance and network before sending.
          </p>
        </div>
      </div>
    </section>
  );
}
