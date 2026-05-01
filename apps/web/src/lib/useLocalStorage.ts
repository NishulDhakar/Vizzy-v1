import { useState, useCallback } from 'react';

// ─── Core hook ────────────────────────────────────────────────────────────────

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Lazy-init: read from localStorage on first render (SSR-safe)
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue(prev => {
          const next = typeof value === 'function'
            ? (value as (p: T) => T)(prev)
            : value;
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(next));
          }
          return next;
        });
      } catch {
        // localStorage can fail in private mode or when quota is exceeded
      }
    },
    [key],
  );

  const remove = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }, [key, initialValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return [storedValue, setValue, remove];
}

// ─── Plain read/write helpers (for use outside React) ────────────────────────

export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function lsSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded — silently skip
  }
}

export function lsRemove(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
