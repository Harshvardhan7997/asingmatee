import { useState } from 'react';
import { motion } from 'framer-motion';
import { SUBJECTS, MOCK_ASSIGNMENTS, DIFFICULTY_COLORS } from '@/lib/mock-data';
import { BookOpen, Calculator, GitBranch, Code2, Terminal, Coffee, Globe, Clock, Filter } from 'lucide-react';
import { format } from 'date-fns';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Calculator, GitBranch, Code2, Terminal, Coffee, Globe,
};

const SubjectsPanel = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredAssignments = MOCK_ASSIGNMENTS.filter(a => {
    if (selectedSubject && a.subject !== selectedSubject) return false;
    if (difficultyFilter !== 'all' && a.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Subject Sections
        </h2>
        <p className="text-muted-foreground text-sm">Browse assignments by subject and difficulty.</p>
      </div>

      {/* Subject cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {SUBJECTS.map(sub => {
          const Icon = ICON_MAP[sub.icon] || BookOpen;
          const isSelected = selectedSubject === sub.id;
          return (
            <motion.button
              key={sub.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedSubject(isSelected ? null : sub.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                isSelected ? 'border-primary bg-primary/10 glow-cyan' : 'border-border bg-card hover:border-primary/30 cyber-border'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 text-${sub.color}`} />
              <p className="font-medium text-sm">{sub.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {MOCK_ASSIGNMENTS.filter(a => a.subject === sub.id).length} assignments
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Difficulty filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {['all', 'easy', 'medium', 'hard', 'expert'].map(d => (
          <button
            key={d}
            onClick={() => setDifficultyFilter(d)}
            className={`px-3 py-1 rounded-full text-xs capitalize transition-all ${
              difficultyFilter === d ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground border border-border'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Filtered assignments */}
      <div className="space-y-2">
        {filteredAssignments.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No assignments found for this filter.</p>
        ) : (
          filteredAssignments.map(a => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between cyber-border"
            >
              <div>
                <p className="font-medium text-sm">{a.title}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="capitalize">{SUBJECTS.find(s => s.id === a.subject)?.name}</span>
                  <span className={`capitalize font-medium ${DIFFICULTY_COLORS[a.difficulty]}`}>{a.difficulty}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{format(new Date(a.dueDate), 'MMM dd')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">{a.language}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{a.maxScore} pts</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default SubjectsPanel;
