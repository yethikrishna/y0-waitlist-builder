import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Dense strand configuration - Netflix style
const STRAND_COUNT = 80;

export function DNAToLogoAnimation() {
  const [phase, setPhase] = useState<'helix' | 'morphing' | 'logo'>('helix');

  useEffect(() => {
    const sequence = async () => {
      setPhase('helix');
      await new Promise(resolve => setTimeout(resolve, 2500));
      setPhase('morphing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPhase('logo');
      await new Promise(resolve => setTimeout(resolve, 3000));
    };

    sequence();
    const interval = setInterval(sequence, 7500);
    return () => clearInterval(interval);
  }, []);

  // Color palette - vibrant like Netflix
  const colors = [
    '#FF0080', // Pink
    '#7928CA', // Purple
    '#0070F3', // Blue
    '#00DFD8', // Cyan
    '#FF4D4D', // Red
    '#F5A623', // Orange
    '#50E3C2', // Teal
    '#B620E0', // Magenta
  ];

  return (
    <div className="relative w-full h-64 overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
      <svg 
        viewBox="0 0 200 100" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Multiple color gradients */}
          {colors.map((color, i) => (
            <linearGradient key={i} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.9" />
              <stop offset="100%" stopColor={colors[(i + 1) % colors.length]} stopOpacity="0.9" />
            </linearGradient>
          ))}
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Dense DNA Strands */}
        {Array.from({ length: STRAND_COUNT }).map((_, i) => {
          const progress = i / STRAND_COUNT;
          const helixT = progress * Math.PI * 8;
          
          // Helix positions - two interweaving strands
          const amplitude = 35;
          const helixX1 = 100 + Math.sin(helixT) * amplitude;
          const helixX2 = 100 + Math.sin(helixT + Math.PI) * amplitude;
          const helixY = progress * 90 + 5;

          // Target positions for "y0" logo
          const isYPart = progress < 0.55;
          
          let targetX1: number, targetX2: number, targetY: number;
          
          if (isYPart) {
            const yProgress = progress / 0.55;
            if (yProgress < 0.35) {
              // Left arm of y - diagonal down
              const t = yProgress / 0.35;
              targetX1 = 55 + t * 25;
              targetX2 = 60 + t * 20;
              targetY = 20 + t * 35;
            } else if (yProgress < 0.45) {
              // Right arm of y - diagonal down  
              const t = (yProgress - 0.35) / 0.1;
              targetX1 = 95 - t * 15;
              targetX2 = 90 - t * 10;
              targetY = 20 + t * 35;
            } else if (yProgress < 0.55) {
              // Center junction
              targetX1 = 78;
              targetX2 = 82;
              targetY = 55;
            } else {
              // Stem going down
              const t = (yProgress - 0.55) / 0.45;
              targetX1 = 78;
              targetX2 = 82;
              targetY = 55 + t * 30;
            }
          } else {
            // Form the '0' - oval shape
            const zeroProgress = (progress - 0.55) / 0.45;
            const angle = zeroProgress * Math.PI * 2 - Math.PI / 2;
            const centerX = 140;
            const centerY = 50;
            const radiusX = 22;
            const radiusY = 32;
            targetX1 = centerX + Math.cos(angle) * (radiusX - 3);
            targetX2 = centerX + Math.cos(angle) * (radiusX + 3);
            targetY = centerY + Math.sin(angle) * radiusY;
          }

          const isLogo = phase === 'logo';
          const isMorphing = phase === 'morphing';
          const colorIndex = i % colors.length;

          return (
            <motion.line
              key={i}
              stroke={`url(#grad-${colorIndex})`}
              strokeWidth={isLogo ? 3 : 2}
              strokeLinecap="round"
              filter={isLogo ? "url(#glow)" : undefined}
              initial={{
                x1: helixX1,
                y1: helixY,
                x2: helixX2,
                y2: helixY,
                opacity: 0.7,
              }}
              animate={{
                x1: isLogo || isMorphing ? targetX1 : helixX1,
                y1: isLogo || isMorphing ? targetY : helixY,
                x2: isLogo || isMorphing ? targetX2 : helixX2,
                y2: isLogo || isMorphing ? targetY : helixY,
                opacity: isLogo ? 1 : 0.8,
              }}
              transition={{
                duration: isMorphing ? 1.8 : 0.3,
                delay: isMorphing ? i * 0.015 : 0,
                ease: [0.4, 0, 0.2, 1],
              }}
            />
          );
        })}

        {/* Animated wave effect during helix phase */}
        {phase === 'helix' && (
          <motion.g
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {Array.from({ length: 20 }).map((_, i) => {
              const y = (i / 20) * 90 + 5;
              const t = (i / 20) * Math.PI * 8;
              return (
                <motion.line
                  key={`wave-${i}`}
                  x1={100 + Math.sin(t) * 35}
                  y1={y}
                  x2={100 + Math.sin(t + Math.PI) * 35}
                  y2={y}
                  stroke={colors[i % colors.length]}
                  strokeWidth={0.5}
                  strokeOpacity={0.4}
                  animate={{
                    x1: [100 + Math.sin(t) * 35, 100 + Math.sin(t + 0.5) * 35],
                    x2: [100 + Math.sin(t + Math.PI) * 35, 100 + Math.sin(t + Math.PI + 0.5) * 35],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: i * 0.05,
                  }}
                />
              );
            })}
          </motion.g>
        )}
      </svg>

      {/* Text label */}
      <motion.p
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground"
        animate={{ opacity: phase === 'logo' ? 1 : 0.5 }}
      >
        {phase === 'logo' ? 'y0' : 'Evolving...'}
      </motion.p>

      {/* Glow overlay when logo forms */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: phase === 'logo' ? 0.4 : 0,
        }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(121, 40, 202, 0.3) 0%, transparent 60%)',
        }}
      />
    </div>
  );
}
