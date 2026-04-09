import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Brain, Code2, Calculator, Trophy, Timer, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Question {
  question: string;
  options: string[];
  correct: number;
  subject: string;
  difficulty: string;
}

const QUIZ_QUESTIONS: Question[] = [
  { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1, subject: 'DSA', difficulty: 'easy' },
  { question: 'What does "def" keyword define in Python?', options: ['Variable', 'Function', 'Class', 'Module'], correct: 1, subject: 'Python', difficulty: 'easy' },
  { question: 'Which data structure uses LIFO?', options: ['Queue', 'Stack', 'Array', 'Tree'], correct: 1, subject: 'DSA', difficulty: 'easy' },
  { question: 'What is 2^10?', options: ['512', '1024', '2048', '256'], correct: 1, subject: 'Math', difficulty: 'easy' },
  { question: 'What is a pointer in C++?', options: ['A variable', 'An address holder', 'A function', 'A class'], correct: 1, subject: 'C++', difficulty: 'medium' },
  { question: 'What is the derivative of x²?', options: ['x', '2x', '2', 'x³'], correct: 1, subject: 'Math', difficulty: 'medium' },
  { question: 'Which sorting algorithm is O(n log n) average?', options: ['Bubble Sort', 'Merge Sort', 'Insertion Sort', 'Selection Sort'], correct: 1, subject: 'DSA', difficulty: 'medium' },
  { question: 'What is polymorphism in Java?', options: ['Multiple inheritance', 'One interface, many forms', 'Encapsulation', 'Abstraction'], correct: 1, subject: 'Java', difficulty: 'hard' },
];

const SubjectGames = () => {
  const { addXP } = useAuth();
  const [gameMode, setGameMode] = useState<'menu' | 'quiz' | 'speed' | 'results'>('menu');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [timeLeft, setTimeLeft] = useState(30);

  const filteredQuestions = selectedSubject === 'all'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter(q => q.subject === selectedSubject);

  const startGame = (mode: 'quiz' | 'speed') => {
    setGameMode(mode);
    setCurrentQ(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(30);
  };

  const handleAnswer = (idx: number) => {
    const isCorrect = idx === filteredQuestions[currentQ].correct;
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (isCorrect) setScore(s => s + 1);

    if (currentQ + 1 >= filteredQuestions.length) {
      setGameMode('results');
      const xpEarned = (score + (isCorrect ? 1 : 0)) * 25;
      addXP(xpEarned);
      toast.success(`+${xpEarned} XP earned!`);
    } else {
      setCurrentQ(q => q + 1);
    }
  };

  const subjects = ['all', 'DSA', 'Python', 'C++', 'Math', 'Java'];

  if (gameMode === 'menu') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-neon-purple" /> Subject Games
          </h2>
          <p className="text-muted-foreground text-sm">Test your knowledge with fun challenges.</p>
        </div>

        {/* Subject filter */}
        <div className="flex flex-wrap gap-2">
          {subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                selectedSubject === s ? 'bg-primary/20 text-primary border border-primary/30 glow-cyan' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'all' ? '🎯 All Subjects' : s}
            </button>
          ))}
        </div>

        {/* Game modes */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startGame('quiz')}
            className="bg-card border border-border rounded-lg p-6 text-left cyber-border hover:border-primary/30 transition-all"
          >
            <Brain className="w-8 h-8 text-neon-cyan mb-3" />
            <h3 className="font-bold mb-1">Knowledge Quiz</h3>
            <p className="text-sm text-muted-foreground">Answer questions at your own pace. +25 XP per correct answer.</p>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startGame('speed')}
            className="bg-card border border-border rounded-lg p-6 text-left cyber-border hover:border-primary/30 transition-all"
          >
            <Timer className="w-8 h-8 text-neon-orange mb-3" />
            <h3 className="font-bold mb-1">Speed Challenge</h3>
            <p className="text-sm text-muted-foreground">Race against time! 30 seconds per question.</p>
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (gameMode === 'results') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-neon-yellow mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">{score}/{filteredQuestions.length}</h2>
          <p className="text-muted-foreground mb-6">
            {score === filteredQuestions.length ? 'Perfect score! 🎉' :
             score >= filteredQuestions.length * 0.7 ? 'Great job! 💪' : 'Keep practicing! 📚'}
          </p>
          <Button onClick={() => setGameMode('menu')} className="bg-primary/20 text-primary border border-primary/30">
            Back to Games
          </Button>
        </div>
      </motion.div>
    );
  }

  const q = filteredQuestions[currentQ];
  if (!q) { setGameMode('menu'); return null; }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-muted-foreground">Question {currentQ + 1}/{filteredQuestions.length}</span>
        <span className="text-sm font-mono text-primary">{score} correct</span>
      </div>
      <div className="h-1 bg-secondary rounded-full mb-8">
        <div className="h-full gradient-cyber rounded-full transition-all" style={{ width: `${((currentQ) / filteredQuestions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-0.5 rounded bg-secondary">{q.subject}</span>
          <span className={`px-2 py-0.5 rounded ${q.difficulty === 'easy' ? 'bg-neon-green/20 text-neon-green' : q.difficulty === 'medium' ? 'bg-neon-yellow/20 text-neon-yellow' : 'bg-neon-red/20 text-neon-red'}`}>
            {q.difficulty}
          </span>
        </div>
        <h3 className="text-lg font-semibold">{q.question}</h3>
        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleAnswer(i)}
              className="p-4 rounded-lg border border-border bg-card text-left text-sm hover:border-primary/40 transition-all cyber-border"
            >
              <span className="font-mono text-muted-foreground mr-3">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SubjectGames;
