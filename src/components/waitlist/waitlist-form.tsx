import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, Share2, Twitter, Linkedin, Copy, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { signupToWaitlist } from "@/lib/waitlist";
import { fireConfetti } from "@/lib/confetti";

interface WaitlistFormProps {
  variant?: "hero" | "cta";
}

export const WaitlistForm = ({ variant = "hero" }: WaitlistFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralCount, setReferralCount] = useState<number>(0);
  const [spotsGained, setSpotsGained] = useState<number>(0);
  const [error, setError] = useState("");
  const [referredBy, setReferredBy] = useState<string | null>(null);

  // Extract referral code from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get("ref");
    if (ref) {
      setReferredBy(ref);
    }
  }, []);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }

    setIsLoading(true);

    const result = await signupToWaitlist({ 
      email,
      referredBy: referredBy || undefined
    });

    setIsLoading(false);

    if (result.success) {
      setPosition(result.position || null);
      setReferralCode(result.referralCode || null);
      setReferralCount(result.referralCount || 0);
      setSpotsGained(result.spotsGained || 0);
      setIsSuccess(true);

      // Fire confetti celebration!
      setTimeout(() => {
        fireConfetti();
      }, 100);

      if (result.error) {
        // Already on waitlist case
        toast.info(result.error, {
          description: `You're #${result.position?.toLocaleString()} in line`,
        });
      } else {
        toast.success("You're on the list!", {
          description: `You're #${result.position?.toLocaleString()} in line`,
        });
      }
    } else {
      setError(result.error || "Something went wrong");
      toast.error(result.error || "Failed to join waitlist");
    }
  };

  const handleShare = (platform: "twitter" | "linkedin" | "copy") => {
    const shareText = "Just joined the waitlist for y0 - The AI that actually gets things done. Join me! 🚀";
    const shareUrl = referralCode 
      ? `${window.location.origin}?ref=${referralCode}`
      : window.location.href;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
        break;
    }
  };

  const inputSize = variant === "cta" ? "h-14" : "h-12";
  const buttonSize = variant === "cta" ? "h-14 px-10" : "h-12 px-8";

  return (
    <AnimatePresence mode="wait">
      {!isSuccess ? (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="flex-1 relative">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputSize} px-5 rounded-full border-border bg-card focus:ring-2 focus:ring-ring transition-all duration-200`}
                disabled={isLoading}
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm mt-2 ml-4"
                >
                  {error}
                </motion.p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className={`${buttonSize} rounded-full bg-primary text-primary-foreground font-medium hover:scale-[1.02] transition-transform duration-200 gap-2`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Join Waitlist
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 380, damping: 30 }}
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4"
          >
            <Check className="w-8 h-8 text-primary-foreground" />
          </motion.div>

          <h3 className="text-2xl font-bold mb-2">You're on the list! 🎉</h3>
          <p className="text-muted-foreground mb-4">
            You're <span className="font-semibold text-foreground">#{position?.toLocaleString()}</span> in line
          </p>

          {/* Referral Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-muted/50 rounded-xl p-4 mb-6 border border-border"
          >
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Referrals:</span>
                <span className="font-semibold">{referralCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Spots gained:</span>
                <span className="font-semibold text-primary">{spotsGained}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Each referral moves you up 5 spots!
            </p>
          </motion.div>

          <p className="text-sm text-muted-foreground mb-4">
            Share your link to skip the line:
          </p>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare("copy")}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
