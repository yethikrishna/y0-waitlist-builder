import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

// Scientific DNA base pair colors
const BASE_COLORS = {
  adenine: '#22C55E',   // Green
  thymine: '#EF4444',   // Red  
  guanine: '#3B82F6',   // Blue
  cytosine: '#EAB308',  // Yellow
};

// Create color pairs (A-T, G-C)
const BASE_PAIRS = [
  [BASE_COLORS.adenine, BASE_COLORS.thymine],
  [BASE_COLORS.guanine, BASE_COLORS.cytosine],
  [BASE_COLORS.thymine, BASE_COLORS.adenine],
  [BASE_COLORS.cytosine, BASE_COLORS.guanine],
];

// Dense strand for realistic DNA
const BASE_PAIR_COUNT = 40;

export function DNAToLogoAnimation() {
  const [phase, setPhase] = useState<'dna' | 'unzipping' | 'morphing' | 'logo'>('dna');
  
  useEffect(() => {
    const sequence = async () => {
      setPhase('dna');
      await new Promise(r => setTimeout(r, 3000));
      setPhase('unzipping');
      await new Promise(r => setTimeout(r, 1500));
      setPhase('morphing');
      await new Promise(r => setTimeout(r, 1200));
      setPhase('logo');
      await new Promise(r => setTimeout(r, 2500));
    };
    
    sequence();
    const interval = setInterval(sequence, 8200);
    return () => clearInterval(interval);
  }, []);

  const width = 800;
  const height = 120;
  const isLogo = phase === 'logo';
  const isUnzipping = phase === 'unzipping';
  const isMorphing = phase === 'morphing' || isLogo;

  // Generate horizontal DNA double helix
  const helixData = useMemo(() => {
    const strand1: Array<{x: number, y: number, color: string}> = [];
    const strand2: Array<{x: number, y: number, color: string}> = [];
    const basePairs: Array<{x: number, y1: number, y2: number, color1: string, color2: string}> = [];
    
    const amplitude = 35;
    const turns = 4;
    const startX = 50;
    const endX = width - 50;
    const centerY = height / 2;
    
    for (let i = 0; i < BASE_PAIR_COUNT; i++) {
      const t = i / (BASE_PAIR_COUNT - 1);
      const x = startX + t * (endX - startX);
      const angle = t * Math.PI * 2 * turns;
      
      const pairColors = BASE_PAIRS[i % BASE_PAIRS.length];
      
      // Calculate y positions for the two strands (sinusoidal, offset by PI)
      const y1 = centerY + Math.sin(angle) * amplitude;
      const y2 = centerY + Math.sin(angle + Math.PI) * amplitude;
      
      strand1.push({ x, y: y1, color: pairColors[0] });
      strand2.push({ x, y: y2, color: pairColors[1] });
      
      basePairs.push({
        x,
        y1,
        y2,
        color1: pairColors[0],
        color2: pairColors[1],
      });
    }
    
    return { strand1, strand2, basePairs };
  }, []);

  // Generate y0 logo target positions
  const logoPoints = useMemo(() => {
    const points: Array<{x: number, y: number, color: string}> = [];
    const centerX = width / 2;
    const logoHeight = height * 0.8;
    const topY = (height - logoHeight) / 2;
    
    // "y" letter dimensions
    const yWidth = 50;
    const yLeft = centerX - 60;
    const yCenter = yLeft + yWidth / 2;
    const yRight = yLeft + yWidth;
    const yMiddle = height / 2;
    const yBottom = topY + logoHeight;
    
    // Left arm of Y
    for (let i = 0; i < 15; i++) {
      const t = i / 14;
      points.push({
        x: yLeft + (yCenter - yLeft) * t,
        y: topY + (yMiddle - topY) * t,
        color: BASE_PAIRS[i % 4][0],
      });
    }
    
    // Right arm of Y
    for (let i = 0; i < 15; i++) {
      const t = i / 14;
      points.push({
        x: yRight - (yRight - yCenter) * t,
        y: topY + (yMiddle - topY) * t,
        color: BASE_PAIRS[i % 4][1],
      });
    }
    
    // Stem of Y
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      points.push({
        x: yCenter,
        y: yMiddle + (yBottom - yMiddle) * t,
        color: BASE_PAIRS[i % 4][0],
      });
    }
    
    // "0" letter
    const zeroX = centerX + 50;
    const radiusX = 25;
    const radiusY = logoHeight / 2 - 5;
    
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      points.push({
        x: zeroX + Math.cos(angle) * radiusX,
        y: height / 2 + Math.sin(angle) * radiusY,
        color: BASE_PAIRS[i % 4][1],
      });
    }
    
    return points;
  }, []);

  const { strand1, strand2, basePairs } = helixData;

  // Create backbone paths
  const strand1Path = useMemo(() => {
    return strand1.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');
  }, [strand1]);

  const strand2Path = useMemo(() => {
    return strand2.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');
  }, [strand2]);

  return (
    <div className="relative w-full py-8 bg-gradient-to-b from-muted/50 to-background overflow-hidden">
      <svg 
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-32"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="dnaGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="strand1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BASE_COLORS.adenine} />
            <stop offset="33%" stopColor={BASE_COLORS.guanine} />
            <stop offset="66%" stopColor={BASE_COLORS.adenine} />
            <stop offset="100%" stopColor={BASE_COLORS.guanine} />
          </linearGradient>
          <linearGradient id="strand2Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={BASE_COLORS.thymine} />
            <stop offset="33%" stopColor={BASE_COLORS.cytosine} />
            <stop offset="66%" stopColor={BASE_COLORS.thymine} />
            <stop offset="100%" stopColor={BASE_COLORS.cytosine} />
          </linearGradient>
          <linearGradient id="yGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={BASE_COLORS.adenine} />
            <stop offset="50%" stopColor={BASE_COLORS.guanine} />
            <stop offset="100%" stopColor={BASE_COLORS.adenine} />
          </linearGradient>
          <linearGradient id="zeroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={BASE_COLORS.cytosine} />
            <stop offset="50%" stopColor={BASE_COLORS.thymine} />
            <stop offset="100%" stopColor={BASE_COLORS.cytosine} />
          </linearGradient>
        </defs>

        <AnimatePresence mode="sync">
          {!isLogo && (
            <motion.g
              key="dna"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Phosphate backbone strand 1 */}
              <motion.path
                d={strand1Path}
                fill="none"
                stroke="url(#strand1Gradient)"
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: isUnzipping ? 0.4 : 0.9,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Phosphate backbone strand 2 */}
              <motion.path
                d={strand2Path}
                fill="none"
                stroke="url(#strand2Gradient)"
                strokeWidth={3}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: isUnzipping ? 0.4 : 0.9,
                }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              />
              
              {/* Base pairs (rungs) */}
              {basePairs.map((pair, i) => (
                <motion.g key={`pair-${i}`}>
                  {/* Base pair line */}
                  <motion.line
                    x1={pair.x}
                    y1={pair.y1}
                    x2={pair.x}
                    y2={pair.y2}
                    stroke={pair.color1}
                    strokeWidth={2}
                    strokeOpacity={0.6}
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: isUnzipping ? 0 : 1,
                      opacity: isUnzipping ? 0 : 0.6,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.03,
                    }}
                  />
                  
                  {/* Nucleotide on strand 1 */}
                  <motion.circle
                    r={4}
                    fill={pair.color1}
                    filter="url(#dnaGlow)"
                    initial={{ 
                      cx: pair.x, 
                      cy: pair.y1,
                      opacity: 0, 
                      scale: 0 
                    }}
                    animate={{ 
                      cx: isMorphing && logoPoints[i] ? logoPoints[i].x : pair.x,
                      cy: isMorphing && logoPoints[i] ? logoPoints[i].y : pair.y1,
                      opacity: 1, 
                      scale: 1,
                    }}
                    transition={{
                      opacity: { duration: 0.3, delay: i * 0.02 },
                      scale: { duration: 0.3, delay: i * 0.02 },
                      cx: { duration: 1, ease: [0.4, 0, 0.2, 1] },
                      cy: { duration: 1, ease: [0.4, 0, 0.2, 1] },
                    }}
                  />
                  
                  {/* Nucleotide on strand 2 */}
                  <motion.circle
                    r={4}
                    fill={pair.color2}
                    filter="url(#dnaGlow)"
                    initial={{ 
                      cx: pair.x, 
                      cy: pair.y2,
                      opacity: 0, 
                      scale: 0 
                    }}
                    animate={{ 
                      cx: isMorphing && logoPoints[i + BASE_PAIR_COUNT] ? logoPoints[i + BASE_PAIR_COUNT].x : pair.x,
                      cy: isMorphing && logoPoints[i + BASE_PAIR_COUNT] ? logoPoints[i + BASE_PAIR_COUNT].y : pair.y2,
                      opacity: 1, 
                      scale: 1,
                    }}
                    transition={{
                      opacity: { duration: 0.3, delay: i * 0.02 + 0.1 },
                      scale: { duration: 0.3, delay: i * 0.02 + 0.1 },
                      cx: { duration: 1, ease: [0.4, 0, 0.2, 1] },
                      cy: { duration: 1, ease: [0.4, 0, 0.2, 1] },
                    }}
                  />
                </motion.g>
              ))}
            </motion.g>
          )}

          {isLogo && (
            <motion.g
              key="logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              filter="url(#dnaGlow)"
            >
              {/* y0 formed from particles */}
              {logoPoints.map((point, i) => (
                <motion.circle
                  key={`logo-${i}`}
                  r={5}
                  fill={point.color}
                  initial={{ 
                    cx: basePairs[i % basePairs.length]?.x || width / 2,
                    cy: i < 40 ? basePairs[i % basePairs.length]?.y1 : basePairs[i % basePairs.length]?.y2 || height / 2,
                    opacity: 0,
                  }}
                  animate={{ 
                    cx: point.x,
                    cy: point.y,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.01,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                />
              ))}
              
              {/* Y letter stroke */}
              <motion.path
                d={`M ${width/2 - 60} ${height * 0.1} L ${width/2 - 35} ${height/2} L ${width/2 - 35} ${height * 0.9}`}
                fill="none"
                stroke="url(#yGradient)"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              <motion.path
                d={`M ${width/2 - 10} ${height * 0.1} L ${width/2 - 35} ${height/2}`}
                fill="none"
                stroke="url(#yGradient)"
                strokeWidth={8}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              
              {/* 0 ellipse */}
              <motion.ellipse
                cx={width/2 + 50}
                cy={height / 2}
                rx={25}
                ry={height * 0.4 - 5}
                fill="none"
                stroke="url(#zeroGradient)"
                strokeWidth={8}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: isLogo ? 0.4 : 0.2 }}
        transition={{ duration: 0.8 }}
        style={{
          background: `radial-gradient(ellipse at center, ${BASE_COLORS.adenine}20 0%, ${BASE_COLORS.guanine}15 30%, transparent 60%)`,
        }}
      />
    </div>
  );
}