import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Code2, Trophy, BookOpen, Users, BarChart3,
  Shield, LogOut, Flame, ChevronLeft, ChevronRight, Eye, Camera,
  Gamepad2, Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AppSidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const { user, logout, isImpersonating, toggleImpersonation } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const effectiveRole = isImpersonating ? 'student' : user?.role;

  const studentTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'editor', label: 'Code Editor', icon: Code2 },
    { id: 'camera', label: 'Vision Scanner', icon: Camera },
    { id: 'gamification', label: 'Achievements', icon: Trophy },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'games', label: 'Subject Games', icon: Gamepad2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
  ];

  const adminTabs = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'integrity', label: 'Integrity', icon: Shield },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'editor', label: 'Code Editor', icon: Code2 },
    { id: 'video-call', label: 'Video Call', icon: Video },
    { id: 'gamification', label: 'Achievements', icon: Trophy },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'games', label: 'Subject Games', icon: Gamepad2 },
    { id: 'leaderboard', label: 'Leaderboard', icon: BarChart3 },
  ];

  const tabs = effectiveRole === 'admin' ? adminTabs : studentTabs;

  return (
    <motion.aside
      initial={{ x: -60 }}
      animate={{ x: 0, width: collapsed ? 64 : 240 }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden shrink-0"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-primary font-mono font-bold text-sm text-glow-cyan">ASTRAEUS</span>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-muted-foreground hover:text-foreground p-1">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full gradient-cyber flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>Lv.{user.level}</span>
                <Flame className="w-3 h-3 text-neon-orange" />
                <span>{user.streak}</span>
              </div>
            </div>
          </div>
          {/* XP Bar */}
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{user.xp} XP</span>
              <span>{user.xpToNext} XP</span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full mt-0.5 overflow-hidden">
              <motion.div
                className="h-full gradient-cyber rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all',
              activeTab === tab.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            )}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{tab.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border space-y-0.5">
        {user?.role === 'admin' && (
          <button
            onClick={toggleImpersonation}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all',
              isImpersonating ? 'bg-accent/20 text-accent' : 'text-sidebar-foreground hover:bg-sidebar-accent'
            )}
          >
            <Eye className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{isImpersonating ? 'Exit Student View' : 'Student View'}</span>}
          </button>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default AppSidebar;
