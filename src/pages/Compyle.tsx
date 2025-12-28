import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Y0LogoMark } from '@/components/ui/y0-logo';

function BackArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
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

export default function Compyle() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BackArrowIcon className="w-4 h-4" />
            Back to y0
          </Link>
          <Link to="/" className="text-primary">
            <Y0LogoMark size={24} />
          </Link>
        </div>
      </header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-6 py-16 max-w-3xl"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-8 rounded-2xl border border-border bg-card mb-8">
            <img 
              src="https://www.compyle.ai/compyle.svg" 
              alt="Compyle" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">The AI Coding Agent</h1>
          <p className="text-muted-foreground">
            Collaborative AI-powered development
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="h-px bg-border mb-16" />

        {/* What is Compyle */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-xl font-semibold mb-6">What is Compyle?</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Compyle is an AI-powered collaborative coding agent for software developers. 
              Unlike autonomous AI tools, Compyle works with you—asking clarifying questions, 
              planning together, and validating changes against your project patterns.
            </p>
            <p>
              It integrates with your code repositories, automates pull requests, and keeps 
              you in control throughout the development process.
            </p>
          </div>
          <a 
            href="https://compyle.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-primary hover:underline"
          >
            Visit Compyle.ai
            <ExternalLinkIcon className="w-4 h-4" />
          </a>
        </motion.section>

        <motion.div variants={itemVariants} className="h-px bg-border mb-16" />

        {/* How Compyle helped build y0 */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-xl font-semibold mb-6">How Compyle helped build y0</h2>
          <div className="relative rounded-2xl border border-border bg-card p-8">
            <QuoteIcon className="absolute top-6 left-6 w-12 h-12 opacity-10" />
            <blockquote className="relative z-10">
              <p className="text-lg leading-relaxed mb-6 pl-4">
                "Compyle really helped in building y0—from setting up the basic framework 
                to making critical design decisions. The collaborative approach meant we 
                could move fast without losing control of the architecture."
              </p>
              <footer className="flex items-center gap-3 pl-4">
                <div className="text-primary">
                  <Y0LogoMark size={20} />
                </div>
                <span className="text-sm font-medium">y0 Team</span>
              </footer>
            </blockquote>
          </div>
        </motion.section>

        <motion.div variants={itemVariants} className="h-px bg-border mb-16" />

        {/* Mark's Quote */}
        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-xl font-semibold mb-6">Mark Nazzaro, CTO of Compyle, on y0:</h2>
          <div className="relative rounded-2xl border border-border bg-card p-8">
            <QuoteIcon className="absolute top-6 left-6 w-12 h-12 opacity-10" />
            <blockquote className="relative z-10">
              <p className="text-lg leading-relaxed mb-6 pl-4">
                "Nice, it's like ChatGPT that can save files for me! It looks very nice."
              </p>
              <footer className="flex items-center gap-3 pl-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  MN
                </div>
                <div>
                  <div className="text-sm font-medium">Mark Nazzaro</div>
                  <div className="text-xs text-muted-foreground">CTO, Compyle</div>
                </div>
              </footer>
            </blockquote>
          </div>
        </motion.section>

        <motion.div variants={itemVariants} className="h-px bg-border mb-16" />

        {/* Back Link */}
        <motion.div variants={itemVariants} className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <BackArrowIcon className="w-4 h-4" />
            Back to Waitlist
          </Link>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © 2025 y0 · <Link to="/terms" className="hover:text-foreground">Terms</Link> · <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
