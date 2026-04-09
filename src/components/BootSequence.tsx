import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: '> INITIALIZING NEURAL CORES...', delay: 400 },
  { text: '[OK]', delay: 800, isStatus: true },
  { text: '> SYNCING CLOUD EDGE NETWORK...', delay: 1200 },
  { text: '[OK]', delay: 1600, isStatus: true },
  { text: '> BOOTING COMPILER KERNEL...', delay: 2000 },
  { text: '[OK]', delay: 2400, isStatus: true },
  { text: '> LOADING GAMIFICATION ENGINE...', delay: 2800 },
  { text: '[OK]', delay: 3200, isStatus: true },
  { text: '> ASTRAEUS READY', delay: 3600, isFinal: true },
];

const STAR_COUNT = 80;

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<'stars' | 'boot' | 'done'>('stars');

  useEffect(() => {
    const starTimer = setTimeout(() => setPhase('boot'), 1500);
    return () => clearTimeout(starTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'boot') return;
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    );
    const doneTimer = setTimeout(() => {
      setPhase('done');
      setTimeout(onComplete, 800);
    }, 4200);
    return () => { timers.forEach(clearTimeout); clearTimeout(doneTimer); };
  }, [phase, onComplete]);

  const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2,
  }));

  // Constellation lines
  const constellationPoints = [
    [20, 30], [35, 20], [50, 35], [45, 55], [30, 50], [20, 30],
    [60, 25], [75, 15], [80, 35], [70, 45], [60, 25],
  ];

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Stars */}
          <svg className="absolute inset-0 w-full h-full">
            {stars.map(star => (
              <motion.circle
                key={star.id}
                cx={`${star.x}%`}
                cy={`${star.y}%`}
                r={star.size}
                fill="hsl(173 80% 40%)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0.5, 1], scale: 1 }}
                transition={{ duration: 1, delay: star.delay * 0.5, repeat: Infinity, repeatType: 'reverse', repeatDelay: 2 + Math.random() * 3 }}
              />
            ))}
            {/* Constellation lines */}
            <motion.polyline
              points={constellationPoints.map(p => `${p[0]}%,${p[1]}%`).join(' ')}
              fill="none"
              stroke="hsl(173 80% 40% / 0.3)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </svg>

          {/* Boot text */}
          {phase === 'boot' && (
            <div className="relative z-10 font-mono text-sm space-y-1 max-w-md">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-primary text-glow-cyan text-lg mb-4 font-bold"
              >
                ASTRAEUS v2.0
              </motion.div>
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={
                    line.isFinal ? 'text-primary text-glow-cyan font-bold mt-2' :
                    line.isStatus ? 'text-neon-green ml-4' : 'text-muted-foreground'
                  }
                >
                  {line.text}
                </motion.div>
              ))}
              <motion.span className="inline-block w-2 h-4 bg-primary animate-blink" />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSequence;
