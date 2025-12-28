import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Y0LogoMark } from "@/components/ui/y0-logo";
import { Card } from "@/components/ui/card";
import { 
  Zap, FolderOpen, Globe, CircleDashed, Presentation, 
  BarChart3, FileText, Search, Image as ImageIcon, 
  CornerDownLeft, Paperclip, Mic, Database, Code, Calendar,
  Share2, Plane, TrendingUp
} from "lucide-react";

type ViewType = "terminal" | "files" | "browser";

interface Step {
  type: "message" | "toolcall";
  aiText?: string;
  title?: string;
  view?: ViewType;
  icon?: string;
  contentType?: "empty" | "slides" | "chart" | "image" | "markdown" | "search" | "table";
  contentMarkdown?: string;
}

const exampleShowcases = [
  {
    id: "code",
    title: "Code & Deploy",
    description: "Build a landing page and deploy it to Vercel",
    steps: [
      { type: "message", aiText: "I'll create a modern landing page and deploy it for you..." } as Step,
      { 
        type: "toolcall", 
        title: "Creating Components", 
        view: "terminal" as ViewType, 
        icon: "file",
        contentType: "markdown" as const,
        contentMarkdown: `// Hero.tsx
export function Hero() {
  return (
    <section className="hero">
      <h1>Welcome to y0</h1>
      <button>Get Started</button>
    </section>
  )
}`
      } as Step,
      { 
        type: "toolcall", 
        title: "Running Dev Server", 
        view: "browser" as ViewType, 
        icon: "computer",
        contentType: "image" as const
      } as Step,
      { 
        type: "toolcall", 
        title: "Deploying to Vercel", 
        view: "terminal" as ViewType, 
        icon: "database",
        contentType: "markdown" as const,
        contentMarkdown: `✓ Building project...
✓ Optimizing assets...
✓ Deploying to Vercel...

🚀 Deployed successfully!
https://y0-landing.vercel.app`
      } as Step,
    ],
  },
  {
    id: "research",
    title: "Deep Research",
    description: "Research quantum computing and write a summary",
    steps: [
      { type: "message", aiText: "I'll research quantum computing from multiple sources..." } as Step,
      { 
        type: "toolcall", 
        title: "Reading Papers", 
        view: "browser" as ViewType, 
        icon: "search",
        contentType: "search" as const
      } as Step,
      { 
        type: "toolcall", 
        title: "Analyzing Sources", 
        view: "terminal" as ViewType, 
        icon: "database",
        contentType: "table" as const
      } as Step,
      { 
        type: "toolcall", 
        title: "Writing Summary", 
        view: "terminal" as ViewType, 
        icon: "file",
        contentType: "markdown" as const,
        contentMarkdown: `# Quantum Computing

## Key Concepts
• Qubits: Superposition states
• Entanglement: Correlation
• Quantum Gates: Operations

## Current Leaders
1. IBM - 1,121 qubits
2. Google - 70 qubits
3. IonQ - 32 qubits`
      } as Step,
    ],
  },
  {
    id: "data",
    title: "Data Analysis",
    description: "Analyze Q4 sales performance",
    steps: [
      { type: "message", aiText: "I'll load your sales data and create a comprehensive analysis..." } as Step,
      { type: "toolcall", title: "Loading Data", view: "browser" as ViewType, icon: "database", contentType: "table" as const } as Step,
      { type: "toolcall", title: "Creating Visualization", view: "terminal" as ViewType, icon: "chart", contentType: "chart" as const } as Step,
      { 
        type: "toolcall", 
        title: "Creating Report", 
        view: "terminal" as ViewType, 
        icon: "file",
        contentType: "markdown" as const,
        contentMarkdown: `# Q4 Sales Report

## Summary
• Revenue: $2.4M (+18%)
• New Customers: 847
• Retention: 94%

## Top Products
1. Enterprise Plan
2. Team License
3. Starter Pack`
      } as Step,
    ],
  },
  {
    id: "travel",
    title: "Travel Plan",
    description: "Plan a 5-day trip to Tokyo with budget",
    steps: [
      { type: "message", aiText: "I'll create a complete Tokyo itinerary for you..." } as Step,
      { type: "toolcall", title: "Searching Flights", view: "browser" as ViewType, icon: "search", contentType: "search" as const } as Step,
      { type: "toolcall", title: "Finding Hotels", view: "browser" as ViewType, icon: "database", contentType: "table" as const } as Step,
      { 
        type: "toolcall", 
        title: "Creating Itinerary", 
        view: "terminal" as ViewType, 
        icon: "presentation",
        contentType: "markdown" as const,
        contentMarkdown: `# Tokyo 5-Day Trip

## Budget: $2,450

**Day 1** - Shibuya
**Day 2** - Temples
**Day 3** - Mt. Fuji
**Day 4** - Food Tour
**Day 5** - Shopping`
      } as Step,
    ],
  },
  {
    id: "analysis",
    title: "Competitor Intel",
    description: "Analyze our top 3 competitors and pricing",
    steps: [
      { type: "message", aiText: "I'll research your competitors and create a comparison..." } as Step,
      { type: "toolcall", title: "Scraping Websites", view: "browser" as ViewType, icon: "search", contentType: "search" as const } as Step,
      { type: "toolcall", title: "Analyzing Pricing", view: "terminal" as ViewType, icon: "chart", contentType: "table" as const } as Step,
      { 
        type: "toolcall", 
        title: "Creating Report", 
        view: "terminal" as ViewType, 
        icon: "file",
        contentType: "markdown" as const,
        contentMarkdown: `# Competitive Analysis

| Feature | Us | A | B |
|---------|-----|---|---|
| Price | $29 | $49 | $39 |
| Users | ∞ | 5 | 10 |
| API | ✓ | ✓ | ✗ |

✓ Best value
✓ Unlimited users`
      } as Step,
    ],
  },
];

