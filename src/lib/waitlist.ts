import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface WaitlistSignup {
  email: string;
  referredBy?: string;
  metadata?: Json;
}

export interface WaitlistResult {
  success: boolean;
  position?: number;
  referralCode?: string;
  error?: string;
}

export async function signupToWaitlist(data: WaitlistSignup): Promise<WaitlistResult> {
  try {
    // Check if email already exists
    const { data: existing } = await supabase
      .from('waitlist_signups')
      .select('id, position, referral_code')
      .eq('email', data.email.toLowerCase().trim())
      .maybeSingle();

    if (existing) {
      return {
        success: true,
        position: existing.position,
        referralCode: existing.referral_code,
        error: "You're already on the waitlist!"
      };
    }

    // Insert new signup
    const insertData = {
      email: data.email.toLowerCase().trim(),
      referred_by: data.referredBy || null,
      metadata: data.metadata || null
    };

    const { data: signup, error } = await supabase
      .from('waitlist_signups')
      .insert([insertData])
      .select('position, referral_code')
      .single();

    if (error) {
      console.error('Waitlist signup error:', error);
      return {
        success: false,
        error: 'Failed to join waitlist. Please try again.'
      };
    }

    return {
      success: true,
      position: signup.position,
      referralCode: signup.referral_code
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
    const { count, error } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching waitlist count:', error);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error('Exception fetching waitlist count:', err);
    return 0;
  }
}
