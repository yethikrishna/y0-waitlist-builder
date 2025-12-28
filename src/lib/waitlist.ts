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
  referralCount?: number;
  spotsGained?: number;
  error?: string;
}

export async function signupToWaitlist(data: WaitlistSignup): Promise<WaitlistResult> {
  try {
    // Check if email already exists using edge function (secure)
    const { data: checkResult, error: checkError } = await supabase.functions.invoke('check-email-exists', {
      body: { email: data.email.toLowerCase().trim() }
    });

    if (checkError) {
      console.error('Error checking email:', checkError);
      return {
        success: false,
        error: 'Failed to check email. Please try again.'
      };
    }

    if (checkResult.exists) {
      const spotsGained = (checkResult.referralCount || 0) * 5;
      return {
        success: true,
        position: checkResult.position,
        referralCode: checkResult.referralCode,
        referralCount: checkResult.referralCount || 0,
        spotsGained,
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

    // Send admin notification (fire and forget)
    supabase.functions.invoke('notify-admin-signup', {
      body: {
        email: data.email.toLowerCase().trim(),
        position: signup.position,
        referredBy: data.referredBy || null,
        totalSignups: signup.position
      }
    }).catch(err => console.error('Failed to send admin notification:', err));

    return {
      success: true,
      position: signup.position,
      referralCode: signup.referral_code,
      referralCount: 0,
      spotsGained: 0
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
    // Use the secure RPC function
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