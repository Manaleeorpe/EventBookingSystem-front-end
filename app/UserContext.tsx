// app/UserContext.tsx (or src/contexts/UserContext.tsx)
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

import type { User } from '@/lib/types';

type Ctx = {
  user: User | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  setUser: (u: User | null) => void;
};

// 1) Create the context with sensible defaults
const UserContext = createContext<Ctx>({
  user: null,
  loading: true,
  error: null,
  refresh: async () => {},
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  // 2) Single user object, not an array
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3) Fetch current user once (and on refresh)
  const fetchMe = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:8080/auth/google/me', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as User | null;
      console.log(data)
      setUser(data ?? null);
    } catch (e: any) {
      setUser(null);
      setError(e?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      refresh: fetchMe,
      setUser,
    }),
    [user, loading, error]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// 4) Hook to consume the context
export const useUser = () => useContext(UserContext);