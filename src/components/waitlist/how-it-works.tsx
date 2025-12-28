import { motion } from "framer-motion";
import { MessageSquare, Eye, CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Tell y0 what you need",
    description: "Describe your task in natural language. Be as specific or general as you want—y0 adapts.",
  },
  {
    number: "02",
    icon: Eye,
    title: "Watch it work in real-time",
    description: "See y0 browse, code, and create. Every action is visible, transparent, and controllable.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Get results, not just answers",
    description: "Receive completed work—files, presentations, code, and more—ready to use immediately.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three simple steps to transform how you work with AI.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative"
                >
                  {/* Connection line - mobile */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute top-full left-1/2 w-0.5 h-8 bg-border -translate-x-1/2" />
                  )}

                  <div className="relative z-10 text-center">
                    {/* Number badge */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="w-20 h-20 rounded-2xl bg-card border-2 border-border flex items-center justify-center mx-auto mb-6 relative shadow-lg"
                    >
                      <Icon className="w-8 h-8 text-primary" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                        {step.number}
                      </div>
                    </motion.div>

                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
