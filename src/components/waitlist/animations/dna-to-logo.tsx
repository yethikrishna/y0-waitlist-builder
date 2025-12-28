import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

// DNA strand configuration
const STRAND_COUNT = 40;
const ANIMATION_DURATION = 3;

interface Point {
  x: number;
  y: number;
}

// Generate DNA helix points
const generateHelixPoints = (count: number): Point[] => {
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 4;
    points.push({
      x: Math.sin(t) * 30 + 50,
      y: (i / count) * 100,
    });
  }
  return points;
};

// Y0 logo target positions (simplified path points)
const Y0_PATHS = {
  y: [
    { x: 25, y: 20 }, { x: 35, y: 40 }, { x: 45, y: 20 }, // V shape top
    { x: 35, y: 40 }, { x: 35, y: 70 }, // stem
  ],
  zero: [
    { x: 55, y: 20 }, { x: 75, y: 20 }, { x: 75, y: 70 },
    { x: 55, y: 70 }, { x: 55, y: 20 }, // rectangle path for 0
  ],
};

export function DNAToLogoAnimation() {
  const [phase, setPhase] = useState<'helix' | 'morphing' | 'logo'>('helix');
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // Start with helix animation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPhase('morphing');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setPhase('logo');
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Reset and loop
      setPhase('helix');
    };

    const interval = setInterval(sequence, 6000);
    sequence();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-48 overflow-hidden">
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity="0.8" />
            <stop offset="50%" stopColor="oklch(var(--primary))" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(var(--primary))" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* DNA Strands that morph into y0 */}
        {Array.from({ length: STRAND_COUNT }).map((_, i) => {
          const helixT = (i / STRAND_COUNT) * Math.PI * 6;
          const helixX1 = Math.sin(helixT) * 25 + 50;
          const helixX2 = Math.sin(helixT + Math.PI) * 25 + 50;
          const helixY = (i / STRAND_COUNT) * 80 + 10;

          // Target positions for y0 logo
          const isYPart = i < STRAND_COUNT * 0.5;
          const logoProgress = i / STRAND_COUNT;
          
          let targetX1: number, targetX2: number, targetY: number;
          
          if (isYPart) {
            // Form the 'y'
            const yProgress = (i / (STRAND_COUNT * 0.5));
            if (yProgress < 0.4) {
              // Left arm of Y
              targetX1 = 20 + yProgress * 30;
              targetX2 = 25 + yProgress * 25;
              targetY = 25 + yProgress * 40;
            } else if (yProgress < 0.6) {
              // Center of Y
              targetX1 = 32;
              targetX2 = 38;
              targetY = 45;
            } else {
              // Stem of Y
              targetX1 = 32;
              targetX2 = 38;
              targetY = 45 + (yProgress - 0.6) * 80;
            }
          } else {
            // Form the '0'
            const zeroProgress = ((i - STRAND_COUNT * 0.5) / (STRAND_COUNT * 0.5));
            const angle = zeroProgress * Math.PI * 2;
            targetX1 = 65 + Math.cos(angle) * 12;
            targetX2 = 65 + Math.cos(angle) * 18;
            targetY = 45 + Math.sin(angle) * 25;
          }

          const isLogo = phase === 'logo';
          const isMorphing = phase === 'morphing';

          return (
            <motion.line
              key={i}
              stroke="url(#dnaGradient)"
              strokeWidth={isLogo ? 2.5 : 1.5}
              strokeLinecap="round"
              initial={{
                x1: helixX1,
                y1: helixY,
                x2: helixX2,
                y2: helixY,
                opacity: 0.3,
              }}
              animate={{
                x1: isLogo || isMorphing ? targetX1 : helixX1,
                y1: isLogo || isMorphing ? targetY : helixY,
                x2: isLogo || isMorphing ? targetX2 : helixX2,
                y2: isLogo || isMorphing ? targetY : helixY,
                opacity: isLogo ? 0.9 : isMorphing ? 0.6 : 0.4,
              }}
              transition={{
                duration: isMorphing ? 1.5 : 0.5,
                delay: isMorphing ? i * 0.02 : 0,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Animated connecting rungs */}
        {phase === 'helix' && Array.from({ length: 15 }).map((_, i) => {
          const t = (i / 15) * Math.PI * 6;
          const y = (i / 15) * 80 + 10;
          const x1 = Math.sin(t) * 25 + 50;
          const x2 = Math.sin(t + Math.PI) * 25 + 50;

          return (
            <motion.line
              key={`rung-${i}`}
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="oklch(var(--primary))"
              strokeWidth={0.5}
              strokeOpacity={0.2}
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: [0, 1, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>

      {/* Subtle glow effect when logo forms */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: phase === 'logo' ? 0.3 : 0,
        }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'radial-gradient(circle at center, oklch(var(--primary) / 0.2) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
