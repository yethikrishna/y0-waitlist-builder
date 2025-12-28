import { supabase } from "@/integrations/supabase/client";

export interface WaitlistSignup {
  email: string;
  referredBy?: string;
}

export interface WaitlistResult {
  success: boolean;
  position?: number;
  referralCode?: string;
  referralCount?: number;
  spotsGained?: number;
  error?: string;
}

// Client-side validation (server also validates)
const isValidEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  if (email.length > 255) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidReferralCode = (code: string | undefined): boolean => {
  if (!code) return true;
  if (typeof code !== 'string') return false;
  return /^[a-f0-9]{12}$/i.test(code.trim());
};

export async function signupToWaitlist(data: WaitlistSignup): Promise<WaitlistResult> {
  try {
    const email = data.email.toLowerCase().trim();
    
    // Client-side validation
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: 'Please enter a valid email address'
      };
    }

    if (data.referredBy && !isValidReferralCode(data.referredBy)) {
      return {
        success: false,
        error: 'Invalid referral code format'
      };
    }

    // Call secure edge function for signup
    const { data: result, error } = await supabase.functions.invoke('waitlist-signup', {
      body: {
        email,
        referredBy: data.referredBy?.trim() || null
      }
    });

    if (error) {
      console.error('Waitlist signup error:', error);
      return {
        success: false,
        error: 'Failed to join waitlist. Please try again.'
      };
    }

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to join waitlist. Please try again.'
      };
    }

    // Handle already exists case
    if (result.alreadyExists) {
      return {
        success: true,
        position: result.position,
        referralCode: result.referralCode,
        referralCount: result.referralCount || 0,
        spotsGained: result.spotsGained || 0,
        error: "You're already on the waitlist!"
      };
    }

    return {
      success: true,
      position: result.position,
      referralCode: result.referralCode,
      referralCount: result.referralCount || 0,
      spotsGained: result.spotsGained || 0
    };
  } catch (err) {
    console.error('Waitlist signup exception:', err);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    };
  }
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('get_waitlist_count');

    if (error) {
      console.error('Error fetching waitlist count:', error);
      return 0;
    }

    return data || 0;
  } catch (err) {
    console.error('Exception fetching waitlist count:', err);
    return 0;
  }
}
