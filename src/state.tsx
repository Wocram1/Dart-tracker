import React, { createContext, useContext, useState } from 'react';

type User = {
  id: number;
  name: string;
  xp: number;
  level: number;
  xpToNext: number;
};

type Session = {
  id: string;
  score: number;
};

type AppState = {
  user: User | null;
  setUser: (u: User | null) => void;
  session: Session | null;
  setSession: (s: Session | null) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  return (
    <AppContext.Provider value={{ user, setUser, session, setSession }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
