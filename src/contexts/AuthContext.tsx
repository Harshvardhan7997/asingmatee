import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, Badge } from '@/lib/mock-data';
import { ALL_BADGES } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  isImpersonating: boolean;
  login: (username: string, password: string, role: 'student' | 'admin', adminKey?: string) => boolean;
  logout: () => void;
  toggleImpersonation: () => void;
  addXP: (amount: number, multiplier?: string) => void;
  unlockBadge: (badgeId: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('astraeus_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isImpersonating, setIsImpersonating] = useState(false);

  const login = useCallback((username: string, _password: string, role: 'student' | 'admin', adminKey?: string) => {
    if (role === 'admin' && adminKey !== 'admin123') return false;
    const newUser: User = {
      id: role === 'admin' ? 'admin-1' : 'student-1',
      username,
      email: `${username.toLowerCase()}@astraeus.edu`,
      role,
      level: role === 'admin' ? 99 : 7,
      xp: role === 'admin' ? 99999 : 1450,
      xpToNext: 2000,
      streak: role === 'admin' ? 0 : 5,
      badges: ALL_BADGES.slice(0, 3).map(b => ({ ...b, unlockedAt: new Date().toISOString() })),
      joinedAt: new Date().toISOString(),
      subjects: ['dsa', 'python', 'cpp'],
    };
    setUser(newUser);
    localStorage.setItem('astraeus_user', JSON.stringify(newUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsImpersonating(false);
    localStorage.removeItem('astraeus_user');
  }, []);

  const toggleImpersonation = useCallback(() => setIsImpersonating(p => !p), []);

  const addXP = useCallback((amount: number, multiplier?: string) => {
    setUser(prev => {
      if (!prev) return prev;
      let finalXP = amount;
      if (multiplier === 'early-bird') finalXP = Math.floor(amount * 1.15);
      if (multiplier === 'clean-code') finalXP = Math.floor(amount * 1.15);
      const newXP = prev.xp + finalXP;
      const newLevel = newXP >= prev.xpToNext ? prev.level + 1 : prev.level;
      const newXPToNext = newXP >= prev.xpToNext ? prev.xpToNext + 500 : prev.xpToNext;
      const updated = { ...prev, xp: newXP >= prev.xpToNext ? newXP - prev.xpToNext : newXP, level: newLevel, xpToNext: newXPToNext };
      localStorage.setItem('astraeus_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setUser(prev => {
      if (!prev) return prev;
      if (prev.badges.find(b => b.id === badgeId)) return prev;
      const badge = ALL_BADGES.find(b => b.id === badgeId);
      if (!badge) return prev;
      const updated = { ...prev, badges: [...prev.badges, { ...badge, unlockedAt: new Date().toISOString() }] };
      localStorage.setItem('astraeus_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isImpersonating, login, logout, toggleImpersonation, addXP, unlockBadge }}>
      {children}
    </AuthContext.Provider>
  );
};
