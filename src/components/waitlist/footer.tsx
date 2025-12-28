import { motion } from "framer-motion";
import { Y0LogoMark } from "@/components/ui/y0-logo";
import { Twitter, Github, MessageCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

const socialLinks = [
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: MessageCircle, label: "Discord", href: "#" },
];

export const WaitlistFooter = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="text-primary"
            >
              <Y0LogoMark size={28} />
            </motion.div>
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} y0. All rights reserved.
            </span>
          </div>

          {/* Powered by Compyle */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Powered by</span>
            <Link 
              to="/compyle"
              className="opacity-60 hover:opacity-100 transition-opacity"
            >
              <img 
                src="https://www.compyle.ai/compyle.svg" 
                alt="Compyle" 
                className="h-5 w-auto"
              />
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Tooltip key={social.label}>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                    >
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Coming Soon</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
