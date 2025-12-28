import { motion } from "framer-motion";
import { WaitlistHero } from "@/components/waitlist/hero";
import { FeatureShowcase } from "@/components/waitlist/feature-showcase";
import { CapabilitiesGrid } from "@/components/waitlist/capabilities";
import { HowItWorks } from "@/components/waitlist/how-it-works";
import { SocialProof } from "@/components/waitlist/social-proof";
import { WaitlistCTA } from "@/components/waitlist/cta";
import { WaitlistFooter } from "@/components/waitlist/footer";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    }
  },
};

const Index = () => {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-background text-foreground overflow-x-hidden"
    >
      <WaitlistHero />
      <FeatureShowcase />
      <CapabilitiesGrid />
      <HowItWorks />
      <SocialProof />
      <WaitlistCTA />
      <WaitlistFooter />
    </motion.main>
  );
};

export default Index;
