import { motion } from 'framer-motion';
import { MOCK_ASSIGNMENTS, DIFFICULTY_COLORS } from '@/lib/mock-data';
import { Clock, Code2, CheckCircle, AlertCircle } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AssignmentsPanel = () => {
  const now = new Date();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold">Assignments</h2>
        <p className="text-muted-foreground text-sm">Track and submit your coding assignments.</p>
      </div>

      <div className="space-y-3">
        {MOCK_ASSIGNMENTS.map(a => {
          const due = new Date(a.dueDate);
          const isOverdue = isPast(due);
          const hoursLeft = Math.max(0, Math.floor((due.getTime() - now.getTime()) / 3600000));

          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card border rounded-lg p-5 cyber-border ${isOverdue ? 'border-neon-red/30' : 'border-border'}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {a.title}
                    {a.status === 'graded' && <CheckCircle className="w-4 h-4 text-neon-green" />}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className={`font-medium capitalize ${DIFFICULTY_COLORS[a.difficulty]}`}>{a.difficulty}</span>
                    <span className="flex items-center gap-1"><Code2 className="w-3 h-3" />{a.language}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {isOverdue ? (
                        <span className="text-neon-red">Overdue</span>
                      ) : hoursLeft < 24 ? (
                        <span className="text-neon-orange">{hoursLeft}h left</span>
                      ) : (
                        format(due, 'MMM dd, HH:mm')
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{a.maxScore} pts</span>
                  <Button
                    size="sm"
                    disabled={isOverdue}
                    onClick={() => toast.info('Opening editor...')}
                    className={isOverdue ? 'opacity-50' : 'bg-primary/20 text-primary border border-primary/30'}
                  >
                    {isOverdue ? 'Locked' : 'Start'}
                  </Button>
                </div>
              </div>
              {isOverdue && (
                <div className="mt-3 flex items-center gap-2 text-xs text-neon-red bg-neon-red/5 rounded p-2">
                  <AlertCircle className="w-3 h-3" /> Deadline passed. Submission locked.
                </div>
              )}
              {!isOverdue && hoursLeft < 1 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-neon-orange bg-neon-orange/5 rounded p-2">
                  <AlertCircle className="w-3 h-3" /> Less than 1 hour remaining!
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AssignmentsPanel;
