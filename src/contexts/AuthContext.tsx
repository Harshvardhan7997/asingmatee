import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import type { Badge } from '@/lib/mock-data';
import { ALL_BADGES } from '@/lib/mock-data';

export interface AppUser {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  badges: Badge[];
  joinedAt: string;
  subjects: string[];
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  isImpersonating: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, username: string, role: 'student' | 'teacher') => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  toggleImpersonation: () => void;
  addXP: (amount: number, multiplier?: string) => Promise<void>;
  unlockBadge: (badgeId: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isImpersonating, setIsImpersonating] = useState(false);

  const loadProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', supabaseUser.id)
      .maybeSingle();

    // Fetch role
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', supabaseUser.id)
      .maybeSingle();

    // Fetch badges
    const { data: badgesData } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', supabaseUser.id);

    const userBadges: Badge[] = (badgesData || []).map(b => {
      const badgeDef = ALL_BADGES.find(ab => ab.id === b.badge_id);
      return badgeDef
        ? { ...badgeDef, unlockedAt: b.unlocked_at }
        : { id: b.badge_id, name: b.badge_id, icon: 'Award', description: '', rarity: 'common' as const, unlockedAt: b.unlocked_at };
    });

    if (profile) {
      setUser({
        id: supabaseUser.id,
        username: profile.username,
        email: profile.email || supabaseUser.email || '',
        role: (roleData?.role as 'student' | 'teacher' | 'admin') || 'student',
        level: profile.level,
        xp: profile.xp,
        xpToNext: profile.xp_to_next,
        streak: profile.streak,
        badges: userBadges,
        joinedAt: profile.created_at,
        subjects: profile.subjects || [],
      });
    }
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        setTimeout(() => loadProfile(session.user), 0);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadProfile(session.user);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  }, []);

  const signup = useCallback(async (email: string, password: string, username: string, role: 'student' | 'teacher') => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, role },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) return { error: error.message };
    return {};
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsImpersonating(false);
  }, []);

  const toggleImpersonation = useCallback(() => setIsImpersonating(p => !p), []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user);
  }, [session, loadProfile]);

  const addXP = useCallback(async (amount: number, multiplier?: string) => {
    if (!user || !session) return;
    let finalXP = amount;
    if (multiplier === 'early-bird') finalXP = Math.floor(amount * 1.15);
    if (multiplier === 'clean-code') finalXP = Math.floor(amount * 1.15);
    const newXP = user.xp + finalXP;
    const newLevel = newXP >= user.xpToNext ? user.level + 1 : user.level;
    const newXPToNext = newXP >= user.xpToNext ? user.xpToNext + 500 : user.xpToNext;
    const xpAfter = newXP >= user.xpToNext ? newXP - user.xpToNext : newXP;

    await supabase
      .from('profiles')
      .update({ xp: xpAfter, level: newLevel, xp_to_next: newXPToNext })
      .eq('user_id', session.user.id);

    setUser(prev => prev ? { ...prev, xp: xpAfter, level: newLevel, xpToNext: newXPToNext } : prev);
  }, [user, session]);

  const unlockBadge = useCallback(async (badgeId: string) => {
    if (!user || !session) return;
    if (user.badges.find(b => b.id === badgeId)) return;
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    if (!badge) return;

    await supabase.from('badges').insert({ user_id: session.user.id, badge_id: badgeId });
    setUser(prev => prev ? { ...prev, badges: [...prev.badges, { ...badge, unlockedAt: new Date().toISOString() }] } : prev);
  }, [user, session]);

  return (
    <AuthContext.Provider value={{
      user, session, isImpersonating, loading,
      login, signup, logout, toggleImpersonation,
      addXP, unlockBadge, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
