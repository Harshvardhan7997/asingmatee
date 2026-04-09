import { useState } from 'react';
import { motion } from 'framer-motion';
import { MOCK_STUDENTS } from '@/lib/mock-data';
import {
  AlertTriangle, Users, TrendingUp, TrendingDown, Activity, Shield,
  Clock, BarChart3, Globe, Lock, Video, Eye
} from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const momentumData = [
  { day: 'Mon', focusTime: 35, successRate: 72 },
  { day: 'Tue', focusTime: 42, successRate: 78 },
  { day: 'Wed', focusTime: 38, successRate: 68 },
  { day: 'Thu', focusTime: 50, successRate: 85 },
  { day: 'Fri', focusTime: 45, successRate: 80 },
  { day: 'Sat', focusTime: 28, successRate: 65 },
  { day: 'Sun', focusTime: 32, successRate: 70 },
];

const LANGUAGES_LIST = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Korean', 'Chinese', 'Arabic', 'Hindi', 'Portuguese', 'Russian', 'Italian'];

const AdminDashboard = () => {
  const [selectedLang, setSelectedLang] = useState('English');
  const atRisk = MOCK_STUDENTS.filter(s => s.riskLevel === 'high');
  const avgScore = Math.round(MOCK_STUDENTS.reduce((a, s) => a + s.avgScore, 0) / MOCK_STUDENTS.length);

  const radarData = [
    { skill: 'Logic', value: 78 },
    { skill: 'Syntax', value: 85 },
    { skill: 'Clarity', value: 70 },
    { skill: 'Problem Solving', value: 82 },
    { skill: 'Knowledge', value: 75 },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="p-6 space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold">Admin <span className="text-primary text-glow-cyan">Command Center</span></h1>
        <p className="text-muted-foreground text-sm">System-wide analytics and student intelligence.</p>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: MOCK_STUDENTS.length, icon: Users, color: 'text-primary' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-neon-green' },
          { label: 'At Risk', value: atRisk.length, icon: AlertTriangle, color: 'text-neon-red' },
          { label: 'Active Today', value: MOCK_STUDENTS.filter(s => s.lastActive.includes('h') || s.lastActive.includes('m')).length, icon: Activity, color: 'text-neon-cyan' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 cyber-border">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* At Risk Radar */}
      <motion.div variants={item} className="bg-card border border-border rounded-lg p-4 cyber-border">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-neon-red" /> Predictive At-Risk Radar
        </h3>
        <div className="space-y-3">
          {MOCK_STUDENTS.map(student => (
            <div key={student.id} className={`flex items-center gap-4 p-3 rounded-lg border ${
              student.riskLevel === 'high' ? 'border-neon-red/30 bg-neon-red/5' :
              student.riskLevel === 'medium' ? 'border-neon-yellow/30 bg-neon-yellow/5' :
              'border-border'
            }`}>
              <div className="w-8 h-8 rounded-full gradient-cyber flex items-center justify-center text-xs font-bold text-primary-foreground">
                {student.username.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{student.username}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Lv.{student.level}</span>
                  <span>Avg: {student.avgScore}%</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{student.lastActive}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{student.compilerErrors} errors</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  student.riskLevel === 'high' ? 'bg-neon-red/20 text-neon-red' :
                  student.riskLevel === 'medium' ? 'bg-neon-yellow/20 text-neon-yellow' :
                  'bg-neon-green/20 text-neon-green'
                }`}>
                  {student.riskLevel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Class Radar */}
        <motion.div variants={item} className="bg-card border border-border rounded-lg p-4 cyber-border">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-neon-purple" /> Class Performance Radar
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(220 15% 20%)" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(215 15% 50%)', fontSize: 11 }} />
              <Radar dataKey="value" stroke="hsl(173 80% 40%)" fill="hsl(173 80% 40%)" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Class Momentum */}
        <motion.div variants={item} className="bg-card border border-border rounded-lg p-4 cyber-border">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-neon-cyan" /> Class Momentum
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={momentumData}>
              <XAxis dataKey="day" tick={{ fill: 'hsl(215 15% 50%)', fontSize: 11 }} stroke="hsl(220 15% 20%)" />
              <YAxis tick={{ fill: 'hsl(215 15% 50%)', fontSize: 11 }} stroke="hsl(220 15% 20%)" />
              <Tooltip contentStyle={{ background: 'hsl(220 18% 7%)', border: '1px solid hsl(220 15% 15%)', borderRadius: '8px', color: 'hsl(210 40% 92%)' }} />
              <Area type="monotone" dataKey="focusTime" stroke="hsl(173 80% 40%)" fill="hsl(173 80% 40% / 0.1)" name="Focus Time (min)" />
              <Area type="monotone" dataKey="successRate" stroke="hsl(265 80% 60%)" fill="hsl(265 80% 60% / 0.1)" name="Success Rate (%)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Integrity */}
      <motion.div variants={item} className="bg-card border border-border rounded-lg p-4 cyber-border">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-neon-orange" /> Integrity System
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Plagiarism Flags', value: 2, desc: 'AI-detected similarities', color: 'text-neon-red' },
            { label: 'Voice Consistency', value: '94%', desc: 'Authorial style match', color: 'text-neon-green' },
            { label: 'Style Anomalies', value: 1, desc: 'Code style deviations', color: 'text-neon-yellow' },
          ].map(s => (
            <div key={s.label} className="text-center p-3">
              <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
              <p className="text-xs font-medium mt-1">{s.label}</p>
              <p className="text-[10px] text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Multilingual Toggle */}
      <motion.div variants={item} className="bg-card border border-border rounded-lg p-4 cyber-border">
        <h3 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-neon-blue" /> Multilingual Feedback
        </h3>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES_LIST.map(lang => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                selectedLang === lang ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Privacy Shield */}
      <motion.div variants={item} className="flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
        <Lock className="w-3 h-3 text-neon-green" />
        <span>All data encrypted in Cloud backend • End-to-end security enabled</span>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
