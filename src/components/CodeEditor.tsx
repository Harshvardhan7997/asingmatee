import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_ASSIGNMENTS, LANGUAGES, MOCK_COMPILER_OUTPUTS } from '@/lib/mock-data';
import { Play, Bug, Lightbulb, Copy, RotateCcw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CodeEditor = () => {
  const { addXP, unlockBadge } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState(MOCK_ASSIGNMENTS[0]);
  const [code, setCode] = useState(selectedAssignment.starterCode);
  const [language, setLanguage] = useState(selectedAssignment.language);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showAIHint, setShowAIHint] = useState(false);
  const [showIdeal, setShowIdeal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleRun = () => {
    setIsRunning(true);
    setShowAIHint(false);
    setTimeout(() => {
      const hasError = code.includes('pass') || code.includes('nullptr') || code.includes('return null');
      if (hasError) {
        const errorKey = language === 'python' ? 'error_python' : language === 'cpp' ? 'error_cpp' : 'error_java';
        setOutput(MOCK_COMPILER_OUTPUTS[errorKey]);
        setShowAIHint(true);
      } else {
        setOutput(MOCK_COMPILER_OUTPUTS.success);
        addXP(50, 'clean-code');
        unlockBadge('architect');
        toast.success('+50 XP earned! 🎉');
      }
      setIsRunning(false);
    }, 1500);
  };

  const handleAssignmentChange = (a: typeof MOCK_ASSIGNMENTS[0]) => {
    setSelectedAssignment(a);
    setCode(a.starterCode);
    setLanguage(a.language);
    setOutput('');
    setShowAIHint(false);
    setShowIdeal(false);
  };

  const lineNumbers = code.split('\n').map((_, i) => i + 1);

  const aiFixSuggestion = language === 'python'
    ? 'The `pass` statement is a placeholder. Replace it with your binary search logic using while loop with left/right pointers.'
    : language === 'cpp'
    ? 'You\'re returning nullptr without implementing the reversal. Use three pointers: prev, curr, next to reverse the links.'
    : 'Return null needs to be replaced with actual matrix multiplication logic using three nested loops.';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
        {/* Assignment selector */}
        <div className="relative">
          <select
            value={selectedAssignment.id}
            onChange={e => { const a = MOCK_ASSIGNMENTS.find(x => x.id === e.target.value); if (a) handleAssignmentChange(a); }}
            className="bg-secondary border border-border rounded px-3 py-1.5 text-sm text-foreground appearance-none pr-8 focus:outline-none focus:border-primary"
          >
            {MOCK_ASSIGNMENTS.map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Language */}
        <div className="flex items-center gap-1 bg-secondary rounded px-2 py-1 border border-border">
          {LANGUAGES.map(l => (
            <button
              key={l.id}
              onClick={() => setLanguage(l.id as typeof language)}
              className={`px-2 py-0.5 rounded text-xs transition-all ${language === l.id ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {l.icon} {l.name}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <Button variant="ghost" size="sm" onClick={() => { setCode(selectedAssignment.starterCode); setOutput(''); }} className="text-muted-foreground">
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
        <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(code); toast.success('Copied!'); }} className="text-muted-foreground">
          <Copy className="w-4 h-4 mr-1" /> Copy
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowIdeal(!showIdeal)} className="text-neon-purple">
          <Lightbulb className="w-4 h-4 mr-1" /> {showIdeal ? 'Hide' : 'Show'} Solution
        </Button>
        <Button onClick={handleRun} disabled={isRunning} size="sm" className="bg-neon-green/20 text-neon-green hover:bg-neon-green/30 border border-neon-green/30">
          <Play className="w-4 h-4 mr-1" /> {isRunning ? 'Running...' : 'Run Code'}
        </Button>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex overflow-auto bg-card">
            {/* Line numbers */}
            <div className="py-3 px-2 text-right select-none border-r border-border bg-secondary/30 min-w-[3rem]">
              {lineNumbers.map(n => (
                <div key={n} className="text-xs text-muted-foreground font-mono leading-6">{n}</div>
              ))}
            </div>
            {/* Code */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-3 bg-transparent text-foreground font-mono text-sm leading-6 resize-none focus:outline-none"
              style={{ tabSize: 4 }}
            />
          </div>

          {/* Console output */}
          <div className="h-48 border-t border-border bg-secondary/30 flex flex-col">
            <div className="px-3 py-1.5 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
              <span className="uppercase tracking-wider font-medium">Console</span>
              {isRunning && <span className="text-neon-cyan animate-glow-pulse">● Running</span>}
            </div>
            <pre className="flex-1 p-3 text-xs font-mono overflow-auto whitespace-pre-wrap">
              {output || <span className="text-muted-foreground">Click "Run Code" to execute...</span>}
            </pre>
          </div>
        </div>

        {/* Side panels */}
        {(showAIHint || showIdeal) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            className="border-l border-border bg-card overflow-auto"
          >
            {showAIHint && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2 text-neon-orange mb-2">
                  <Bug className="w-4 h-4" />
                  <span className="text-sm font-medium">AI Debugger</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{aiFixSuggestion}</p>
                <Button size="sm" variant="outline" className="text-xs border-neon-orange/30 text-neon-orange hover:bg-neon-orange/10">
                  Apply Fix Suggestion
                </Button>
              </div>
            )}
            {showIdeal && (
              <div className="p-4">
                <div className="flex items-center gap-2 text-neon-purple mb-2">
                  <Lightbulb className="w-4 h-4" />
                  <span className="text-sm font-medium">Ideal Solution</span>
                </div>
                <pre className="text-xs font-mono text-muted-foreground bg-secondary/50 rounded p-3 overflow-auto">
                  {selectedAssignment.idealSolution}
                </pre>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CodeEditor;
