import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, BookOpenCheck, Eye, EyeOff, Lock, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (mode === 'signup' && !username) {
      toast.error('Please enter a username');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const { error } = await login(email, password);
        if (error) {
          toast.error(error);
        } else {
          toast.success('Welcome back!');
        }
      } else {
        const { error } = await signup(email, password, username, role);
        if (error) {
          toast.error(error);
        } else {
          toast.success('Account created! Check your email to confirm, or log in directly.');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(hsl(173 80% 40% / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(173 80% 40% / 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-4xl font-bold text-primary text-glow-cyan font-mono"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ASTRAEUS
          </motion.div>
          <p className="text-muted-foreground text-sm mt-2">Neural Learning Platform</p>
        </div>

        {/* Login/Signup toggle */}
        <div className="flex gap-2 mb-4">
          {(['login', 'signup'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-lg border font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                mode === m
                  ? 'border-primary bg-primary/10 text-primary glow-cyan'
                  : 'border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              {m === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {m === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Role toggle (signup only) */}
        {mode === 'signup' && (
          <div className="flex gap-2 mb-4">
            {(['student', 'teacher'] as const).map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg border font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                  role === r
                    ? 'border-primary bg-primary/10 text-primary glow-cyan'
                    : 'border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground'
                }`}
              >
                {r === 'student' ? <GraduationCap className="w-4 h-4" /> : <BookOpenCheck className="w-4 h-4" />}
                {r === 'student' ? 'Student' : 'Teacher'}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <Label htmlFor="username" className="text-muted-foreground text-xs uppercase tracking-wider">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Choose a username"
                className="bg-secondary/50 border-border focus:border-primary mt-1"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-muted-foreground text-xs uppercase tracking-wider">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-secondary/50 border-border focus:border-primary mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-muted-foreground text-xs uppercase tracking-wider">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-secondary/50 border-border focus:border-primary pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
            {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-primary hover:underline">
            {mode === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
