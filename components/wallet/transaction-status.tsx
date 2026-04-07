import { CheckCircle2, Clock3, LoaderCircle, XCircle } from 'lucide-react';
import { shortenHash, statusLabel, toBaseScanTxUrl } from '@/lib/format';

type TransactionState =
  | 'idle'
  | 'preparing'
  | 'waiting_wallet'
  | 'pending'
  | 'confirmed'
  | 'failed';

type TransactionStatusProps = {
  state: TransactionState;
  message: string | null;
  hash?: `0x${string}`;
};

export function TransactionStatus({
  state,
  message,
  hash,
}: TransactionStatusProps) {
  if (state === 'idle' && !message) {
    return null;
  }

  const icon =
    state === 'confirmed' ? (
      <CheckCircle2 size={18} className="text-[#17B26A]" />
    ) : state === 'failed' ? (
      <XCircle size={18} className="text-[#F04438]" />
    ) : state === 'pending' ? (
      <Clock3 size={18} className="text-[#155EEF]" />
    ) : (
      <LoaderCircle size={18} className="animate-spin text-[#155EEF]" />
    );

  const palette =
    state === 'confirmed'
      ? 'border-[#ABEFC6] bg-[#ECFDF3]'
      : state === 'failed'
        ? 'border-[#FECDCA] bg-[#FEF3F2]'
        : 'border-[#B2CCFF] bg-[#EFF4FF]';

  return (
    <section className={`sub-card p-4 ${palette}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div>
          <p className="text-sm font-semibold text-[#101828]">{statusLabel(state)}</p>
          <p className="support-text mt-1">{message ?? 'Waiting for an update.'}</p>
          {hash ? (
            <a
              href={toBaseScanTxUrl(hash)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex text-sm font-semibold text-[#155EEF]"
            >
              {shortenHash(hash)}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
