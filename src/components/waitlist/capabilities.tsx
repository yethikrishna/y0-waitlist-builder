import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  Globe, FolderOpen, Code2, Palette, 
  BarChart3, Plug, Bot, Shield, Zap 
} from "lucide-react";

const capabilities = [
  {
    icon: Globe,
    title: "Browse the Web",
    description: "Navigate websites, extract data, and interact with web applications autonomously.",
  },
  {
    icon: FolderOpen,
    title: "Manage Files",
    description: "Create, read, edit, and organize files across your workspace seamlessly.",
  },
  {
    icon: Code2,
    title: "Write & Run Code",
    description: "Generate, debug, and execute code in multiple languages in isolated environments.",
  },
  {
    icon: Palette,
    title: "Create Images",
    description: "Design visuals, generate artwork, and edit images with natural language.",
  },
  {
    icon: BarChart3,
    title: "Analyze Data",
    description: "Process datasets, create visualizations, and uncover actionable insights.",
  },
  {
    icon: Plug,
    title: "Connect Your Apps",
    description: "Integrate with your favorite tools via MCP protocol for seamless workflows.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export const CapabilitiesGrid = () => {
  return (
    <section className="py-24 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border mb-6">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything you need, one AI
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            y0 isn't just a chatbot—it's a full-stack AI agent that can actually do things.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <motion.div key={capability.title} variants={itemVariants}>
                <Card className="p-6 rounded-2xl border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group h-full">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{capability.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {capability.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 mt-12 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Enterprise-grade security</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span>Lightning fast execution</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
