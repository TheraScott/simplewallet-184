'use client';

import { useEffect, useState } from 'react';
import {
  defaultWalletPreferences,
  readActivities,
  readPreferences,
  type ActivityRecord,
  type WalletPreferences,
} from '@/lib/activity-store';

export function useActivityStore(address?: string) {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [preferences, setPreferences] = useState<WalletPreferences>(
    defaultWalletPreferences
  );

  useEffect(() => {
    const load = () => {
      if (!address) {
        setActivities([]);
        setPreferences(defaultWalletPreferences);
        return;
      }

      setActivities(readActivities(address));
      setPreferences(readPreferences(address));
    };

    load();

    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ address?: string }>).detail;
      if (!detail?.address || !address || detail.address === address.toLowerCase()) {
        load();
      }
    };

    window.addEventListener('storage', load);
    window.addEventListener('simplewallet:activity-changed', onChange as EventListener);

    return () => {
      window.removeEventListener('storage', load);
      window.removeEventListener(
        'simplewallet:activity-changed',
        onChange as EventListener
      );
    };
  }, [address]);

  return { activities, preferences };
}
