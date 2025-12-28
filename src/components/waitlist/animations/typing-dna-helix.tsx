'use client';

import { motion } from 'framer-motion';

const CHARS = 'ATCG01▪▫●○'.split('');

export function TypingDNAHelix() {
  const strands = 15;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-40">
      {Array.from({ length: strands }).map((_, i) => {
        const yOffset = (i / strands) * 100 - 50;
        const phase = i * 0.5;

        return (
          <motion.div
            key={i}
            className="absolute flex gap-8"
            style={{ top: `${50 + yOffset}%` }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 10,
              delay: phase,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Left strand */}
            <motion.span
              className="text-primary/20 font-mono text-[10px]"
              animate={{
                y: [Math.sin(phase) * 20, Math.sin(phase + Math.PI) * 20, Math.sin(phase) * 20],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {CHARS[i % CHARS.length]}
            </motion.span>

            {/* Connecting bar */}
            <motion.div
              className="w-4 h-px bg-muted-foreground/20 self-center"
              animate={{ scaleX: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Right strand */}
            <motion.span
              className="text-primary/20 font-mono text-[10px]"
              animate={{
                y: [Math.sin(phase + Math.PI) * 20, Math.sin(phase) * 20, Math.sin(phase + Math.PI) * 20],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {CHARS[(i + 5) % CHARS.length]}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}
