import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import BootSequence from '@/components/BootSequence';
import LoginPage from '@/components/LoginPage';
import AppSidebar from '@/components/AppSidebar';
import StudentDashboard from '@/components/StudentDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import CodeEditor from '@/components/CodeEditor';
import GamificationPanel from '@/components/GamificationPanel';
import AssignmentsPanel from '@/components/AssignmentsPanel';
import VisionScanner from '@/components/VisionScanner';
import SubjectsPanel from '@/components/SubjectsPanel';
import SubjectGames from '@/components/SubjectGames';
import VideoCall from '@/components/VideoCall';

const AppContent = () => {
  const { user, loading, isImpersonating } = useAuth();
  const [booted, setBooted] = useState(() => !!localStorage.getItem('astraeus_booted'));
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleBootComplete = useCallback(() => {
    setBooted(true);
    localStorage.setItem('astraeus_booted', '1');
  }, []);

  if (!booted) return <BootSequence onComplete={handleBootComplete} />;
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-primary font-mono animate-pulse">Loading...</div>
    </div>
  );
  if (!user) return <LoginPage />;

  const effectiveRole = isImpersonating ? 'student' : user.role;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return effectiveRole === 'admin' || effectiveRole === 'teacher' ? <AdminDashboard /> : <StudentDashboard />;
      case 'editor':
        return <CodeEditor />;
      case 'gamification':
        return <GamificationPanel />;
      case 'assignments':
        return <AssignmentsPanel />;
      case 'camera':
        return <VisionScanner />;
      case 'subjects':
        return <SubjectsPanel />;
      case 'games':
        return <SubjectGames />;
      case 'students':
        return <AdminDashboard />;
      case 'analytics':
        return <AdminDashboard />;
      case 'integrity':
        return <AdminDashboard />;
      case 'video-call':
        return <VideoCall />;
      case 'leaderboard':
        return <GamificationPanel />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-auto scanline">
        <AnimatePresence mode="wait">
          <div key={activeTab} className="h-full">
            {renderContent()}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const Index = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default Index;
