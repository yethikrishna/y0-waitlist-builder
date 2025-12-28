import { motion } from "framer-motion";
import { ConstellationConnect } from "./animations/constellation-connect";
import { LiquidMorphBlob } from "./animations/liquid-morph-blob";

export const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Liquid morph blob - organic flowing background */}
      <LiquidMorphBlob />

      {/* Constellation connecting nodes */}
      <ConstellationConnect />

      {/* Gradient arcs */}
      <motion.div
        className="absolute -top-1/2 -left-1/4 w-[150%] h-[150%] opacity-30"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-[var(--gradient-arc-1)] to-transparent blur-3xl" />
      </motion.div>

      <motion.div
        className="absolute -bottom-1/2 -right-1/4 w-[150%] h-[150%] opacity-20"
        animate={{
          rotate: [360, 0],
        }}
        transition={{
          duration: 100,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-tl from-[var(--gradient-arc-2)] to-transparent blur-3xl" />
      </motion.div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(oklch(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, oklch(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background opacity-60" />
    </div>
  );
};
