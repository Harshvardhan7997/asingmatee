import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssignments, useCreateAssignment } from '@/hooks/useAssignments';
import { useAuth } from '@/contexts/AuthContext';
import { DIFFICULTY_COLORS } from '@/lib/mock-data';
import { Clock, Code2, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const AssignmentsPanel = () => {
  const { user } = useAuth();
  const { data: assignments, isLoading } = useAssignments();
  const createAssignment = useCreateAssignment();
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const now = new Date();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '', subject: 'dsa', difficulty: 'medium', description: '',
    due_date: '', language: 'python', starter_code: '', ideal_solution: '', max_score: 100,
  });

  const handleCreate = async () => {
    if (!form.title || !form.due_date) {
      toast.error('Title and due date are required');
      return;
    }
    await createAssignment.mutateAsync(form);
    setShowCreate(false);
    setForm({ title: '', subject: 'dsa', difficulty: 'medium', description: '', due_date: '', language: 'python', starter_code: '', ideal_solution: '', max_score: 100 });
  };

  if (isLoading) return <div className="p-6 text-muted-foreground">Loading assignments...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Assignments</h2>
          <p className="text-muted-foreground text-sm">
            {isTeacher ? 'Create and manage assignments.' : 'Track and submit your coding assignments.'}
          </p>
        </div>
        {isTeacher && (
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button className="bg-primary/20 text-primary border border-primary/30">
                <Plus className="w-4 h-4 mr-2" /> Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Title</Label>
                  <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="bg-secondary/50 border-border mt-1" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Subject</Label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="w-full mt-1 bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground">
                      <option value="dsa">Data Structures</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                      <option value="math">Mathematics</option>
                      <option value="web">Web Dev</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Difficulty</Label>
                    <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value }))} className="w-full mt-1 bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground">
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs uppercase text-muted-foreground">Language</Label>
                    <select value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} className="w-full mt-1 bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground">
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Due Date</Label>
                  <Input type="datetime-local" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} className="bg-secondary/50 border-border mt-1" />
                </div>
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Description</Label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full mt-1 bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground min-h-[80px]" />
                </div>
                <div>
                  <Label className="text-xs uppercase text-muted-foreground">Starter Code</Label>
                  <textarea value={form.starter_code} onChange={e => setForm(f => ({ ...f, starter_code: e.target.value }))} className="w-full mt-1 bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm font-mono text-foreground min-h-[60px]" />
                </div>
                <Button onClick={handleCreate} disabled={createAssignment.isPending} className="w-full bg-primary text-primary-foreground">
                  {createAssignment.isPending ? 'Creating...' : 'Create Assignment'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {(!assignments || assignments.length === 0) ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No assignments yet.</p>
          {isTeacher && <p className="text-sm mt-1">Create your first assignment above!</p>}
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map(a => {
            const due = new Date(a.due_date);
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
                    <h3 className="font-semibold flex items-center gap-2">{a.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                      <span className={`font-medium capitalize ${DIFFICULTY_COLORS[a.difficulty] || 'text-muted-foreground'}`}>{a.difficulty}</span>
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
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{a.max_score} pts</span>
                    {!isTeacher && (
                      <Button
                        size="sm"
                        disabled={isOverdue}
                        onClick={() => toast.info('Opening editor...')}
                        className={isOverdue ? 'opacity-50' : 'bg-primary/20 text-primary border border-primary/30'}
                      >
                        {isOverdue ? 'Locked' : 'Start'}
                      </Button>
                    )}
                  </div>
                </div>
                {isOverdue && !isTeacher && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-neon-red bg-neon-red/5 rounded p-2">
                    <AlertCircle className="w-3 h-3" /> Deadline passed. Submission locked.
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default AssignmentsPanel;
