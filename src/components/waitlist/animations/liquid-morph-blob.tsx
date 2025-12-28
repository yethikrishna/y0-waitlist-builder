'use client';

import { motion } from 'framer-motion';

export function LiquidMorphBlob() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        className="w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10 blur-3xl"
        animate={{
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 60% 70% 40% / 50% 60% 30% 60%",
            "60% 40% 30% 70% / 60% 30% 70% 40%",
          ],
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Inner blob */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-tl from-primary/20 to-transparent blur-2xl"
        animate={{
          borderRadius: [
            "40% 60% 70% 30% / 40% 50% 60% 50%",
            "70% 30% 50% 50% / 30% 30% 70% 70%",
            "40% 60% 70% 30% / 40% 50% 60% 50%",
          ],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
