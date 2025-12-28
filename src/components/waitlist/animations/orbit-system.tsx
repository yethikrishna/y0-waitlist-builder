'use client';

import { motion } from 'framer-motion';

const ORBS = [
  { radius: 80, duration: 8, size: 8, color: 'bg-blue-500/30' },
  { radius: 120, duration: 12, size: 6, color: 'bg-purple-500/30' },
  { radius: 160, duration: 16, size: 10, color: 'bg-green-500/30' },
  { radius: 200, duration: 20, size: 4, color: 'bg-yellow-500/30' },
];

export function OrbitSystem() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Central glow */}
      <div className="absolute w-16 h-16 rounded-full bg-primary/20 blur-xl" />

      {/* Orbit paths */}
      {ORBS.map((orb, i) => (
        <div
          key={`path-${i}`}
          className="absolute rounded-full border border-dashed border-muted-foreground/10"
          style={{
            width: orb.radius * 2,
            height: orb.radius * 2,
          }}
        />
      ))}

      {/* Orbiting orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute"
          style={{
            width: orb.radius * 2,
            height: orb.radius * 2,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            className={`absolute rounded-full ${orb.color} blur-sm`}
            style={{
              width: orb.size,
              height: orb.size,
              top: '50%',
              left: '100%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