const getIconComponent = (iconType?: string) => {
  switch (iconType) {
    case "presentation": return Presentation;
    case "chart": return BarChart3;
    case "file": return FileText;
    case "search": return Search;
    case "image": return ImageIcon;
    case "database": return Database;
    case "computer": return Code;
    case "calendar": return Calendar;
    case "social": return Share2;
    case "travel": return Plane;
    case "trending": return TrendingUp;
    default: return Zap;
  }
};

export const FeatureShowcase = () => {
  const [activeExample, setActiveExample] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [aiText, setAiText] = useState("");
  const [selectedView, setSelectedView] = useState<ViewType>("terminal");

  const currentExample = exampleShowcases[activeExample];
  const currentStep = currentExample.steps[currentStepIndex];

  // Auto-play examples
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveExample((prev) => (prev + 1) % exampleShowcases.length);
      setCurrentStepIndex(0);
    }, 12000);
    return () => clearTimeout(timer);
  }, [activeExample]);

  // Reset on example change
  useEffect(() => {
    setCurrentStepIndex(0);
    setAiText("");
    setSelectedView("terminal");
  }, [activeExample]);

  // Animate through steps
  useEffect(() => {
    const step = currentExample.steps[currentStepIndex];
    if (!step) return;

    if (step.type === "message") {
      setAiText("");
      let index = 0;
      const fullText = step.aiText || "";
      const typingInterval = setInterval(() => {
        if (index <= fullText.length) {
          setAiText(fullText.slice(0, index));
          index++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            if (currentStepIndex < currentExample.steps.length - 1) {
              setCurrentStepIndex((prev) => prev + 1);
            }
          }, 300);
        }
      }, 20);
      return () => clearInterval(typingInterval);
    }

    if (step.type === "toolcall") {
      if (step.view) setSelectedView(step.view);
      const timer = setTimeout(() => {
        if (currentStepIndex < currentExample.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, currentExample, activeExample]);

  const renderContent = () => {
    if (currentStep?.contentType === "markdown" && currentStep.contentMarkdown) {
      return (
        <div className="space-y-3 w-full max-w-xs">
          <div className="bg-card rounded-xl border p-4 text-left">
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap leading-relaxed">
              {currentStep.contentMarkdown}
            </pre>
          </div>
        </div>
      );
    }

    if (currentStep?.contentType === "search") {
      return (
        <div className="space-y-2 w-full max-w-xs">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-card rounded-lg border p-3 text-left"
            >
              <div className="h-2 w-3/4 bg-primary/20 rounded mb-2" />
              <div className="h-2 w-1/2 bg-muted rounded" />
            </motion.div>
          ))}
          <p className="text-sm text-muted-foreground pt-2">Searching sources...</p>
        </div>
      );
    }

    if (currentStep?.contentType === "table") {
      return (
        <div className="space-y-2 w-full max-w-xs">
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="grid grid-cols-3 gap-px bg-border">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-2 ${i < 3 ? 'bg-muted' : 'bg-card'}`}
                >
                  <div className={`h-2 ${i < 3 ? 'bg-foreground/20' : 'bg-muted'} rounded`} />
                </motion.div>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Processing data...</p>
        </div>
      );
    }

    if (currentStep?.contentType === "slides") {
      return (
        <div className="space-y-4">
          <div className="w-72 h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center border">
            <Presentation className="w-12 h-12 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Creating slides...</p>
        </div>
      );
    }

    if (currentStep?.contentType === "chart") {
      return (
        <div className="space-y-4">
          <div className="w-72 h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center border relative overflow-hidden">
            <div className="absolute bottom-4 left-4 right-4 flex items-end gap-2 h-20">
              {[40, 65, 45, 80, 55, 70].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex-1 bg-primary/60 rounded-t"
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Generating chart...</p>
        </div>
      );
    }

    if (currentStep?.contentType === "image") {
      return (
        <div className="space-y-4">
          <div className="w-72 h-40 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center border">
            <ImageIcon className="w-12 h-12 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">Rendering preview...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Zap className="w-8 h-8 text-muted-foreground animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground">Processing...</p>
      </div>
    );
  };

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">See y0 in action</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Watch how y0 handles complex tasks autonomously, from research to creation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="rounded-3xl p-0 overflow-hidden border shadow-xl">
            <div className="flex flex-col lg:flex-row min-h-[500px]">
              {/* Left Side - Chat */}
              <div className="flex-1 flex flex-col bg-background border-r border-border">
                <div className="flex-1 p-6 space-y-4 overflow-hidden">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-lg bg-card border px-4 py-3">
                      <p className="text-sm">{currentExample.description}</p>
                    </div>
                  </div>

                  {/* AI Response + Tool Calls */}
                  {currentExample.steps.slice(0, currentStepIndex + 1).map((step, idx) => {
                    const isCurrentStep = idx === currentStepIndex;

                    if (step.type === "message") {
                      const displayText = isCurrentStep ? aiText : step.aiText;
                      const isTyping = isCurrentStep && aiText.length < (step.aiText?.length || 0);

                      return (
                        <div key={idx} className="flex justify-start">
                          <div className="max-w-[85%]">
                            <div className="flex items-center gap-2 mb-2">
                              <Y0LogoMark size={16} className="text-primary" />
                              <span className="text-sm font-medium">y0</span>
                            </div>
                            <p className="text-sm text-foreground">
                              {displayText}
                              {isTyping && (
                                <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse" />
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    }

                    if (step.type === "toolcall") {
                      const IconComponent = getIconComponent(step.icon);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="my-2"
                        >
                          <div className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-card rounded-xl border">
                            <IconComponent className="w-4 h-4 text-muted-foreground" />
                            <span className="font-mono text-xs">{step.title}</span>
                            {isCurrentStep && (
                              <CircleDashed className="w-4 h-4 text-muted-foreground animate-spin" />
                            )}
                          </div>
                        </motion.div>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Example Selector */}
                <div className="px-6 py-4 border-t border-border">
                  <div className="flex gap-2 flex-wrap">
                    {exampleShowcases.map((example, idx) => (
                      <motion.button
                        key={example.id}
                        onClick={() => setActiveExample(idx)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                          activeExample === idx
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border hover:bg-accent"
                        }`}
                      >
                        {example.title}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Input Area (decorative) */}
                <div className="px-6 pb-6">
                  <div className="flex flex-col border rounded-2xl bg-card px-4 py-3">
                    <div className="text-sm text-muted-foreground mb-3">
                      {currentExample.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg border hover:bg-accent transition-colors">
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                          <Mic className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg bg-primary text-primary-foreground">
                          <CornerDownLeft className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - y0 Computer */}
              <div className="flex-1 bg-muted/30 p-6">
                <Card className="w-full h-full rounded-2xl p-0 overflow-hidden flex flex-col">
                  {/* Computer Header */}
                  <div className="border-b px-4 py-3 flex items-center justify-between bg-card">
                    <div className="flex items-center gap-2">
                      <Y0LogoMark size={20} className="text-primary" />
                      <span className="text-sm font-medium">y0 Computer</span>
                    </div>
                    <div className="flex items-center gap-1 border rounded-full bg-background p-1">
                      {(["terminal", "files", "browser"] as ViewType[]).map((view) => {
                        const Icon = view === "terminal" ? Zap : view === "files" ? FolderOpen : Globe;
                        return (
                          <div key={view} className="relative p-1.5">
                            {selectedView === view && (
                              <motion.div
                                layoutId="active-view"
                                className="absolute inset-0 bg-primary rounded-lg"
                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                              />
                            )}
                            <Icon
                              className={`w-4 h-4 relative z-10 ${
                                selectedView === view ? "text-primary-foreground" : "text-foreground"
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Computer Content */}
                  <div className="flex-1 flex items-center justify-center p-8 bg-background">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeExample}-${currentStepIndex}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="text-center flex flex-col items-center"
                      >
                        {renderContent()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
