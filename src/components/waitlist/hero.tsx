import { motion } from "framer-motion";
import { Y0LogoMark } from "@/components/ui/y0-logo";
import { AnimatedBackground } from "./animated-background";
import { AnimatedCounter } from "./animated-counter";
import { WaitlistForm } from "./waitlist-form";
import { useWaitlistCount } from "@/hooks/use-waitlist-count";
import { Users } from "lucide-react";
import { CompyleBadge } from "@/components/compyle/CompyleBadge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const WaitlistHero = () => {
  // Base count of 10 + actual DB signups (live count)
  const { count, isLoading } = useWaitlistCount(10);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-6 py-24 text-center"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="text-primary"
          >
            <Y0LogoMark size={56} />
          </motion.div>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold max-w-4xl mx-auto mb-6 tracking-tight"
        >
          The AI that actually{" "}
          <span className="relative inline-block">
            works for you
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute -bottom-2 left-0 right-0 h-1 bg-primary origin-left"
            />
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          y0 is an AI agent that browses, codes, creates, and completes tasks autonomously. 
          Give it a goal, watch it work in real-time, and get results—not just answers.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-8"
        >
          <WaitlistForm />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>
              {isLoading ? (
                <span className="font-semibold text-foreground">...</span>
              ) : (
                <AnimatedCounter target={count} duration={2.5} className="font-semibold text-foreground" />
              )}
              {" "}people already waiting
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8"
        >
          <CompyleBadge />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-border flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1.5 h-3 rounded-full bg-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
};
