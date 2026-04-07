export type ActivityStatus =
  | 'waiting_wallet'
  | 'pending'
  | 'confirmed'
  | 'failed';

export type ActivityType = 'deposit' | 'withdraw';

export type ActivityRecord = {
  id: string;
  type: ActivityType;
  amount: string;
  status: ActivityStatus;
  hash?: `0x${string}`;
  createdAt: string;
  message?: string;
};

export type WalletPreferences = {
  favoriteAmounts: string[];
};

export const defaultWalletPreferences: WalletPreferences = {
  favoriteAmounts: [],
};

const activityKey = (address: string) =>
  `simplewallet:activity:${address.toLowerCase()}`;

const prefsKey = (address: string) =>
  `simplewallet:prefs:${address.toLowerCase()}`;

const emitChange = (address: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('simplewallet:activity-changed', {
      detail: { address: address.toLowerCase() },
    })
  );
};

const readJson = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export function readActivities(address?: string) {
  if (!address) {
    return [];
  }

  return readJson<ActivityRecord[]>(activityKey(address), []).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function writeActivities(address: string, activities: ActivityRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(activityKey(address), JSON.stringify(activities));
  emitChange(address);
}

export function addActivity(address: string, activity: ActivityRecord) {
  const next = [activity, ...readActivities(address)].slice(0, 50);
  writeActivities(address, next);
}

export function updateActivity(
  address: string,
  activityId: string,
  patch: Partial<ActivityRecord>
) {
  const next = readActivities(address).map((item) =>
    item.id === activityId ? { ...item, ...patch } : item
  );
  writeActivities(address, next);
}

export function readPreferences(address?: string) {
  if (!address) {
    return defaultWalletPreferences;
  }

  return {
    ...defaultWalletPreferences,
    ...readJson<WalletPreferences>(prefsKey(address), defaultWalletPreferences),
  };
}

export function writePreferences(address: string, preferences: WalletPreferences) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(prefsKey(address), JSON.stringify(preferences));
  emitChange(address);
}

const normalizeAmount = (amount: string) => {
  const value = Number(amount);
  if (Number.isNaN(value) || value <= 0) {
    return null;
  }

  return value.toString();
};

export function rememberAmount(address: string, amount: string) {
  const normalized = normalizeAmount(amount);
  if (!normalized) {
    return;
  }

  const current = readPreferences(address);
  const favoriteAmounts = [
    normalized,
    ...current.favoriteAmounts.filter((item) => item !== normalized),
  ].slice(0, 6);
  writePreferences(address, { favoriteAmounts });
}

export function clearLocalWalletData(address: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(activityKey(address));
  window.localStorage.removeItem(prefsKey(address));
  emitChange(address);
}
