import { motion } from "framer-motion";
import { WaitlistForm } from "./waitlist-form";
import { Y0LogoMark } from "@/components/ui/y0-logo";
import { Sparkles } from "lucide-react";

export const WaitlistCTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden"
        >
          {/* Gradient border effect */}
          <div className="absolute inset-0 rounded-3xl gradient-border" />
          
          {/* Background */}
          <div className="absolute inset-[1px] rounded-3xl bg-card" />

          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 380, damping: 30, delay: 0.2 }}
              className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-8"
            >
              <Y0LogoMark size={32} className="text-primary-foreground" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Early Access</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                Be the first to experience y0
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
                Join the waitlist today and get early access to the AI that actually gets things done.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex justify-center mb-6"
            >
              <WaitlistForm variant="cta" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              No spam, ever. Unsubscribe anytime.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
