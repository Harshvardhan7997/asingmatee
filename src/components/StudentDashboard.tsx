import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAssignments } from '@/hooks/useAssignments';
import { Flame, Trophy, BookOpen, Code2, TrendingUp, Clock, Zap } from 'lucide-react';
import { SUBJECTS } from '@/lib/mock-data';
import { format } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1 } };

const StudentDashboard = () => {
  const { user } = useAuth();
  const { data: assignments } = useAssignments();
  if (!user) return null;

  const stats = [
    { label: 'Level', value: user.level, icon: TrendingUp, color: 'text-primary' },
    { label: 'XP', value: user.xp.toLocaleString(), icon: Zap, color: 'text-neon-yellow' },
    { label: 'Streak', value: `${user.streak} days`, icon: Flame, color: 'text-neon-orange' },
    { label: 'Badges', value: user.badges.length, icon: Trophy, color: 'text-neon-purple' },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 p-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold">Welcome back, <span className="text-primary text-glow-cyan">{user.username}</span></h1>
        <p className="text-muted-foreground text-sm">Your neural learning journey continues.</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 cyber-border">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="bg-card border border-border rounded-lg p-4 cyber-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Level {user.level} → Level {user.level + 1}</span>
          <span className="text-xs text-muted-foreground">{user.xp}/{user.xpToNext} XP</span>
        </div>
        <div className="h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-cyber rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(user.xp / user.xpToNext) * 100}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-neon-yellow" /> +15% Early Bird bonus</span>
          <span className="flex items-center gap-1"><Code2 className="w-3 h-3 text-neon-green" /> +15% Clean Code bonus</span>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="text-lg font-semibold mb-3">Your Subjects</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SUBJECTS.map(sub => (
            <div key={sub.id} className="bg-card border border-border rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer cyber-border">
              <div className="text-lg mb-1"><BookOpen className="w-5 h-5" /></div>
              <p className="font-medium text-sm">{sub.name}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item}>
        <h2 className="text-lg font-semibold mb-3">Upcoming Assignments</h2>
        {(!assignments || assignments.length === 0) ? (
          <p className="text-muted-foreground text-sm">No assignments yet.</p>
        ) : (
          <div className="space-y-2">
            {assignments.slice(0, 5).map(a => (
              <div key={a.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between cyber-border">
                <div>
                  <p className="font-medium text-sm">{a.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="capitalize">{a.subject}</span>
                    <span className="capitalize font-medium">{a.difficulty}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {format(new Date(a.due_date), 'MMM dd, HH:mm')}</span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{a.language}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default StudentDashboard;
