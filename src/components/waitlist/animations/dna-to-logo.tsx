import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Netflix-style vibrant colors
const COLORS = [
  '#E50914', // Netflix Red
  '#FF6B6B', // Coral
  '#C850C0', // Purple
  '#4158D0', // Blue
  '#0093E9', // Light Blue
  '#00C9A7', // Teal
  '#FFD93D', // Yellow
  '#FF6B35', // Orange
];

// Dense strand count for realistic DNA
const STRAND_POINTS = 100;

export function DNAToLogoAnimation() {
  const [phase, setPhase] = useState<'dna' | 'morphing' | 'logo'>('dna');
  
  useEffect(() => {
    const sequence = async () => {
      setPhase('dna');
      await new Promise(r => setTimeout(r, 3000));
      setPhase('morphing');
      await new Promise(r => setTimeout(r, 1500));
      setPhase('logo');
      await new Promise(r => setTimeout(r, 2500));
    };
    
    sequence();
    const interval = setInterval(sequence, 7000);
    return () => clearInterval(interval);
  }, []);

  const width = 280;
  const height = 160;
  const centerX = width / 2;
  const isLogo = phase === 'logo';
  const isMorphing = phase === 'morphing';

  // Generate DNA double helix points
  const generateHelixPoints = () => {
    const strand1: Array<{x: number, y: number, color: string}> = [];
    const strand2: Array<{x: number, y: number, color: string}> = [];
    const basePairs: Array<{x1: number, x2: number, y: number, color: string}> = [];
    
    const amplitude = 40;
    const turns = 2.5;
    
    for (let i = 0; i < STRAND_POINTS; i++) {
      const t = i / STRAND_POINTS;
      const angle = t * Math.PI * 2 * turns;
      const y = t * height * 0.9 + height * 0.05;
      
      strand1.push({
        x: centerX + Math.sin(angle) * amplitude,
        y,
        color: COLORS[i % COLORS.length],
      });
      
      strand2.push({
        x: centerX + Math.sin(angle + Math.PI) * amplitude,
        y,
        color: COLORS[(i + 4) % COLORS.length],
      });
      
      // Base pairs every few points
      if (i % 4 === 0) {
        basePairs.push({
          x1: centerX + Math.sin(angle) * amplitude,
          x2: centerX + Math.sin(angle + Math.PI) * amplitude,
          y,
          color: COLORS[i % COLORS.length],
        });
      }
    }
    
    return { strand1, strand2, basePairs };
  };

  // Generate y0 logo target positions
  const generateLogoPoints = () => {
    const points: Array<{x: number, y: number, color: string, type: 'y' | '0'}> = [];
    
    // "y" letter - left diagonal, right diagonal, stem
    const yLeft = 85;
    const yRight = 135;
    const yCenter = 110;
    const yTop = 25;
    const yMiddle = 80;
    const yBottom = 140;
    
    // Left arm of Y (top-left to center)
    for (let i = 0; i < 25; i++) {
      const t = i / 24;
      points.push({
        x: yLeft + (yCenter - yLeft) * t,
        y: yTop + (yMiddle - yTop) * t,
        color: COLORS[i % COLORS.length],
        type: 'y',
      });
    }
    
    // Right arm of Y (top-right to center)
    for (let i = 0; i < 25; i++) {
      const t = i / 24;
      points.push({
        x: yRight - (yRight - yCenter) * t,
        y: yTop + (yMiddle - yTop) * t,
        color: COLORS[(i + 2) % COLORS.length],
        type: 'y',
      });
    }
    
    // Stem of Y
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      points.push({
        x: yCenter,
        y: yMiddle + (yBottom - yMiddle) * t,
        color: COLORS[(i + 4) % COLORS.length],
        type: 'y',
      });
    }
    
    // "0" letter - ellipse
    const zeroX = 190;
    const zeroY = height / 2;
    const radiusX = 28;
    const radiusY = 55;
    
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      points.push({
        x: zeroX + Math.cos(angle) * radiusX,
        y: zeroY + Math.sin(angle) * radiusY,
        color: COLORS[(i + 1) % COLORS.length],
        type: '0',
      });
    }
    
    return points;
  };

  const { strand1, strand2, basePairs } = generateHelixPoints();
  const logoPoints = generateLogoPoints();

  return (
    <div className="relative w-full flex justify-center py-6 bg-gradient-to-b from-background to-muted/30">
      <div className="relative" style={{ width, height }}>
        <svg 
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
        >
          <defs>
            <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <AnimatePresence mode="wait">
            {!isLogo ? (
              // DNA Double Helix
              <motion.g
                key="dna"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Base pairs / rungs */}
                {basePairs.map((pair, i) => (
                  <motion.line
                    key={`pair-${i}`}
                    x1={pair.x1}
                    y1={pair.y}
                    x2={pair.x2}
                    y2={pair.y}
                    stroke={pair.color}
                    strokeWidth={1.5}
                    strokeOpacity={0.5}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
                
                {/* Strand 1 - dots forming the helix */}
                {strand1.map((point, i) => (
                  <motion.circle
                    key={`s1-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r={2.5}
                    fill={point.color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 0.9, 
                      scale: 1,
                      cx: isMorphing && logoPoints[i] ? logoPoints[i].x : point.x,
                      cy: isMorphing && logoPoints[i] ? logoPoints[i].y : point.y,
                    }}
                    transition={{
                      opacity: { duration: 0.3, delay: i * 0.01 },
                      scale: { duration: 0.3, delay: i * 0.01 },
                      cx: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
                      cy: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
                    }}
                  />
                ))}
                
                {/* Strand 2 */}
                {strand2.map((point, i) => (
                  <motion.circle
                    key={`s2-${i}`}
                    cx={point.x}
                    cy={point.y}
                    r={2.5}
                    fill={point.color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 0.9, 
                      scale: 1,
                    }}
                    transition={{
                      duration: 0.3, 
                      delay: i * 0.01 + 0.3,
                    }}
                  />
                ))}
              </motion.g>
            ) : (
              // Y0 Logo formed from particles
              <motion.g
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                filter="url(#glow)"
              >
                {logoPoints.map((point, i) => (
                  <motion.circle
                    key={`logo-${i}`}
                    r={3.5}
                    fill={point.color}
                    initial={{ 
                      cx: strand1[i % strand1.length]?.x || centerX,
                      cy: strand1[i % strand1.length]?.y || height / 2,
                      opacity: 0,
                    }}
                    animate={{ 
                      cx: point.x,
                      cy: point.y,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.015,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                ))}
                
                {/* Connecting lines for Y */}
                <motion.path
                  d="M 85 25 L 110 80 L 110 140"
                  fill="none"
                  stroke="url(#yGradient)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <motion.path
                  d="M 135 25 L 110 80"
                  fill="none"
                  stroke="url(#yGradient)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />
                
                {/* 0 ellipse */}
                <motion.ellipse
                  cx={190}
                  cy={height / 2}
                  rx={28}
                  ry={55}
                  fill="none"
                  stroke="url(#zeroGradient)"
                  strokeWidth={6}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
                
                <defs>
                  <linearGradient id="yGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E50914" />
                    <stop offset="50%" stopColor="#C850C0" />
                    <stop offset="100%" stopColor="#4158D0" />
                  </linearGradient>
                  <linearGradient id="zeroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0093E9" />
                    <stop offset="50%" stopColor="#00C9A7" />
                    <stop offset="100%" stopColor="#FFD93D" />
                  </linearGradient>
                </defs>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: isLogo ? 0.6 : 0 }}
          transition={{ duration: 0.8 }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(229, 9, 20, 0.25) 0%, rgba(200, 80, 192, 0.15) 40%, transparent 70%)',
          }}
        />
      </div>
    </div>
  );
}
