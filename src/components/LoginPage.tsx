import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, User, Eye, EyeOff, Lock } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login } = useAuth();
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    const success = login(username, password, role, adminKey);
    if (!success) {
      toast.error('Invalid admin security key');
      return;
    }
    toast.success(`Welcome, ${username}!`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background grid */}
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
        {/* Logo */}
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

        {/* Portal toggle */}
        <div className="flex gap-2 mb-6">
          {(['student', 'admin'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-3 rounded-lg border font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                role === r
                  ? 'border-primary bg-primary/10 text-primary glow-cyan'
                  : 'border-border bg-secondary/50 text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              {r === 'student' ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              {r === 'student' ? 'Student Portal' : 'Admin Portal'}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-muted-foreground text-xs uppercase tracking-wider">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Enter username"
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

          {role === 'admin' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <Label htmlFor="adminKey" className="text-muted-foreground text-xs uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3" /> Admin Security Key
              </Label>
              <Input
                id="adminKey"
                type="password"
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                placeholder="Enter security key"
                className="bg-secondary/50 border-border focus:border-primary mt-1"
              />
            </motion.div>
          )}

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-cyan">
            {role === 'admin' ? 'Access Command Center' : 'Enter Platform'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {role === 'admin' ? 'Mock key: admin123' : 'Enter any username/password to login'}
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
