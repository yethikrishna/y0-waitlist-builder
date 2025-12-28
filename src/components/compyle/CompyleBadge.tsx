import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import compyleLogo from '@/assets/compyle-logo.svg';
import { HelpCircle } from 'lucide-react';

export function CompyleBadge() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link 
      to="/compyle"
      className="inline-flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-border bg-card/80 backdrop-blur-sm hover:bg-card hover:border-primary/30 transition-all shadow-sm group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-sm text-muted-foreground font-medium">Runs on</span>
      <img 
        src={compyleLogo} 
        alt="Compyle" 
        className="h-6 w-auto"
      />
      <span className="text-sm font-semibold text-foreground">Compyle</span>
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: -5 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
