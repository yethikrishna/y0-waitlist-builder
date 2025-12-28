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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

export default function Terms() {
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
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: December 28, 2025</p>
        </motion.div>

        <motion.div variants={itemVariants} className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using y0 ("the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Service. We reserve the right 
              to update these terms at any time, and your continued use of the Service constitutes 
              acceptance of any changes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              y0 is an AI agent platform that can browse the web, write code, create content, and 
              complete tasks autonomously. The Service is provided on an "as is" and "as available" 
              basis. We are currently in a waitlist phase and full service features will be available 
              upon launch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              To access certain features of the Service, you may be required to create an account. 
              You are responsible for maintaining the confidentiality of your account credentials 
              and for all activities that occur under your account. You agree to notify us immediately 
              of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Generate harmful, illegal, or malicious content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use the Service for any fraudulent or deceptive purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service and its original content, features, and functionality are owned by y0 
              and are protected by international copyright, trademark, patent, trade secret, and 
              other intellectual property laws. Content you create using the Service remains your 
              property, subject to our license to operate the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, y0 shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, 
              loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
              use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is provided "as is" without warranties of any kind, either express or 
              implied, including, but not limited to, implied warranties of merchantability, 
              fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your access to the Service immediately, without prior 
              notice or liability, for any reason, including without limitation if you breach 
              these Terms. Upon termination, your right to use the Service will immediately cease.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction in which y0 operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@y0.ai" className="text-foreground hover:underline">legal@y0.ai</a>.
            </p>
          </section>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-16 pt-8 border-t border-border">
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
