"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
// import { createClient } from '@/lib/supabase';

// ============ AUTH DISABLED ============
// Lazy singleton — never created during SSR/prerender.
// Only initialised the first time useEffect or an event handler calls getClient().
// let _client: ReturnType<typeof createClient> | null = null;
// function getClient() {
//   if (!_client) _client = createClient();
//   return _client;
// }
// ========================================

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Mock default auth context with auth disabled
const defaultAuthValue: AuthContextValue = {
  user: null,
  session: null,
  signInWithGoogle: async () => {
    console.log('Auth disabled - signInWithGoogle is a no-op');
  },
  signOut: async () => {
    console.log('Auth disabled - signOut is a no-op');
  },
};

const AuthContext = createContext<AuthContextValue>(defaultAuthValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // ============ AUTH DISABLED ============
  // useEffect(() => {
  //   const supabase = getClient();

  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session);
  //     setUser(session?.user ?? null);
  //   });

  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session);
  //     setUser(session?.user ?? null);
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);

  // const signInWithGoogle = async () => {
  //   await getClient().auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo: `${window.location.origin}/auth/callback`,
  //     },
  //   });
  // };

  // const signOut = async () => {
  //   await getClient().auth.signOut();
  //   window.location.href = '/auth/login';
  // };
  // ========================================

  return (
    <AuthContext.Provider value={defaultAuthValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

