import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { ALL_BADGES, LEADERBOARD, SKILL_TREE_NODES } from '@/lib/mock-data';
import { Trophy, Star, Lock, Crown, Medal, Award } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

const RARITY_COLORS = {
  common: 'border-muted-foreground/30 bg-muted/20',
  rare: 'border-neon-blue/40 bg-neon-blue/10 glow-cyan',
  epic: 'border-neon-purple/40 bg-neon-purple/10 glow-purple',
  legendary: 'border-neon-yellow/40 bg-neon-yellow/10 glow-orange',
};

const GamificationPanel = () => {
  const { user } = useAuth();
  if (!user) return null;

  const unlockedIds = new Set(user.badges.map(b => b.id));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-8">
      {/* Badges */}
      <motion.div variants={item}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-yellow" /> Badges & Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ALL_BADGES.map(badge => {
            const isUnlocked = unlockedIds.has(badge.id);
            const IconComponent = (LucideIcons as unknown as Record<string, React.FC<{ className?: string }>>)[badge.icon] || Star;
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className={`relative p-4 rounded-lg border text-center transition-all ${
                  isUnlocked ? RARITY_COLORS[badge.rarity] : 'border-border bg-card opacity-50'
                }`}
              >
                {!isUnlocked && <Lock className="absolute top-2 right-2 w-3 h-3 text-muted-foreground" />}
                <div className={`mx-auto mb-2 w-10 h-10 rounded-full flex items-center justify-center ${
                  isUnlocked ? 'gradient-cyber' : 'bg-secondary'
                }`}>
                  <IconComponent className={`w-5 h-5 ${isUnlocked ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <p className="text-sm font-medium">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                <span className={`text-[10px] uppercase tracking-wider mt-2 inline-block px-2 py-0.5 rounded-full ${
                  badge.rarity === 'legendary' ? 'bg-neon-yellow/20 text-neon-yellow' :
                  badge.rarity === 'epic' ? 'bg-neon-purple/20 text-neon-purple' :
                  badge.rarity === 'rare' ? 'bg-neon-blue/20 text-neon-blue' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {badge.rarity}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Skill Tree */}
      <motion.div variants={item}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-neon-cyan" /> Cognitive Skill Tree
        </h2>
        <div className="bg-card border border-border rounded-lg p-6 cyber-border relative overflow-hidden">
          <svg width="100%" height="320" viewBox="0 0 400 380" className="mx-auto">
            {/* Connection lines */}
            {SKILL_TREE_NODES.map(node =>
              node.children.map(childId => {
                const child = SKILL_TREE_NODES.find(n => n.id === childId);
                if (!child) return null;
                return (
                  <motion.line
                    key={`${node.id}-${childId}`}
                    x1={node.x} y1={node.y + 20} x2={child.x} y2={child.y}
                    stroke={node.unlocked && child.unlocked ? 'hsl(173 80% 40%)' : 'hsl(220 15% 20%)'}
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1 }}
                  />
                );
              })
            )}
            {/* Nodes */}
            {SKILL_TREE_NODES.map(node => (
              <g key={node.id}>
                <motion.circle
                  cx={node.x} cy={node.y} r="22"
                  fill={node.unlocked ? 'hsl(173 80% 40% / 0.2)' : 'hsl(220 18% 12%)'}
                  stroke={node.unlocked ? 'hsl(173 80% 40%)' : 'hsl(220 15% 20%)'}
                  strokeWidth="2"
                  whileHover={{ scale: 1.2 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                />
                {node.unlocked ? (
                  <Star x={node.x - 8} y={node.y - 8} width={16} height={16} className="text-primary fill-primary" />
                ) : (
                  <Lock x={node.x - 6} y={node.y - 6} width={12} height={12} className="text-muted-foreground" />
                )}
                <text x={node.x} y={node.y + 40} textAnchor="middle" className="text-[10px] fill-muted-foreground">
                  {node.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </motion.div>

      {/* Ghost Leaderboard */}
      <motion.div variants={item}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-neon-yellow" /> Ghost Leaderboard
        </h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden cyber-border">
          {LEADERBOARD.map((student, i) => (
            <div key={student.id} className={`flex items-center gap-4 p-3 border-b border-border last:border-0 ${
              student.id === 'student-1' ? 'bg-primary/5' : ''
            }`}>
              <span className={`w-8 text-center font-mono font-bold ${
                i === 0 ? 'text-neon-yellow' : i === 1 ? 'text-muted-foreground' : i === 2 ? 'text-neon-orange' : 'text-muted-foreground'
              }`}>
                {i === 0 ? <Crown className="w-4 h-4 mx-auto" /> : i === 1 ? <Medal className="w-4 h-4 mx-auto" /> : `#${i + 1}`}
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{student.username}</p>
                <p className="text-xs text-muted-foreground">Lv.{student.level} • {student.submissions} submissions</p>
              </div>
              <span className="font-mono text-sm text-primary">{student.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GamificationPanel;
