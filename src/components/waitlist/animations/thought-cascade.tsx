'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const THOUGHTS = [
  "analyzing data...",
  "writing code...",
  "searching the web...",
  "creating images...",
  "sending emails...",
  "building presentations...",
  "automating tasks...",
  "learning patterns...",
  "connecting tools...",
  "solving problems...",
];

export function ThoughtCascade() {
  const [activeThoughts, setActiveThoughts] = useState<{ id: number; text: string; x: number }[]>([]);

  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      const text = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
      const x = 20 + Math.random() * 60;

      setActiveThoughts(prev => [...prev, { id: id++, text, x }]);

      setTimeout(() => {
        setActiveThoughts(prev => prev.slice(1));
      }, 4000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {activeThoughts.map(thought => (
          <motion.div
            key={thought.id}
            className="absolute text-sm text-muted-foreground/50 font-mono whitespace-nowrap"
            style={{ left: `${thought.x}%` }}
            initial={{ bottom: 0, opacity: 0, scale: 0.8 }}
            animate={{ bottom: '100%', opacity: [0, 0.6, 0], scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "easeOut" }}
          >
            {thought.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
